import React, { useEffect } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

function NoseDetection({ videoRef, onResults }) {
  useEffect(() => {
    let camera = null;
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(results => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // Nose landmark indices manually
        const noseIndices = [1, 2, 98, 327, 168, 197, 195, 5];
        const noseLandmarks = noseIndices.map(i => landmarks[i]);

        onResults("nose", noseLandmarks);
      } else {
        onResults("nose", null);
      }
    });

    if (videoRef.current) {
        console.log("📷 Camera starting...");
        camera = new Camera(videoRef.current, {
            onFrame: async () => {
                console.log("🎥 Frame captured");
                await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [videoRef, onResults]);

  return null;
}

export default NoseDetection;
