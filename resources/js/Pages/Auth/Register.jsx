import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Swords, Lock, Mail, User, Sparkles, Globe } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Join the Guild - Register" />

            <div className="space-y-4 text-center mb-6">
                <h2 className="text-xl font-black text-amber-300 flex items-center justify-center gap-2">
                    <Swords className="w-5 h-5 text-amber-400" />
                    Join the Guild & Create Account
                </h2>
                <p className="text-xs text-amber-100/70">
                    Register your email address to enter the workspace and join or create a company.
                </p>
            </div>

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
                    <span className="text-[10px] uppercase tracking-widest font-black text-amber-500/60">Or Register With Email</span>
                    <div className="flex-1 h-px bg-amber-500/20" />
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="text-xs font-bold text-amber-200" />
                    <div className="relative mt-1">
                        <User className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1 text-xs text-rose-400" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-xs font-bold text-amber-200" />
                    <div className="relative mt-1">
                        <Mail className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1 text-xs text-rose-400" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-xs font-bold text-amber-200" />
                    <div className="relative mt-1">
                        <Lock className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1 text-xs text-rose-400" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-xs font-bold text-amber-200" />
                    <div className="relative mt-1">
                        <Lock className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1 text-xs text-rose-400" />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <Link
                        href={route('login')}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
                    >
                        Already have an account? Log in
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Register Account</span>
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
