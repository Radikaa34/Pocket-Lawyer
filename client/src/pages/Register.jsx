import { Check, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  if (isAuthenticated) return <div className="page-wrap"><div className="empty-state"><h3>You’re already signed in</h3><Link href="/dashboard" className="button" style={{ marginTop: 20 }}>Open dashboard</Link></div></div>;
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match.');
    setBusy(true);
    try { await register(form); toast.success('Account created'); navigate('/dashboard'); }
    catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };
  return <div className="login-layout"><section className="login-info"><div className="eyebrow">Private workspace</div><h1>Keep the useful parts of your research.</h1><p>Save topics, revisit searches, and organize reference documents while you work out your next step.</p><div className="login-list"><span><Check size={15}/>Save topics to your private library</span><span><Check size={15}/>Ask questions about your own documents</span><span><Check size={15}/>Keep your activity private</span></div></section><section className="login-card"><LockKeyhole size={20} color="var(--gold)"/><h2>Create an account</h2><p>Your password is hashed with bcrypt before it is stored. Registration uses the Express REST API.</p><form className="form-stack" onSubmit={submit}><div className="field"><label>Name</label><input required value={form.name} onChange={update('name')} autoComplete="name" /></div><div className="field"><label>Email</label><input required type="email" value={form.email} onChange={update('email')} autoComplete="email" /></div><div className="field"><label>Password</label><input required minLength="8" type="password" value={form.password} onChange={update('password')} autoComplete="new-password" /></div><div className="field"><label>Confirm password</label><input required type="password" value={form.confirmPassword} onChange={update('confirmPassword')} autoComplete="new-password" /></div><button className="button" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button></form><div className="login-footnote">This product provides general legal information only. <Link to="/login">Already have an account? Sign in.</Link></div></section></div>;
}
