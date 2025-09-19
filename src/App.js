import React, { useRef, useEffect, useState, useCallback } from 'react';
import EyesDetection from './EyesDetection';
import NoseDetection from './NoseDetection';
import LipsDetection from './LipsDetection';
import { drawFaceLandmarks } from './drawingUtils';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [detectionResults, setDetectionResults] = useState({});

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => videoRef.current.onloadedmetadata = resolve);
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        alert("⚠️ Please allow camera permission in your browser.");
      }
    }
    setupCamera();
  }, []);

  const handleDetectionResults = useCallback((featureName, results) => {
    setDetectionResults(prev => ({ ...prev, [featureName]: results }));
    console.log(`${featureName} detected:`, results);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || video.videoWidth === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Video draw karo
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Feature draw karo
    if (selectedFeature === 'eyes' && detectionResults.eyes) {
      drawFaceLandmarks(ctx, detectionResults.eyes, 'eyes');
    } else if (selectedFeature === 'nose' && detectionResults.nose) {
      drawFaceLandmarks(ctx, detectionResults.nose, 'nose');
    } else if (selectedFeature === 'lips' && detectionResults.lips) {
      drawFaceLandmarks(ctx, detectionResults.lips, 'lips');
    }
  }, [detectionResults, selectedFeature]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Live AR Accessories</h1>

      <div style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted   // 👈 IMPORTANT for mobile autoplay
          style={{ width: '640px', height: '480px' }}
        ></video>
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ 
            position: 'absolute',
            top: 0, 
            left: 0,
            transform: 'scaleX(-1)',
            pointerEvents: 'none' }}
        ></canvas>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setSelectedFeature('eyes')}>Eyes</button>
        <button onClick={() => setSelectedFeature('nose')}>Nose</button>
        <button onClick={() => setSelectedFeature('lips')}>Lips</button>
        <button onClick={() => setSelectedFeature(null)}>Stop</button>
      </div>

      {selectedFeature === 'eyes' &&
        <EyesDetection videoRef={videoRef} onResults={handleDetectionResults} />}
      {selectedFeature === 'nose' &&
        <NoseDetection videoRef={videoRef} onResults={handleDetectionResults} />}
      {selectedFeature === 'lips' &&
        <LipsDetection videoRef={videoRef} onResults={handleDetectionResults} />}
    </div>
  );
}

export default App;
