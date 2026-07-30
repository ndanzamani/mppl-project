import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import FloatingBackground3D from '@/Components/3D/FloatingBackground3D';
import { Shield, Sparkles } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 pt-6 sm:justify-center sm:pt-0 relative overflow-hidden font-sans">
            {/* Floating CSS 3D shapes */}
            <FloatingBackground3D />

            {/* Medieval Wax Seal Header Logo */}
            <div className="relative z-10 flex flex-col items-center space-y-2">
                <Link href="/" className="group flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-1 shadow-2xl shadow-amber-500/40 group-hover:scale-105 transition-transform border-2 border-amber-300">
                        <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-amber-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-amber-400 tracking-wider mt-2 flex items-center gap-1.5">
                        GUILDHALL
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    </h1>
                    <p className="text-xs text-amber-200/70 font-semibold">
                        Medieval Realm of Employees & Adventurers
                    </p>
                </Link>
            </div>

            {/* Medieval Parchment Style Form Container */}
            <div className="mt-6 w-full overflow-hidden bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950 border-2 border-amber-500/30 backdrop-blur-xl px-8 py-8 shadow-2xl shadow-amber-950/50 sm:max-w-md sm:rounded-3xl relative z-10 border-t-amber-400">
                {children}
            </div>
        </div>
    );
}
