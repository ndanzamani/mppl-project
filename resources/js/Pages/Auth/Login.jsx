import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Swords, Lock, Mail, Sparkles, Globe } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@guildhall.io',
        password: 'password',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Begin Your Adventure - GuildHall" />

            <div className="space-y-4 text-center mb-6">
                <h2 className="text-xl font-black text-amber-300 flex items-center justify-center gap-2">
                    <Swords className="w-5 h-5 text-amber-400" />
                    Begin Your Adventure
                </h2>
                <p className="text-xs text-amber-100/70">
                    Enter your adventurer credentials or register a new account to enter the workspace.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
                    {status}
                </div>
            )}

            {/* Google OAuth Button */}
            <div className="space-y-3 mb-5">
                <a
                    href="/auth/google"
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-200 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                >
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>Continue with Google</span>
                </a>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-amber-500/20" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-amber-500/60">Or Sign In With Email</span>
                    <div className="flex-1 h-px bg-amber-500/20" />
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Adventurer Email" className="text-xs font-bold text-amber-200" />

                    <div className="relative mt-1">
                        <Mail className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <InputError message={errors.email} className="mt-1 text-xs text-rose-400" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Passcode / Password" className="text-xs font-bold text-amber-200" />

                    <div className="relative mt-1">
                        <Lock className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>

                    <InputError message={errors.password} className="mt-1 text-xs text-rose-400" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs font-semibold text-amber-200/80">Remember My Scroll</span>
                    </label>

                    <Link
                        href={route('register')}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
                    >
                        Register New Account
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Begin Your Adventure</span>
                </button>
            </form>
        </GuestLayout>
    );
}
