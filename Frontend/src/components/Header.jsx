import React from 'react'
import { Menu, X } from "lucide-react";
import "../styles/dashboard.css"

const Header = ({ onMenuClick, menuOpen = false }) => {
  return (
    <div>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-xl font-bold text-teal-700">CareerAI</span>
        </div>
        
      </header>
    </div>
  )
}

export default Header
