import { Check,LockKeyhole,ShieldCheck } from 'lucide-react'; 
import { useState } from 'react';
import { Link,useLocation } from '@/router';
import { toast } from 'sonner'; 
import { useAuth } from '@/context/AuthContext';
export default function Login(){
    const [location,navigate]=useLocation();
    const registerMode=location.startsWith('/register');
    const {login,register,isAuthenticated}=useAuth();
    const [form,setForm]=useState({name:'',email:'',password:'',confirmPassword:''});
    const [busy,setBusy]=useState(false);if(isAuthenticated)
        return <div className="page-wrap">
            <div className="empty-state">
                <h3>You’re already signed in
                    </h3><Link href="/dashboard" className="button" style={{marginTop:20}}>Open dashboard</Link>
                    </div>
                    </div>;
                    const submit=async e=>{e.preventDefault();setBusy(true);
                        try{if(registerMode)await register(form);
                            else await login({email:form.email,password:form.password});
                            toast.success(registerMode?'Account created':'Welcome back');
                            navigate('/dashboard')}
                            catch(err){toast.error(err.message)}
                            finally{setBusy(false)}}
                            ;return <div className="login-layout"><section className="login-info">
                                <div className="eyebrow">Private workspace</div>
                                <h1>{registerMode?'Keep the useful parts of your research.':'Continue to Pocket Lawyer.'}</h1>
                                <p>Save topics, revisit searches, and organize reference documents while you work out your next step.</p>
                                <div className="login-list"><span><Check size={15}/>Save topics to your private library</span>
                                <span><Check size={15}/>Ask questions about your own documents</span><span><Check size={15}/>Keep your activity private</span></div>
                                </section>
                                <section className="login-card"><LockKeyhole size={20} color="var(--gold)"/>
                                <h2>{registerMode?'Create an account':'Sign in securely'}</h2><p>Passwords are hashed with bcrypt and sessions use signed JWTs.</p><form className="form-stack" onSubmit={submit}>{registerMode&&<div className="field"><label>Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>}<div className="field"><label>Email</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><div className="field"><label>Password</label><input required minLength="8" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>{registerMode&&<div className="field"><label>Confirm password</label><input required type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})}/></div>}<button className="button" disabled={busy}>{busy?'Working…':registerMode?'Create account':'Sign in'}</button></form><div className="login-footnote">This product provides general legal information only. {registerMode?<><Link href="/login">Already have an account? Sign in.</Link></>:<>New here? <Link href="/register">Create an account.</Link></>}</div></section></div>}
