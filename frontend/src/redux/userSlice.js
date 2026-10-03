import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    otherUsers: null,
    selectedUser: null,
    onlineUsers: null,
    mutedUsers: [],
    blockedUsers: [],
    appSettings: {
      notifications: true,
      darkMode: true,
      sound: true,
    }
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
      if (action.payload?.blockedUsers) {
        state.blockedUsers = action.payload.blockedUsers;
      }
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setBlockedUsers: (state, action) => {
      state.blockedUsers = action.payload || [];
    },
    toggleMuteUser: (state, action) => {
      const userId = action.payload;
      if (!Array.isArray(state.mutedUsers)) {
        state.mutedUsers = [];
      }
      if (state.mutedUsers.includes(userId)) {
        state.mutedUsers = state.mutedUsers.filter((id) => id !== userId);
      } else {
        state.mutedUsers.push(userId);
      }
    },
    toggleBlockUser: (state, action) => {
      const userId = action.payload;
      if (!Array.isArray(state.blockedUsers)) {
        state.blockedUsers = [];
      }
      if (state.blockedUsers.includes(userId)) {
        state.blockedUsers = state.blockedUsers.filter((id) => id !== userId);
      } else {
        state.blockedUsers.push(userId);
      }
    },
    updateSettings: (state, action) => {
      const currentSettings = state.appSettings || {
        notifications: true,
        darkMode: true,
        sound: true,
      };
      state.appSettings = { ...currentSettings, ...action.payload };
    },
    updateOtherUserProfile: (state, action) => {
      const { userId, fullName, profilePhoto } = action.payload || {};
      if (userId) {
        if (state.otherUsers && Array.isArray(state.otherUsers)) {
          state.otherUsers = state.otherUsers.map((u) => {
            if (u._id === userId) {
              return {
                ...u,
                ...(fullName ? { fullName } : {}),
                ...(profilePhoto ? { profilePhoto } : {}),
              };
            }
            return u;
          });
        }
        if (state.selectedUser && state.selectedUser._id === userId) {
          state.selectedUser = {
            ...state.selectedUser,
            ...(fullName ? { fullName } : {}),
            ...(profilePhoto ? { profilePhoto } : {}),
          };
        }
      }
    }
  },
});

export const {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers,
  setBlockedUsers,
  toggleMuteUser,
  toggleBlockUser,
  updateSettings,
  updateOtherUserProfile
} = userSlice.actions;

export default userSlice.reducer;