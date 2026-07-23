import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Upload,
  LogOut,
  Bot,
  User,
  File,
  Home
} from "lucide-react";
import Header from './Header';
const Sidebar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate=useNavigate();
    const logout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");
    if (!shouldLogout) return;
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const goTo = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div>
     
<Header
  menuOpen={menuOpen}
  onMenuClick={() => setMenuOpen((open) => !open)}
/>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 top-16 z-30 bg-slate-900/40 md:hidden"
          onClick={closeMenu}
        />
      )}

      <aside className={`dash-sidebar ${menuOpen ? "dash-sidebar-open" : ""}`}>
        <div>
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-slate-900 font-semibold text-sm leading-tight">
                CareerAI Intelligence
              </p>
              <p className="text-teal-600 text-xs font-semibold tracking-wide">
                AI ENGINE ACTIVE
              </p>
            </div>
          </div>
           <button
            onClick={() => goTo("/dashboard")}
            className="dash-nav-item "
          >
          <Home className="w-5 h-5"/>
            Dashboard      
                </button>
          <nav className="space-y-1">
           <button
            onClick={() => goTo("/upload")}
            className=" dash-nav-item "
          >
            <Upload className="w-5 h-5"/>
            Upload Resume
          </button>
          </nav>


          <nav className="space-y-1">
          
          </nav>
        
 <button
            onClick={() => goTo("/resumes")}
            className="dash-nav-item"
          >
             <File className="w-5 h-5"/>
            Analyze Resume
          </button>
          <div className="dash-nav-item">
            <HelpCircle className="w-5 h-5" />
            Help Center
          </div>
           <nav className="space-y-1">
           <button
            onClick={() => goTo("/profile")}
            className=" dash-nav-item "
          >
             <User className="w-5 h-5"/>
            Profile
          </button>
          </nav>
          <div className="dash-nav-item" onClick={logout}>
            <LogOut className="w-5 h-5" />
            Log Out
          </div>
        </div>

        
      </aside>

    </div>
  )
}

export default Sidebar
