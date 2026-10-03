import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';

import axios from "axios";

let persistor = persistStore(store);

export const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

axios.defaults.withCredentials = true;

// Automatically attach Bearer token to all outgoing axios requests
axios.interceptors.request.use((config) => {
  try {
    const state = store.getState();
    const token = state?.user?.authUser?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Error setting Authorization header:", err);
  }
  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
