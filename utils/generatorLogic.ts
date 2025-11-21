// Utility types and functions for generation

export type GeneratorMode = 'password' | 'key-hex' | 'key-base64';

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

const AMBIGUOUS_CHARS = ['0', 'O', 'I', 'l', '1'];

const CHARSET = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

export const generatePassword = (options: PasswordOptions): string => {
  let charPool = '';
  
  if (options.uppercase) charPool += CHARSET.upper;
  if (options.lowercase) charPool += CHARSET.lower;
  if (options.numbers) charPool += CHARSET.number;
  if (options.symbols) charPool += CHARSET.symbol;

  if (options.avoidAmbiguous) {
    // Escape special regex characters for the split
    const escapedAmbiguous = AMBIGUOUS_CHARS.map(c => c.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`[${escapedAmbiguous.join('')}]`, 'g');
    charPool = charPool.replace(regex, '');
  }

  if (charPool.length === 0) return '';

  const cryptoObj = window.crypto;
  const array = new Uint32Array(options.length);
  cryptoObj.getRandomValues(array);

  let result = '';
  for (let i = 0; i < options.length; i++) {
    result += charPool[array[i] % charPool.length];
  }

  return result;
};

export const generateKey = (length: number, type: 'hex' | 'base64'): string => {
  const cryptoObj = window.crypto;
  // length in bytes roughly correlates to characters but structure varies. 
  // For simplicity in UI, we interpret length as the number of random bytes to generate.
  const array = new Uint8Array(length);
  cryptoObj.getRandomValues(array);

  if (type === 'hex') {
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // type === 'base64'
    let binary = '';
    const len = array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(array[i]);
    }
    return window.btoa(binary);
  }
};

export const calculateStrength = (password: string): 'อ่อน' | 'ปานกลาง' | 'แข็งแกร่ง' => {
  let score = 0;
  if (!password) return 'อ่อน';
  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 5) return 'แข็งแกร่ง';
  if (score >= 3) return 'ปานกลาง';
  return 'อ่อน';
};