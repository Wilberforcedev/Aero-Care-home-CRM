import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ShieldCheck, UserCheck, HeartPulse, Sparkles, HelpCircle } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const PRESET_USERS: User[] = [
  {
    id: 'stf-1',
    name: 'Sarah Jenkins',
    role: 'Senior Caregiver',
    email: 's.jenkins@aerocare.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    shift: 'Morning (07:00-15:00)'
  },
  {
    id: 'stf-2',
    name: 'Michael Vance',
    role: 'Registered Nurse',
    email: 'm.vance@aerocare.com',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    shift: 'Morning (07:00-15:00)'
  },
  {
    id: 'stf-mgr',
    name: 'Dr. Eleanor Ross',
    role: 'Manager',
    email: 'e.ross@aerocare.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    shift: 'General Duty'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('s.jenkins@aerocare.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<User>(PRESET_USERS[0]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas 3D Geometric Wireframe Background Animation matching the screenshot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Icosahedron / Geodesic Sphere Vertices
    const vertices: { x: number; y: number; z: number }[] = [];
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;

    const rawVertices = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];

    rawVertices.forEach(([x, y, z]) => {
      const length = Math.sqrt(x * x + y * y + z * z);
      const scale = 180;
      vertices.push({
        x: (x / length) * scale,
        y: (y / length) * scale,
        z: (z / length) * scale
      });
    });

    const detailedVertices: { x: number; y: number; z: number }[] = [...vertices];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i].x - vertices[j].x;
        const dy = vertices[i].y - vertices[j].y;
        const dz = vertices[i].z - vertices[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 260 && dist > 100) {
          const midX = (vertices[i].x + vertices[j].x) * 0.5;
          const midY = (vertices[i].y + vertices[j].y) * 0.5;
          const midZ = (vertices[i].z + vertices[j].z) * 0.5;
          const len = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
          detailedVertices.push({
            x: (midX / len) * 180,
            y: (midY / len) * 180,
            z: (midZ / len) * 180
          });
        }
      }
    }

    // Floating particles
    const particles = Array.from({ length: 100 }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: (Math.random() - 0.5) * 800,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.3 + 0.1,
    }));

    let angleX = 0.003;
    let angleY = 0.005;

    const render = () => {
      ctx.fillStyle = '#021a10';
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.65;
      const centerY = height * 0.5;

      detailedVertices.forEach(v => {
        let x1 = v.x * Math.cos(angleY) - v.z * Math.sin(angleY);
        let z1 = v.z * Math.cos(angleY) + v.x * Math.sin(angleY);
        let y2 = v.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + v.y * Math.sin(angleX);

        v.x = x1;
        v.y = y2;
        v.z = z2;
      });

      ctx.lineWidth = 0.8;
      for (let i = 0; i < detailedVertices.length; i++) {
        for (let j = i + 1; j < detailedVertices.length; j++) {
          const v1 = detailedVertices[i];
          const v2 = detailedVertices[j];
          const dx = v1.x - v2.x;
          const dy = v1.y - v2.y;
          const dz = v1.z - v2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 140) {
            const alpha = Math.max(0.05, (140 - dist) / 140) * 0.45;
            ctx.strokeStyle = `rgba(180, 220, 200, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(centerX + v1.x, centerY + v1.y);
            ctx.lineTo(centerX + v2.x, centerY + v2.y);
            ctx.stroke();
          }
        }
      }

      detailedVertices.forEach(v => {
        const alpha = (v.z + 180) / 360;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.2, alpha * 0.8)})`;
        ctx.beginPath();
        ctx.arc(centerX + v.x, centerY + v.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach(p => {
        p.z -= p.speed;
        if (p.z < -400) p.z = 400;

        const scale = 300 / (300 + p.z);
        const px = width / 2 + p.x * scale;
        const py = height / 2 + p.y * scale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.fillStyle = `rgba(215, 240, 225, ${Math.min(0.7, scale * 0.4)})`;
          ctx.beginPath();
          ctx.moveTo(px, py - p.size);
          ctx.lineTo(px + p.size, py + p.size);
          ctx.lineTo(px - p.size, py + p.size);
          ctx.closePath();
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = PRESET_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || selectedPreset;
    onLogin(matchedUser);
  };

  const handleSelectPreset = (user: User) => {
    setSelectedPreset(user);
    setEmail(user.email);
  };

  return (
    <div className="min-h-screen bg-[#021a10] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-6 z-10 text-white text-center">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-14 h-14 bg-[#106e4e]/30 border-2 border-[#106e4e]/60 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md">
            <div className="w-11 h-11 bg-gradient-to-tr from-[#0a3a25] to-[#168a62] rounded-full flex items-center justify-center border border-white/20">
              <HeartPulse className="text-emerald-200 w-6 h-6" />
            </div>
          </div>
          <div className="text-left leading-none">
            <h1 className="text-3xl font-extrabold tracking-widest text-white font-serif">AERO</h1>
            <p className="text-sm font-light italic text-emerald-300 tracking-wider mt-0.5">CARE HOME CRM</p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-[#f8fafc] w-full max-w-md rounded-3xl p-8 md:p-10 shadow-2xl z-10 border border-white/10 relative">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sign in</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">Enter your staff credentials to continue</p>

        {/* Preset Shift Role Selector */}
        <div className="mb-6 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 px-1">
            Quick Shift Demo Login:
          </p>
          <div className="flex gap-1">
            {PRESET_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelectPreset(user)}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                  selectedPreset.id === user.id
                    ? 'bg-[#042416] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span>{user.name.split(' ')[0]}</span>
                <span className={`text-[10px] opacity-80 ${selectedPreset.id === user.id ? 'text-emerald-300' : ''}`}>
                  {user.role.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Staff Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="s.jenkins@aerocare.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-[#042416] focus:border-transparent outline-none transition-all text-sm text-gray-800"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <button 
                type="button" 
                onClick={() => alert('Demo environment: Simply click "Sign in" to access the Care Home Portal.')}
                className="text-xs text-[#106e4e] hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-[#042416] focus:border-transparent outline-none transition-all text-sm text-gray-800 pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#042416] text-white font-bold py-3.5 rounded-xl hover:bg-[#083a24] active:scale-[0.99] transition-all shadow-md text-sm mt-2 flex items-center justify-center gap-2"
          >
            <span>Sign in to Aero Portal</span>
          </button>
        </form>
      </div>

      <div className="mt-8 text-center z-10 text-white/80 text-xs space-y-1">
        <p className="text-white/90">
          Need assistance? <a href="#" onClick={(e) => { e.preventDefault(); alert('Please reach out to Shift Administrator at shift-admin@aerocare.com'); }} className="font-bold hover:underline text-emerald-300">Contact IT Desk</a>
        </p>
        <p className="text-white/50">
          © {new Date().getFullYear()} Aero Care Home CRM • Registered NHS Compliant Platform
        </p>
      </div>
    </div>
  );
};
