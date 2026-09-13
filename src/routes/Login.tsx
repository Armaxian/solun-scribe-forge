import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/hooks/use-session';
import { safeAuthRedirect } from '@/lib/auth-redirect';
import { sanitizeSupabaseError } from '@/lib/error-sanitizer';
import { signInWithEmail, signInWithMagicLink, signInWithOAuth, signUp, supabase } from '@/lib/supabase';
import { validateEmail } from '@/lib/validation';

type Mode = 'signin' | 'signup' | 'magic' | 'forgot' | 'reset';
const titles: Record<Mode, string> = {
  signin: 'Sign in to Solun', signup: 'Create your account', magic: 'Sign in with an email link',
  forgot: 'Reset your password', reset: 'Choose a new password',
};

export default function Login() {
  const [params, setParams] = useSearchParams();
  const mode: Mode = ['signup', 'magic', 'forgot', 'reset'].includes(params.get('mode') ?? '') ? params.get('mode') as Mode : 'signin';
  const redirect = safeAuthRedirect(params.get('redirect'));
  const { user, loading: sessionLoading, error: sessionError } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    return params.has('error') || hash.has('error') ? 'This sign-in link could not be used. Please request a new link or sign in again.' : '';
  });
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const needsPassword = mode === 'signin' || mode === 'signup' || mode === 'reset';

  const changeMode = (next: Mode) => {
    setParams({ mode: next, redirect }, { replace: true });
    setError(''); setMessage(''); setPassword(''); setConfirmation('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(''); setMessage('');
    const validated = validateEmail(email);
    if (mode !== 'reset' && !validated.valid) { setError(validated.error ?? 'Enter a valid email.'); return; }
    if ((mode === 'signup' || mode === 'reset') && password.length < 12) { setError('Use at least 12 characters for your password.'); return; }
    if ((mode === 'signup' || mode === 'reset') && password !== confirmation) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const address = validated.sanitized || email;
      if (mode === 'reset') {
        if (!user) throw new Error('Open the password reset link from your email first.');
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPasswordUpdated(true);
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(address, {
          redirectTo: `${window.location.origin}/login?mode=reset&redirect=${encodeURIComponent(redirect)}`,
        });
        if (error) throw error;
        setMessage('If an account exists for this email, you will receive a password reset link.');
      } else if (mode === 'magic') {
        const { error } = await signInWithMagicLink(address, redirect);
        if (error) throw error;
        setMessage('Check your email for a sign-in link. You can close this page; the link will return you to Solun.');
      } else if (mode === 'signup') {
        const { data, error } = await signUp(address, password, redirect);
        if (error) throw error;
        if (!data.session) setMessage('Check your email to confirm your account. If you already have an account, sign in or reset your password.');
      } else {
        const { error } = await signInWithEmail(address, password);
        if (error) throw error;
      }
    } catch (error) {
      setError(sanitizeSupabaseError(error as { message?: string; code?: string }, 'authentication'));
    } finally { setBusy(false); }
  };

  const oauth = async (provider: 'google' | 'apple') => {
    setBusy(true); setError('');
    try {
      const { error } = await signInWithOAuth(provider, redirect);
      if (error) throw error;
    } catch (error) {
      setError(sanitizeSupabaseError(error as { message?: string; code?: string }, 'authentication'));
    } finally { setBusy(false); }
  };

  if (!sessionLoading && user && (mode !== 'reset' || passwordUpdated)) return <Navigate to={redirect} replace />;

  return <>
    <Helmet><title>{titles[mode]} - Solun</title><meta name="robots" content="noindex, nofollow" /></Helmet>
    <div className="section flex min-h-[75vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="card-hover space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{titles[mode]}</h1>
            <p className="text-muted-foreground">An account connects your AI access and billing. Explore Solun and write locally without signing in.</p>
          </div>
          {(error || sessionError) && <p role="alert" className="text-sm text-destructive">{error || sessionError}</p>}
          {message && <p role="status" className="text-sm">{message}</p>}
          {mode === 'reset' && !sessionLoading && !user ? <div className="space-y-3">
            <p>Your reset link is missing or has expired. Request a new one to continue.</p>
            <Button onClick={() => changeMode('forgot')}>Request a new reset link</Button>
          </div> : <form onSubmit={submit} className="space-y-4">
            <fieldset disabled={busy || sessionLoading} className="space-y-4">
              {mode !== 'reset' && <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} />
              </div>}
              {needsPassword && <div className="space-y-2">
                <Label htmlFor="password">{mode === 'reset' ? 'New password' : 'Password'}</Label>
                <Input id="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === 'signin' ? 1 : 12} />
                {mode !== 'signin' && <p className="text-sm text-muted-foreground">Use at least 12 characters.</p>}
              </div>}
              {(mode === 'signup' || mode === 'reset') && <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} required />
              </div>}
              <Button type="submit" className="w-full">{busy ? 'Please wait…' : mode === 'magic' ? 'Send sign-in link' : mode === 'forgot' ? 'Send reset link' : mode === 'reset' ? 'Save password' : mode === 'signup' ? 'Create account' : 'Sign in'}</Button>
            </fieldset>
          </form>}
          {(mode === 'signin' || mode === 'signup' || mode === 'magic') && <>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" disabled={busy || sessionLoading} onClick={() => oauth('google')}>Google</Button>
              <Button variant="outline" disabled={busy || sessionLoading} onClick={() => oauth('apple')}>Apple</Button>
            </div>
            <p className="text-xs text-muted-foreground">By continuing, you agree to the <Link className="underline" to="/terms">Terms</Link> and acknowledge the <Link className="underline" to="/privacy">Privacy Policy</Link>.</p>
          </>}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {mode !== 'signin' && <button disabled={busy} onClick={() => changeMode('signin')} className="underline">Sign in with password</button>}
            {mode === 'signin' && <>
              <button disabled={busy} onClick={() => changeMode('signup')} className="underline">Create an account</button>
              <button disabled={busy} onClick={() => changeMode('forgot')} className="underline">Forgot password?</button>
              <button disabled={busy} onClick={() => changeMode('magic')} className="underline">Use an email link</button>
            </>}
          </div>
        </div>
        <p className="text-center"><Link to="/download" className="underline">Continue without an account</Link></p>
      </div>
    </div>
  </>;
}
