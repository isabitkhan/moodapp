import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { mapExpressionToMood } from "../utils/moodMap";

export default function MoodDetector({ onDetect }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [lastMood, setLastMood] = useState(null);
  const [statusMessage, setStatusMessage] = useState(""); // 👈 added

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // served from public/models
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setReady(true);
      } catch (e) {
        console.error("Model load error", e);
        setStatusMessage("❌ Failed to load AI models. Check /public/models folder.");
      }
    };
    loadModels();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatusMessage(""); // clear message
    } catch (e) {
      console.error("Camera permission error", e);
      setStatusMessage("⚠️ Camera access denied. Please allow webcam.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks()?.forEach((t) => t.stop());
  };

  const detectOnce = async () => {
    if (!videoRef.current) return;

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.4,
    });
    const result = await faceapi
      .detectSingleFace(videoRef.current, options)
      .withFaceExpressions();

    if (result?.expressions) {
      console.log("Expressions:", result.expressions);
      const mood = mapExpressionToMood(result.expressions);
      setLastMood(mood);
      onDetect?.(mood);
      setStatusMessage(""); // clear warning if detection works
    } else {
      setStatusMessage("😕 Face not detected. Check lighting and stay close to the camera.");
    }
  };

  const handleQuickDetect = async () => {
    if (!ready) return;
    setDetecting(true);
    await startCamera();

    setTimeout(async () => {
      await detectOnce();
      setDetecting(false);

      setTimeout(() => {
        stopCamera();
      }, 500);
    }, 1000);
  };

  const startLiveDetect = async () => {
    if (!ready) return;
    setLiveMode(true);
    await startCamera();

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.4,
    });

    const loop = async () => {
      if (!videoRef.current || !liveMode) return;
      const result = await faceapi
        .detectSingleFace(videoRef.current, options)
        .withFaceExpressions();

      if (result?.expressions) {
        const mood = mapExpressionToMood(result.expressions);
        setLastMood(mood);
        onDetect?.(mood);
        setStatusMessage("");
      } else {
        setStatusMessage("⚠️ No face detected. Try better lighting or move closer.");
      }
      requestAnimationFrame(loop);
    };

    loop();
  };

  const stopLiveDetect = () => {
    setLiveMode(false);
    stopCamera();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Quick detect button */}
        <button
          className={`px-4 py-2 rounded-xl border shadow ${
            ready ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={handleQuickDetect}
          disabled={!ready || detecting || liveMode}
          title={!ready ? "Loading models…" : "Detect mood from webcam"}
        >
          {detecting ? "Detecting…" : "🎯 Quick Detect"}
        </button>

        {/* Live detect toggle */}
        {!liveMode ? (
          <button
            className="px-4 py-2 rounded-xl border shadow bg-blue-600 text-white"
            onClick={startLiveDetect}
            disabled={!ready || detecting}
          >
            📹 Start Live Detect
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded-xl border shadow bg-red-600 text-white"
            onClick={stopLiveDetect}
          >
            ⏹ Stop Live Detect
          </button>
        )}

        {lastMood && (
          <span className="text-sm text-gray-600">
            Last detected: <b>{lastMood}</b>
          </span>
        )}
      </div>

      {/* Status/Error Message */}
      {statusMessage && (
        <div className="mt-2 text-sm text-red-600 font-medium">
          {statusMessage}
        </div>
      )}

      {/* Video for both quick + live preview */}
      <video
        ref={videoRef}
        width={400}
        height={300}
        className={`${liveMode || detecting ? "mt-2 rounded-xl" : "hidden"}`}
        muted
        playsInline
      />
    </div>
  );
}
