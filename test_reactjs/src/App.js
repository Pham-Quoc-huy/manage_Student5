import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomeLayout from "./components/HomeLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [page, setPage] = useState("login"); // "login", "register", "home"
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Khởi tạo Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "YOUR_FACEBOOK_APP_ID", // Thay bằng App ID của bạn
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
      window.FB.AppEvents.logPageView();
    };
  }, []);

  // Kiểm tra token khi load app
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setPage("home");
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPage("login");
  };

  return (
    <GoogleOAuthProvider clientId="654694306838-is9r0g83dbced6571d253ekjbv57ac0i.apps.googleusercontent.com">
      {isLoggedIn ? (
        <HomeLayout onLogout={handleLogout} />
      ) : page === "register" ? (
        <RegisterForm onBackToLogin={() => setPage("login")} />
      ) : (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onShowRegister={() => setPage("register")}
        />
      )}
    </GoogleOAuthProvider>
  );
}

export default App;
