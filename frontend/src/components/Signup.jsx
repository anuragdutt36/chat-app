import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "..";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!user.gender) {
      toast.error("Please select a gender");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="w-full p-8 rounded-3xl shadow-2xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Join the conversation and connect with friends
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="text"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="text"
              placeholder="e.g. johndoe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 text-sm focus:bg-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition-all rounded-xl py-2.5 px-4 outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <div className="flex items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                <input
                  type="radio"
                  name="gender"
                  checked={user.gender === "male"}
                  onChange={() => handleCheckbox("male")}
                  className="radio radio-primary radio-sm border-slate-600 checked:bg-blue-600"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                <input
                  type="radio"
                  name="gender"
                  checked={user.gender === "female"}
                  onChange={() => handleCheckbox("female")}
                  className="radio radio-primary radio-sm border-slate-600 checked:bg-blue-600"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className="mt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-xl shadow-md transition-all font-semibold text-sm"
            >
              Sign Up
            </button>
          </div>

          <p className="text-xs text-center mt-2 text-slate-400">
            Already have an account?{" "}
            <Link
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              to="/login"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;