import { Toaster } from 'sonner';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/Layout';
import Home from '@/pages/Home'; import Explore from '@/pages/Explore';
import SearchPage from '@/pages/SearchPage'; 
import TopicDetail from '@/pages/TopicDetail'; 
import Dashboard from '@/pages/Dashboard'; 
import Bookmarks from '@/pages/Bookmarks'; 
import Documents from '@/pages/Documents'; 
import DocumentDetail from '@/pages/DocumentDetail'; 
import Profile from '@/pages/Profile'; 
import Admin from '@/pages/Admin'; 
import Login from '@/pages/Login'; 
import Register from '@/pages/Register'; 
import About from '@/pages/About';
export default function App(){
    return <BrowserRouter>
    <Toaster position="bottom-right"/><AppShell><Routes><Route path="/" element={<Home/>}/>
    <Route path="/explore" element={<Explore/>}/>
    <Route path="/search" element={<SearchPage/>}/>
    <Route path="/topic/:id" element={<TopicDetail/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/bookmarks" element={<Bookmarks/>}/>
    <Route path="/documents" element={<Documents/>}/>
    <Route path="/documents/:id" element={<DocumentDetail/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="*" element={<div className="page-wrap"><div className="empty-state"><h3>Page not found</h3><p>Return to the Pocket Lawyer home page.</p></div></div>}/></Routes>\
    </AppShell>
    </BrowserRouter>}
