import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FaceAuthPage.css';

const FaceAuthPage = ({ authMode = 'login' }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Démarrage de la caméra
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      setCaptured(false);
      setError(null);
    } catch (err) {
      setError(`Erreur caméra : ${err.message}`);
      console.error("Erreur caméra :", err);
    }
  };

  // Capture du visage
  const captureFace = async () => {
    try {
      if (!cameraActive) throw new Error('Caméra non démarrée');

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) {
        throw new Error("Impossible de lire la vidéo (problème de caméra)");
      }
      // Définition de la taille du canvas
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      // Loggez la longueur de imageData pour vérifier qu'elle est correcte
      console.log("Longueur de l'image capturée :", imageData.length);
      if (!imageData || imageData.length < 1000) {
        throw new Error("L'image capturée est vide ou invalide.");
      }
      setCaptured(true);
      setError(null);
      
      // Si c'est mode login, déclencher immédiatement la vérification
      if (authMode === 'login') {
        await handleFaceLogin();
      }
    } catch (err) {
      console.error("Erreur capture :", err.message);
      setError("Erreur lors de la capture du visage : " + err.message);
    }
  };

  // Traitement de la connexion par reconnaissance faciale
  const handleFaceLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas non trouvé');
      const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
      // Log pour vérifier la donnée envoyée
      console.log("ImageData pour login :", imageData.substring(0,50) + "...");
      const response = await axios.post(
        "http://localhost:3001/face/verify",
        { faceImage: imageData },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000, withCredentials: true }
      );
      // Suppression du stockage localStorage, la session est gérée par cookie
      setSuccessMessage("Visage reconnu. Redirection vers la page des vidéos...");
      setTimeout(() => {
        navigate('/videos'); 
      }, 1500);
    } catch (err) {
      const serverError = err.response?.data?.error || err.message;
      if (serverError.includes("Aucun visage détecté")) {
        setError("Aucun visage détecté. Veuillez vous placer correctement face à la caméra.");
      } else if (serverError.includes("Visage inconnu")) {
        setError("Visage inconnu. Veuillez vous inscrire.");
      } else {
        setError(serverError);
      }
      console.error('Erreur connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  // Traitement de l'inscription par reconnaissance faciale
  const handleFaceRegister = async () => {
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
      // Log pour vérifier la donnée envoyée pour l'inscription
      console.log("ImageData pour register :", imageData.substring(0,50) + "...");
      const response = await axios.post(
        "http://localhost:3001/face/register",
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          faceImage: imageData
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );
      console.log('Réponse du serveur:', response.data);
      navigate('/face-auth/login');
    } catch (error) {
      if (error.response?.status === 409) {
        setError("Cet utilisateur existe déjà avec ce visage.");
      } else {
        console.error('Erreur:', error.response?.data || error.message);
        setError(error.response?.data?.error || "Échec de l'inscription. Veuillez réessayer.");
      }
    }
  };

  // Gestion des champs du formulaire (pour l'inscription)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Arrêt de la caméra lors du démontage
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="face-auth-page">
      <div className="face-auth-container">
        <h2 className="face-auth-title">
          {authMode === 'login' ? 'Authentification Faciale' : 'Inscription Faciale'}
        </h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
        
        <div className="face-auth-video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="face-auth-video"
          />
          {!cameraActive && (
            <div className="face-auth-video-placeholder">
              <p>Aperçu caméra</p>
            </div>
          )}
          {captured && (
            <div className="face-auth-captured-overlay">
              <span>Visage capturé !</span>
            </div>
          )}
        </div>

        <div className="face-auth-controls">
          <button 
            onClick={async () => {
              try {
                setLoading(false);
                setCaptured(false);
                setError(null);
                setSuccessMessage('');
                if (videoRef.current?.srcObject) {
                  videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                }
                await startCamera();
              } catch (err) {
                setError("Erreur lors du redémarrage de la caméra.");
              }
            }}
            className="btn btn-white-red face-auth-btn"
          >
            {cameraActive ? 'Redémarrer' : 'Démarrer'}
          </button>
          <button 
            onClick={captureFace}
            className="btn btn-white-red face-auth-btn"
            disabled={!cameraActive || loading}
          >
            {authMode === 'register' ? 'Capturer' : 'Vérifier'}
          </button>
        </div>

        {authMode === 'register' && (
          <div className="face-auth-form">
            <div className="mb-3">
              <label className="form-label text-white">Nom complet</label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="name"
                placeholder="Morgan Freeman"
                value={userData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                name="email"
                placeholder="morgan@example.com"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Mot de passe</label>
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                placeholder="Mot de passe"
                value={userData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        <button
          onClick={async () => {
            try {
              if (authMode === 'register') {
                const { name, email, password } = userData;
                if (!name || !email || !password) {
                  throw new Error("Tous les champs doivent être remplis.");
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  throw new Error("Adresse email invalide.");
                }
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
                if (!passwordRegex.test(password)) {
                  throw new Error("Le mot de passe doit contenir au moins 6 caractères, une majuscule et un chiffre.");
                }
                await handleFaceRegister();
              } else {
                await handleFaceLogin();
              }
            } catch (err) {
              setError(err.message);
            }
          }}
          className="btn btn-white-red w-100 mb-3"
          disabled={!captured || loading}
        >
          {loading ? 'Traitement en cours...' : authMode === 'register' ? "Finaliser l'inscription" : "Se connecter"}
        </button>
        <div className="text-center">
          <button 
            onClick={() => navigate(authMode === 'login' ? '/login' : '/register')}
            className="btn btn-link"
          >
            {authMode === 'login' ? 'Retour au login standard' : "Retour à l'inscription standard"}
          </button>
        </div>
      </div>
      
      {captured && (
        <div className="face-auth-preview">
          <img 
            src={canvasRef.current?.toDataURL('image/jpeg')} 
            alt="Aperçu capture"
            className="img-fluid rounded"
          />
          <small className="text-muted d-block text-center mt-1">Aperçu</small>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default FaceAuthPage;
