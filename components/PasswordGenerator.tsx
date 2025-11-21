import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Check, Settings, Key, Lock } from 'lucide-react';
import { generatePassword, generateKey, calculateStrength, GeneratorMode, PasswordOptions } from '../utils/generatorLogic';

export const PasswordGenerator: React.FC = () => {
  const [mode, setMode] = useState<GeneratorMode>('password');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: false,
  });

  // Initial generation
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Small timeout to allow UI to show "generating" state if calculation was heavy (not really here, but good UX pattern)
    setTimeout(() => {
      let output = '';
      if (mode === 'password') {
        output = generatePassword(options);
      } else if (mode === 'key-hex') {
        output = generateKey(options.length, 'hex');
      } else if (mode === 'key-base64') {
        output = generateKey(options.length, 'base64');
      }
      setResult(output);
      setCopied(false);
      setIsGenerating(false);
    }, 150);
  }, [mode, options]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const toggleOption = (key: keyof PasswordOptions) => {
    setOptions(prev => {
        // Prevent disabling all character sets in password mode
        if (key !== 'length' && key !== 'avoidAmbiguous' && mode === 'password') {
            const isDisabling = prev[key];
            const activeCount = [prev.uppercase, prev.lowercase, prev.numbers, prev.symbols].filter(Boolean).length;
            if (isDisabling && activeCount <= 1) return prev;
        }
        return { ...prev, [key]: !prev[key] };
    });
  };

  const strength = mode === 'password' ? calculateStrength(result) : 'แข็งแกร่ง';
  const strengthColor = 
    strength === 'อ่อน' ? 'bg-red-500' : 
    strength === 'ปานกลาง' ? 'bg-yellow-500' : 
    'bg-green-500';

  return (
    <div className="w-full max-w-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-900/50 rounded-xl">
        <button 
            onClick={() => setMode('password')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${mode === 'password' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
            <Lock className="w-4 h-4" /> รหัสผ่าน
        </button>
        <button 
            onClick={() => setMode('key-hex')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${mode === 'key-hex' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
            <Key className="w-4 h-4" /> คีย์ (Hex)
        </button>
        <button 
            onClick={() => setMode('key-base64')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${mode === 'key-base64' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
            <Key className="w-4 h-4" /> คีย์ (Base64)
        </button>
      </div>

      {/* Display Box */}
      <div className="relative group mb-6">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
          <input 
            key={result}
            type="text" 
            value={result} 
            readOnly
            className="w-full bg-transparent p-5 text-lg md:text-xl font-mono text-slate-200 outline-none placeholder-slate-600 animate-fade-in"
            placeholder="ผลลัพธ์จะปรากฏที่นี่..."
          />
          <div className="flex items-center pr-2 border-l border-slate-800 h-full bg-slate-900/50">
            <button 
              onClick={handleCopy}
              className="p-3 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors relative"
              title="คัดลอก"
            >
              {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
              {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                  คัดลอกแล้ว!
                </span>
              )}
            </button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`p-3 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all ${isGenerating ? 'animate-spin' : ''}`}
              title="สร้างใหม่"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>
        {mode === 'password' && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>ความปลอดภัย:</span>
            <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${strengthColor}`}></span>
                {strength}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-6">
        
        {/* Length Slider */}
        <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
                <label className="text-slate-300 font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    ความยาว (Length)
                </label>
                <span className="bg-slate-800 text-brand-secondary px-3 py-1 rounded-md font-mono font-bold">
                    {options.length}
                </span>
            </div>
            <input 
                type="range" 
                min="4" 
                max="128" 
                value={options.length}
                onChange={(e) => setOptions({...options, length: Number(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>4</span>
                <span>128</span>
            </div>
        </div>

        {/* Checkboxes - Only show for Password mode */}
        {mode === 'password' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center p-3 bg-slate-900/30 rounded-lg border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors select-none">
                    <input 
                        type="checkbox" 
                        checked={options.uppercase}
                        onChange={() => toggleOption('uppercase')}
                        className="w-5 h-5 rounded border-slate-600 text-brand-primary focus:ring-brand-primary/50 bg-slate-800"
                    />
                    <span className="ml-3 text-slate-300">ตัวพิมพ์ใหญ่ (A-Z)</span>
                </label>

                <label className="flex items-center p-3 bg-slate-900/30 rounded-lg border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors select-none">
                    <input 
                        type="checkbox" 
                        checked={options.lowercase}
                        onChange={() => toggleOption('lowercase')}
                        className="w-5 h-5 rounded border-slate-600 text-brand-primary focus:ring-brand-primary/50 bg-slate-800"
                    />
                    <span className="ml-3 text-slate-300">ตัวพิมพ์เล็ก (a-z)</span>
                </label>

                <label className="flex items-center p-3 bg-slate-900/30 rounded-lg border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors select-none">
                    <input 
                        type="checkbox" 
                        checked={options.numbers}
                        onChange={() => toggleOption('numbers')}
                        className="w-5 h-5 rounded border-slate-600 text-brand-primary focus:ring-brand-primary/50 bg-slate-800"
                    />
                    <span className="ml-3 text-slate-300">ตัวเลข (0-9)</span>
                </label>

                <label className="flex items-center p-3 bg-slate-900/30 rounded-lg border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors select-none">
                    <input 
                        type="checkbox" 
                        checked={options.symbols}
                        onChange={() => toggleOption('symbols')}
                        className="w-5 h-5 rounded border-slate-600 text-brand-primary focus:ring-brand-primary/50 bg-slate-800"
                    />
                    <span className="ml-3 text-slate-300">อักขระพิเศษ (!@#$)</span>
                </label>

                <label className="flex items-center p-3 bg-slate-900/30 rounded-lg border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors select-none md:col-span-2">
                    <input 
                        type="checkbox" 
                        checked={options.avoidAmbiguous}
                        onChange={() => toggleOption('avoidAmbiguous')}
                        className="w-5 h-5 rounded border-slate-600 text-brand-secondary focus:ring-brand-secondary/50 bg-slate-800"
                    />
                    <div className="ml-3 flex flex-col">
                        <span className="text-slate-300">หลีกเลี่ยงตัวอักษรที่สับสน</span>
                        <span className="text-xs text-slate-500">ไม่ใช้: 0, O, I, l, 1</span>
                    </div>
                </label>
            </div>
        )}

        {/* Action Button */}
        <button 
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-primary/20 transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
        >
            {mode === 'password' ? 'สร้างรหัสผ่าน' : 'สร้างคีย์'}
        </button>

      </div>
    </div>
  );
};