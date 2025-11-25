import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

// Placeholder pages - zostaną później zastąpione prawdziwymi komponentami
const HomePage = () => <div>Strona Główna (prywatna)</div>;
const LoginPage = () => <div>Strona Logowania</div>;
const RegisterPage = () => <div>Strona Rejestracji</div>;

function App() {
  return (
    <AuthProvider>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
