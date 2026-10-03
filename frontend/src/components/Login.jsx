import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { BASE_URL } from "..";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success || res.status === 200) {
        toast.success(res.data.message || "Logged in successfully!");
        navigate("/");
        dispatch(setAuthUser(res.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.log(error);
    }
    setUser({
      username: "",
      password: "",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="w-full p-8 rounded-3xl shadow-2xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-3 px-4 outline-none"
              type="text"
              placeholder="e.g. johndoe"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-3 px-4 outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-xl shadow-md transition-all font-semibold text-sm"
            >
              Sign In
            </button>
          </div>

          <p className="text-xs text-center mt-3 text-slate-400">
            Don't have an account?{" "}
            <Link
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              to="/signup"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

