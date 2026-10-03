import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    unreadCounts: {},
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    incrementUnread: (state, action) => {
      const userId = action.payload;
      if (userId) {
        if (!state.unreadCounts) {
          state.unreadCounts = {};
        }
        state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + 1;
      }
    },
    clearUnread: (state, action) => {
      const userId = action.payload;
      if (userId && state.unreadCounts) {
        delete state.unreadCounts[userId];
      }
    },
  },
});

export const { setMessages, incrementUnread, clearUnread } = messageSlice.actions;
export default messageSlice.reducer;