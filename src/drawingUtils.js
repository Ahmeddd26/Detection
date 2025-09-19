import { drawLandmarks, drawConnectors } from '@mediapipe/drawing_utils';
import {
  FACEMESH_LIPS,
} from "@mediapipe/face_mesh";

/**
 * Sirf selected feature ke landmarks draw karo.
 */
export function drawFaceLandmarks(ctx, landmarks, featureName) {
  if (!landmarks) return;

  // Mirror horizontally for correct alignment
  const flippedLandmarks = landmarks.map(p => ({
    x: 1 - p.x,
    y: p.y,
    z: p.z,
    visibility: p.visibility
  }));

  if (featureName === 'eyes') {
    drawLandmarks(ctx, flippedLandmarks, {
      color: '#00FF00',
      fillColor: '#FF0000',
      radius: 0.7
    });

  } else if (featureName === 'nose') {
    // Assuming you pass nose landmarks subset only
    const NOSE_CONNECTIONS = [];
    for (let i = 0; i < flippedLandmarks.length - 1; i++) {
      NOSE_CONNECTIONS.push([i, i + 1]);
    }

    drawConnectors(ctx, flippedLandmarks, NOSE_CONNECTIONS, {
      color: '#0000FF',
      lineWidth: 2
    });

    drawLandmarks(ctx, flippedLandmarks, {
      color: '#00FF00',
      fillColor: '#FF0000',
      radius: 2
    });

  } else if (featureName === 'lips') {
    // Use built-in lips connections
    drawConnectors(ctx, flippedLandmarks, FACEMESH_LIPS, {
      color: '#FF00FF',
      lineWidth: 2
    });

    drawLandmarks(ctx, flippedLandmarks, {
      color: '#FF00FF',
      fillColor: '#FF0000',
      radius: 1
    });
  }
}
