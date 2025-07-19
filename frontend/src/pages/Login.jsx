import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.svg";
import "./Login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Remplacer les routes par celles du microservice account-service
  const API_URL = "http://localhost:4000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (!email || !password) {
        throw new Error("L'adresse email et le mot de passe sont requis.");
      }

      // Appel de la route de login du microservice
      const result = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (result.data.token) {
        localStorage.setItem("user", JSON.stringify(result.data));
        navigate("/");
      } else {
        throw new Error("Identifiants invalides. Veuillez réessayer.");
      }
    } catch (err) {
      if (
        err.message === "L'adresse email et le mot de passe sont requis." ||
        err.message === "Identifiants invalides. Veuillez réessayer."
      ) {
        setErrorMessage(err.message);
      } else if (err.response) {
        setErrorMessage(err.response.data.error || "Erreur serveur.");
      } else if (err.request) {
        setErrorMessage("Impossible de contacter le serveur.");
      } else {
        setErrorMessage("Une erreur inattendue est survenue.");
      }
      console.error("Erreur attrapée :", err);
    }
  };


  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      // Appel de la route Google du microservice
      const response = await axios.post(`${API_URL}/google`, { credential: credentialResponse.credential });
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      setErrorMessage("Échec de la connexion avec Google.");
    }
  };

  return (
    <div className="login-zara-bg" style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <img src={logo} alt="E-WebGo" style={{ width: 120, margin: '40px 0 20px 0' }} />
        <div style={{ width: 400, maxWidth: '90vw', background: '#fff', padding: 32, borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontWeight: 400, letterSpacing: 1, marginBottom: 32 }}>LOG IN</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" style={{ color: '#888', fontWeight: 400, fontSize: 16 }}>EMAIL</label>
              <input
                type="email"
                className="form-control border-0 border-bottom rounded-0 px-0"
                style={{ background: 'transparent', borderColor: errorMessage ? '#e50914' : '#ccc', color: '#222', fontSize: 18 }}
                placeholder=""
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {errorMessage && errorMessage.toLowerCase().includes('email') && (
                <div style={{ color: '#e50914', fontSize: 14, marginTop: 4 }}>
                  <i className="bi bi-exclamation-circle me-1"></i> The email field is required
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: '#888', fontWeight: 400, fontSize: 16 }}>PASSWORD</label>
              <input
                type="password"
                className="form-control border-0 border-bottom rounded-0 px-0"
                style={{ background: 'transparent', borderColor: '#ccc', color: '#222', fontSize: 18 }}
                placeholder=""
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div className="mt-2" style={{ fontSize: 15, color: '#222' }}>
                <Link to="/forgot-password" style={{ color: '#222', textDecoration: 'underline' }}>Forgot your password?</Link>
              </div>
            </div>
            <button type="submit" className="btn w-100" style={{ background: '#111', color: '#fff', borderRadius: 0, fontWeight: 500, fontSize: 18, marginBottom: 16 }}>
              LOG IN
            </button>
            <Link to="/register" className="btn w-100" style={{ background: '#fff', color: '#111', border: '1px solid #111', borderRadius: 0, fontWeight: 500, fontSize: 18, marginBottom: 16 }}>
              SIGN UP
            </Link>
            <div className="text-center my-3">
              <span style={{ color: '#888', fontWeight: 400, fontSize: 15 }}>or</span>
            </div>
            <div className="d-grid gap-2 mb-2">
              <div className="text-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => setErrorMessage("Erreur lors de la connexion avec Google.")}
                  width="100%"
                />
              </div>
            </div>
          </form>
          <div className="mt-4" style={{ color: '#222', fontSize: 15 }}>
            <Link to="/help" style={{ color: '#222', textDecoration: 'underline' }}>HELP</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
