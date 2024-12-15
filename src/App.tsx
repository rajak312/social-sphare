// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import Post from "./pages/Post";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;
