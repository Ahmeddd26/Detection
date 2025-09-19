import React, { useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-core';

function EarsDetection({ videoRef, onResults }) {
  const detectorRef = useRef(null);

  useEffect(() => {
    async function setupDetector() {
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      detectorRef.current = detector;
      console.log("Pose model loaded for ears ✅");
    }
    setupDetector();
  }, []);

  useEffect(() => {
    const detectPose = async () => {
      if (detectorRef.current && videoRef.current && videoRef.current.readyState >= 2) {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        if (poses.length > 0) {
          const keypoints = poses[0].keypoints;
          const leftEar = keypoints.find(k => k.name === 'left_ear');
          const rightEar = keypoints.find(k => k.name === 'right_ear');
          onResults('ears', { leftEar, rightEar });
        } else {
          onResults('ears', null);
        }
      }
      requestAnimationFrame(detectPose);
    };

    const animationFrameId = requestAnimationFrame(detectPose);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef, onResults]);

  return null;
}

export default EarsDetection;