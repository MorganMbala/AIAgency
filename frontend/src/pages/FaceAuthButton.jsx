import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import './FaceAuthButton.css';

const FaceAuthButton = forwardRef(({ mode, onSuccess, onError }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' 
        } 
      });
      if (!videoRef.current) {
        throw new Error('Video element not initialized');
      }
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      return true;
    } catch (err) {
      console.error('Camera error:', err);
      onError(`Camera error: ${err.message}`);
      setCameraActive(false);
      return false;
    }
  };

  const captureFace = async () => {
    try {
      if (!cameraActive) throw new Error('Camera not active');
      if (!videoRef.current) throw new Error('Video element not initialized');
      if (!canvasRef.current) throw new Error('Canvas element not initialized');
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
      const response = await axios.post(
        mode === 'register' ? '/api/register-face' : '/api/login-face',
        { image: imageData },
        { withCredentials: true }
      );
      onSuccess(response.data);
    } catch (err) {
      console.error('Capture error:', err);
      onError(err.response?.data?.message || err.message || 'Capture failed');
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    startCamera,
    captureFace,
    videoRef
  }));

  return (
    <div className="face-auth-button-container">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{ display: 'none' }} 
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="button-group">
        <button className="btn btn-primary face-btn" onClick={startCamera}>
          Démarrer la caméra
        </button>
        <button className="btn btn-danger face-btn" onClick={captureFace} disabled={!cameraActive}>
          Capturer
        </button>
      </div>
    </div>
  );
});

export default FaceAuthButton;
