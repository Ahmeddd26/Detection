import React, { useEffect } from 'react';
import { FaceMesh, FACEMESH_LIPS } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

function LipsDetection({ videoRef, onResults }) {
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

        // Sirf lips ke landmarks nikaalo
        const lipIndices = [...new Set(FACEMESH_LIPS.flat())];
        const lipsLandmarks = lipIndices.map(i => landmarks[i]);

        onResults("lips", lipsLandmarks);
      } else {
        onResults("lips", null);
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

export default LipsDetection;
