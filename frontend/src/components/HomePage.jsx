import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { authUser, appSettings } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const isDarkMode = appSettings?.darkMode ?? true;

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  return (
    <div
      className={`flex w-full h-full sm:h-[650px] md:h-[600px] lg:h-[650px] sm:max-w-4xl lg:max-w-5xl sm:rounded-3xl rounded-none shadow-2xl overflow-hidden transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/75 backdrop-blur-2xl border-0 sm:border border-white/10 ring-0 sm:ring-1 ring-white/5 text-slate-100"
          : "bg-white/90 backdrop-blur-2xl border-0 sm:border border-slate-200/90 ring-0 sm:ring-1 ring-black/5 text-slate-800 shadow-slate-900/10"
      }`}
    >
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default HomePage