import React from 'react'

const Footer = () => {
  return (
    <div>
       <footer className="ml-0 md:ml-72 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 md:px-10 py-6 bg-slate-100">
        <span className="text-teal-700 font-bold text-lg">CareerAI</span>
        <p className="text-sm text-slate-400">
          © 2026 CareerAI. Powered by Career Artificial Intelligence.
        </p>
        <div className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-teal-700">Privacy Policy</a>
          <a href="#" className="hover:text-teal-700">Terms of Service</a>
          <a href="#" className="hover:text-teal-700">API Documentation</a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
