import React from "react";
import { HiOutlineX, HiOutlineBell, HiOutlineVolumeUp, HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "../redux/userSlice";

const ToggleSwitch = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      active ? "bg-emerald-500" : "bg-slate-600"
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
        active ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const SettingsModal = ({ isOpen, onClose }) => {
  const rawSettings = useSelector((store) => store.user.appSettings);
  const dispatch = useDispatch();

  const settings = {
    notifications: true,
    darkMode: true,
    sound: true,
    ...(rawSettings || {}),
  };

  if (!isOpen) return null;

  const handleToggle = (key) => {
    dispatch(updateSettings({ [key]: !settings[key] }));
  };

  const isDarkMode = settings.darkMode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className={`border rounded-3xl w-full max-w-sm p-6 shadow-2xl relative transition-colors duration-200 ${
          isDarkMode
            ? "bg-slate-900 border-slate-700/80 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isDarkMode
              ? "text-slate-400 hover:text-white hover:bg-white/10"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <HiOutlineX size={20} />
        </button>

        <div className="flex flex-col">
          <h3
            className={`text-xl font-bold mb-6 border-b pb-2 ${
              isDarkMode ? "text-slate-100 border-slate-700" : "text-slate-800 border-slate-200"
            }`}
          >
            App Settings
          </h3>

          <div className="space-y-4">
            {/* Global Notifications */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <HiOutlineBell size={20} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    Global Notifications
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Push notifications for all chats
                  </p>
                </div>
              </div>
              <ToggleSwitch
                active={settings.notifications}
                onClick={() => handleToggle("notifications")}
              />
            </div>

            {/* App Sounds */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <HiOutlineVolumeUp size={20} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    App Sounds
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Play sounds for incoming messages
                  </p>
                </div>
              </div>
              <ToggleSwitch
                active={settings.sound}
                onClick={() => handleToggle("sound")}
              />
            </div>

            {/* Dark Mode / Light Mode Toggle */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "bg-slate-700/50 text-amber-400" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {isDarkMode ? <HiOutlineMoon size={20} /> : <HiOutlineSun size={20} />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Theme appearance ({isDarkMode ? "Dark" : "Light"})
                  </p>
                </div>
              </div>
              <ToggleSwitch
                active={settings.darkMode}
                onClick={() => handleToggle("darkMode")}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className={`mt-8 w-full py-2.5 px-4 border rounded-xl text-sm font-medium transition-colors ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                : "bg-slate-900 hover:bg-slate-800 border-slate-900 text-white"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
