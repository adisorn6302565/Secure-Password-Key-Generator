import React from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { PasswordGenerator } from './components/PasswordGenerator';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans selection:bg-brand-secondary selection:text-brand-dark">
      {/* Background Animation */}
      <ParticleBackground />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-4xl px-4 py-8 flex flex-col flex-grow">
        
        {/* Header */}
        <header className="text-center mb-10 pt-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4 border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-10 h-10 text-brand-secondary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary mb-4 drop-shadow-sm">
            ตัวสร้างรหัสผ่าน & คีย์ลับปลอดภัย
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            สร้างรหัสผ่านหรือคีย์แบบสุ่ม ปลอดภัย 100% บนเบราว์เซอร์ของคุณ <br className="hidden md:block" />
            <span className="text-brand-secondary/80">ไม่มีการส่งข้อมูลไปที่ใดทั้งสิ้น (Client-side only)</span>
          </p>
        </header>

        {/* Main Card */}
        <main className="flex-grow flex justify-center">
          <PasswordGenerator />
        </main>
      </div>
    </div>
  );
};

export default App;