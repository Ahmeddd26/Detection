import React, { useEffect } from 'react';
import { FaceMesh, 
  FACEMESH_LEFT_EYE, 
  FACEMESH_RIGHT_EYE, 
  FACEMESH_LEFT_EYEBROW, 
  FACEMESH_RIGHT_EYEBROW, 
  FACEMESH_LEFT_IRIS, 
  FACEMESH_RIGHT_IRIS 
} from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

function EyesDetection({ videoRef, onResults }) {
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

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks?.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // Connections → unique indices extract karo
        const eyeConnections = [
          ...FACEMESH_LEFT_EYE,
          ...FACEMESH_RIGHT_EYE,
          ...FACEMESH_LEFT_EYEBROW,
          ...FACEMESH_RIGHT_EYEBROW,
          ...FACEMESH_LEFT_IRIS,
          ...FACEMESH_RIGHT_IRIS,
        ];

        const uniqueIndices = new Set(eyeConnections.flat());
        const eyeLandmarks = Array.from(uniqueIndices).map((i) => landmarks[i]);

        onResults("eyes", eyeLandmarks);
      } else {
        onResults("eyes", null);
      }
    });

    if (videoRef.current) {
      console.log("📷 EyesDetection camera starting...");
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
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
      if (faceMesh) {
        faceMesh.close();
      }
    };
  }, [videoRef, onResults]);

  return null;
}

export default EyesDetection;
