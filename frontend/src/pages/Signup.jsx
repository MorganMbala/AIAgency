import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import "./Signup.css";
import logo from "../assets/logo.svg";

const API_URL = "http://localhost:4000/api/auth";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Tous les champs sont requis.");
      return;
    }

    try {
      // Appel de la route d'inscription du microservice
      const response = await axios.post(`${API_URL}/register`, {
        username: name,
        email,
        password,
      }, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMessage("Un compte avec cet email existe déjà.");
      } else {
        setErrorMessage("Erreur lors de l'inscription.");
      }
      console.error("Erreur lors de l'inscription:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Appel de la route Google du microservice
      const res = await axios.post(`${API_URL}/google`, { credential: credentialResponse.credential }, { withCredentials: true });
      // Suppression du stockage localStorage, la session est gérée par cookie
      navigate("/");
    } catch (err) {
      setErrorMessage("Erreur d'authentification Google.");
    }
  };

  return (
    <div className="signup-zara-bg" style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <img src={logo} alt="E-WebGo" style={{ width: 120, margin: '60px 0 20px 0' }} />
        <div style={{ width: 400, maxWidth: '90vw', background: '#fff', padding: 32, borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontWeight: 400, letterSpacing: 1, marginBottom: 32 }}>SIGN UP</h3>
          {errorMessage && (
            <div className="alert alert-danger text-center">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" style={{ color: '#888', fontWeight: 400, fontSize: 16 }}>FULL NAME</label>
              <input
                type="text"
                className="form-control border-0 border-bottom rounded-0 px-0"
                style={{ background: 'transparent', borderColor: errorMessage && errorMessage.toLowerCase().includes('nom') ? '#e50914' : '#ccc', color: '#222', fontSize: 18 }}
                placeholder=""
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: '#888', fontWeight: 400, fontSize: 16 }}>EMAIL</label>
              <input
                type="email"
                className="form-control border-0 border-bottom rounded-0 px-0"
                style={{ background: 'transparent', borderColor: errorMessage && errorMessage.toLowerCase().includes('email') ? '#e50914' : '#ccc', color: '#222', fontSize: 18 }}
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
            </div>
            <button type="submit" className="btn w-100" style={{ background: '#111', color: '#fff', borderRadius: 0, fontWeight: 500, fontSize: 18, marginBottom: 16 }}>
              SIGN UP
            </button>
            <Link to="/login" className="btn w-100" style={{ background: '#fff', color: '#111', border: '1px solid #111', borderRadius: 0, fontWeight: 500, fontSize: 18, marginBottom: 16 }}>
              LOG IN
            </Link>
            <div className="text-center my-3">
              <span style={{ color: '#888', fontWeight: 400, fontSize: 15 }}>or</span>
            </div>
            <div className="d-grid gap-2 mb-2">
              <div className="text-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMessage("Erreur avec la connexion Google.")}
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

export default Signup;
