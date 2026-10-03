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
      className={`flex lg:h-[650px] md:h-[550px] rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/75 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5 text-slate-100"
          : "bg-white/90 backdrop-blur-2xl border border-slate-200/90 ring-1 ring-black/5 text-slate-800 shadow-slate-900/10"
      }`}
    >
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default HomePage