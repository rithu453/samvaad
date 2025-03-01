// import React, { useRef, useEffect, useState } from 'react';
// import Webcam from 'react-webcam';

// const WebcamWithAudioDots = () => {
//   const webcamRef = useRef(null);
//   const [isRedirected, setIsRedirected] = useState(true);
//   const [audioLevels, setAudioLevels] = useState([0, 0, 0]);

//   useEffect(() => {
//     if (isRedirected && webcamRef.current && webcamRef.current.stream) {
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       const analyser = audioContext.createAnalyser();
//       const audioSource = audioContext.createMediaStreamSource(webcamRef.current.stream);
      
//       audioSource.connect(analyser);
//       analyser.fftSize = 32;
      
//       const bufferLength = analyser.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);
      
//       const updateAudioLevels = () => {
//         analyser.getByteFrequencyData(dataArray);
        
//         // Calculate average audio level
//         let sum = 0;
//         for (let i = 0; i < bufferLength; i++) {
//           sum += dataArray[i];
//         }
//         const avg = sum / bufferLength;
        
//         // Map to 3 different intensity levels for the dots
//         const levels = [
//           avg > 10 ? Math.min(1, avg / 80) : 0,
//           avg > 30 ? Math.min(1, (avg - 20) / 80) : 0,
//           avg > 50 ? Math.min(1, (avg - 40) / 80) : 0,
//         ];
        
//         setAudioLevels(levels);
//         requestAnimationFrame(updateAudioLevels);
//       };
      
//       updateAudioLevels();
      
//       return () => {
//         audioSource.disconnect();
//       };
//     }
//   }, [isRedirected]);

//   const handleUserMedia = (stream) => {
//     // This forces a re-render after we have the stream to initialize audio visualization
//     setIsRedirected(true);
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div className="webcam-container bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
//         {isRedirected && (
//           <Webcam
//             ref={webcamRef}
//             audio={true}
//             mirrored={true}
//             videoConstraints={{
//               width: 220,
//               height: 124,
//               facingMode: "user"
//             }}
//             onUserMedia={handleUserMedia}
//             className="w-56 h-32 object-cover"
//             muted={true}
//           />
//         )}
        
//         {/* Audio visualizer dots */}
//         <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black bg-opacity-40 rounded-full px-2 py-1">
//           {audioLevels.map((level, index) => (
//             <div 
//               key={index}
//               className="w-2 h-2 rounded-full transition-colors duration-100"
//               style={{ 
//                 backgroundColor: level > 0 
//                   ? `rgba(76, 175, 80, ${0.3 + level * 0.7})` 
//                   : 'rgba(255, 255, 255, 0.3)' 
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebcamWithAudioDots;




//the needed code
// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";

// const WebcamWithAudioDots = () => {
//   const webcamRef = useRef(null);
//   const [audioLevels, setAudioLevels] = useState([0, 0, 0]);
//   const [audioContext, setAudioContext] = useState(null);
//   const [analyser, setAnalyser] = useState(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     if (!isInitialized || !webcamRef.current) return;

//     const stream = webcamRef.current.stream;
//     if (!stream) return;

//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const analyserNode = audioCtx.createAnalyser();
//     const audioSource = audioCtx.createMediaStreamSource(stream);
    
//     audioSource.connect(analyserNode);
//     analyserNode.fftSize = 32;
    
//     const bufferLength = analyserNode.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const updateAudioLevels = () => {
//       analyserNode.getByteFrequencyData(dataArray);

//       let sum = 0;
//       for (let i = 0; i < bufferLength; i++) {
//         sum += dataArray[i];
//       }
//       const avg = sum / bufferLength;

//       const levels = [
//         avg > 10 ? Math.min(1, avg / 50) : 0,
//         avg > 30 ? Math.min(1, (avg - 20) / 50) : 0,
//         avg > 50 ? Math.min(1, (avg - 40) / 50) : 0,
//       ];

//       setAudioLevels(levels);
//       requestAnimationFrame(updateAudioLevels);
//     };

//     updateAudioLevels();
//     setAudioContext(audioCtx);
//     setAnalyser(analyserNode);

//     return () => {
//       audioSource.disconnect();
//       audioCtx.close();
//     };
//   }, [isInitialized]);

//   const handleUserMedia = (stream) => {
//     setIsInitialized(true);
//   };


// const AudioVisualizer = () => {
//   const [audioLevels, setAudioLevels] = useState(Array(8).fill(0));
//   const [isRecording, setIsRecording] = useState(false);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   // Initialize audio
//   const initAudio = async () => {
//     try {
//       // Get user media
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaStreamRef.current = stream;
      
//       // Create audio context
//       const AudioContext = window.AudioContext || window.webkitAudioContext;
//       audioContextRef.current = new AudioContext();
      
//       // Create analyser
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       analyserRef.current.fftSize = 256;
      
//       // Connect the audio source
//       const source = audioContextRef.current.createMediaStreamSource(stream);
//       source.connect(analyserRef.current);
      
//       setIsRecording(true);
//       analyzeAudio();
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//     }
//   };

//   // Analyze audio and update levels
//   const analyzeAudio = () => {
//     if (!analyserRef.current) return;

//     const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
//     const updateLevels = () => {
//       analyserRef.current.getByteFrequencyData(dataArray);
      
//       // Create smoother levels from frequency data
//       const levelCount = audioLevels.length;
//       const newLevels = Array(levelCount).fill(0);
      
//       // Process frequency data to create visualizer levels
//       const binSize = Math.floor(dataArray.length / levelCount);
      
//       for (let i = 0; i < levelCount; i++) {
//         let sum = 0;
//         const startBin = i * binSize;
//         for (let j = 0; j < binSize; j++) {
//           sum += dataArray[startBin + j] / 255;
//         }
//         // Smooth the levels and apply some randomness for a more natural look
//         newLevels[i] = Math.min(1, sum / binSize + (Math.random() * 0.05));
//       }
      
//       setAudioLevels(newLevels);
//       animationFrameRef.current = requestAnimationFrame(updateLevels);
//     };
    
//     updateLevels();
//   };

//   // Clean up
//   const stopAudio = () => {
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//     }
    
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach(track => track.stop());
//     }
    
//     if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
//       audioContextRef.current.close();
//     }
    
//     setIsRecording(false);
//   };

//   useEffect(() => {
//     initAudio();
    
//     return () => {
//       stopAudio();
//     };
//   }, []);

//   const getRandomDelay = () => {
//     return Math.random() * 0.3;
//   };

//   return (
//     <div className="relative">
//       <div className="absolute bottom-2 left-2 flex items-end space-x-1 bg-black bg-opacity-40 rounded-full px-3 py-2">
//         {audioLevels.map((level, index) => (
//           <div
//             key={index}
//             className="w-2 rounded-full transition-all duration-100 ease-in-out"
//             style={{
//               height: `${4 + level * 24}px`,
//               backgroundColor: `rgba(76, 175, 80, ${0.3 + level * 0.7})`,
//               transform: `scaleY(${1 + level * 1.5})`,
//               animationDelay: `${getRandomDelay()}s`,
//               boxShadow: level > 0.6 ? `0 0 3px rgba(76, 175, 80, ${level})` : 'none'
//             }}
//           />
//         ))}
//       </div>
      
//       {!isRecording && (
//         <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-red-500 bg-opacity-70 text-white rounded-full px-3 py-2 text-xs">
//           <span className="animate-pulse">●</span>
//           <span>Microphone not connected</span>
//         </div>
//       )}
//     </div>
//   );
// };


//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div className="webcam-container bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
//         <Webcam
//           ref={webcamRef}
//           audio={true}
//           mirrored={true}
//           videoConstraints={{
//             width: 220,
//             height: 124,
//             facingMode: "user"
//           }}
//           onUserMedia={handleUserMedia}
//           className="w-56 h-32 object-cover"
//           muted={true}
//         />
        
//         {/* Audio visualizer waves
//         <div className="absolute bottom-2 left-2 flex items-end space-x-1 bg-black bg-opacity-40 rounded-full px-3 py-2">
//           {audioLevels.map((level, index) => (
//             <div 
//               key={index}
//               className="w-2 rounded-full transition-transform duration-100 ease-in-out"
//               style={{ 
//                 height: `${5 + level * 20}px`,  // Expands vertically
//                 backgroundColor: `rgba(76, 175, 80, ${0.3 + level * 0.7})`,
//                 transform: `scaleY(${1 + level * 1.5})`
//               }}
//             />
//           ))}
//         </div> */}
        
// <div className="mt-2 flex space-x-2">
//         {isRecording ? (
//           <button
//             onClick={stopRecording}
//             className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
//           >
//             Stop Recording
//           </button>
//         ) : (
//           <button
//             onClick={startRecording}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
//           >
//             Start Recording
//           </button>
//         )}
//       </div>
//       {recordedChunks.length > 0 && (
//         <a
//           href={URL.createObjectURL(new Blob(recordedChunks, { type: "video/webm" }))}
//           download="recorded-video.webm"
//           className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md block text-center"
//         >
//           Download Video
//         </a>
//       )}
//         <div className="absolute bottom-2 left-2 flex items-end space-x-1 bg-black bg-opacity-40 rounded-full px-3 py-2">
//           {audioLevels.map((level, index) => (
//             <div 
//               key={index}
//               className="w-2 rounded-full transition-transform duration-100 ease-in-out"
//               style={{ 
//                 height: `${6 + level * 5}px`, // Expanding vertically
//                 backgroundColor: `rgba(66, 133, 244, ${0.4 + level * 0.6})`, // Google Blue color
//                 transform: `scaleY(${1 + level * 0.7})`,
//                 boxShadow: level > 0.3 ? `0 0 6px rgba(66, 133, 244, ${level})` : 'none' // Glow effect
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebcamWithAudioDots;


// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";

// const WebcamWithAudioDots = () => {
//   const webcamRef = useRef(null);
//   const [audioLevels, setAudioLevels] = useState([0, 0, 0]);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedChunks, setRecordedChunks] = useState([]);
//   const mediaRecorderRef = useRef(null);

//   // Initialize audio analyzer when webcam is ready
//   useEffect(() => {
//     if (!isInitialized || !webcamRef.current) return;

//     const stream = webcamRef.current.stream;
//     if (!stream) return;

//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const analyserNode = audioCtx.createAnalyser();
//     const audioSource = audioCtx.createMediaStreamSource(stream);
    
//     audioSource.connect(analyserNode);
//     analyserNode.fftSize = 32;
    
//     const bufferLength = analyserNode.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const updateAudioLevels = () => {
//       analyserNode.getByteFrequencyData(dataArray);

//       let sum = 0;
//       for (let i = 0; i < bufferLength; i++) {
//         sum += dataArray[i];
//       }
//       const avg = sum / bufferLength;

//       // Create 3 levels with different thresholds
//       const levels = [
//         avg > 10 ? Math.min(1, avg / 50) : 0,
//         avg > 30 ? Math.min(1, (avg - 20) / 50) : 0,
//         avg > 50 ? Math.min(1, (avg - 40) / 50) : 0,
//       ];

//       setAudioLevels(levels);
//       requestAnimationFrame(updateAudioLevels);
//     };

//     updateAudioLevels();

//     return () => {
//       audioSource.disconnect();
//       audioCtx.close();
//     };
//   }, [isInitialized]);

//   // Handle when webcam stream is ready
//   const handleUserMedia = (stream) => {
//     setIsInitialized(true);
//   };

//   // Start recording function
//   const startRecording = () => {
//     if (!webcamRef.current?.stream) return;
    
//     setRecordedChunks([]);
//     const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
//       mimeType: "video/webm"
//     });
    
//     mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
//     mediaRecorder.start();
//     mediaRecorderRef.current = mediaRecorder;
//     setIsRecording(true);
//   };

//   // Stop recording function
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // Handle recorded video chunks
//   const handleDataAvailable = ({ data }) => {
//     if (data.size > 0) {
//       setRecordedChunks((prev) => [...prev, data]);
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div className="webcam-container bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
//         <Webcam
//           ref={webcamRef}
//           audio={true}
//           mirrored={true}
//           videoConstraints={{
//             width: 220,
//             height: 124,
//             facingMode: "user"
//           }}
//           onUserMedia={handleUserMedia}
//           className="w-56 h-32 object-cover"
//           muted={true}
//         />
        
//         {/* Audio visualizer dots */}
//         <div className="absolute bottom-2 left-2 flex items-end space-x-1 bg-black bg-opacity-40 rounded-full px-3 py-2">
//           {audioLevels.map((level, index) => (
//             <div 
//               key={index}
//               className="w-2 rounded-full transition-transform duration-100 ease-in-out"
//               style={{ 
//                 height: `${6 + level * 20}px`,
//                 backgroundColor: `rgba(66, 133, 244, ${0.4 + level * 0.6})`, // Google Blue color
//                 transform: `scaleY(${1 + level * 0.7})`,
//                 boxShadow: level > 0.3 ? `0 0 6px rgba(66, 133, 244, ${level})` : 'none' // Glow effect
//               }}
//             />
//           ))}
//         </div>
//       </div>
      
//       {/* Recording controls */}
//       <div className="mt-2 flex space-x-2">
//         {isRecording ? (
//           <button
//             onClick={stopRecording}
//             className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
//           >
//             Stop Recording
//           </button>
//         ) : (
//           <button
//             onClick={startRecording}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
//           >
//             Start Recording
//           </button>
//         )}
//       </div>
      
//       {/* Download button */}
//       {recordedChunks.length > 0 && (
//         <a
//           href={URL.createObjectURL(new Blob(recordedChunks, { type: "video/webm" }))}
//           download="recorded-video.webm"
//           className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md block text-center"
//         >
//           Download Video
//         </a>
//       )}
//     </div>
//   );
// };

// export default WebcamWithAudioDots;



// import React, { useState, useEffect, useRef } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';

// // API base URL
// const API_BASE_URL = 'http://127.0.0.1:8000';

// const WebcamWithAudioDots = () => {
//   const webcamRef = useRef(null);
//   const [audioLevels, setAudioLevels] = useState([0, 0, 0]);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedChunks, setRecordedChunks] = useState([]);
//   const mediaRecorderRef = useRef(null);

//   // Initialize audio analyzer when webcam is ready
//   useEffect(() => {
//     if (!isInitialized || !webcamRef.current) return;

//     const stream = webcamRef.current.stream;
//     if (!stream) return;

//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const analyserNode = audioCtx.createAnalyser();
//     const audioSource = audioCtx.createMediaStreamSource(stream);
    
//     audioSource.connect(analyserNode);
//     analyserNode.fftSize = 32;
    
//     const bufferLength = analyserNode.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const updateAudioLevels = () => {
//       analyserNode.getByteFrequencyData(dataArray);

//       let sum = 0;
//       for (let i = 0; i < bufferLength; i++) {
//         sum += dataArray[i];
//       }
//       const avg = sum / bufferLength;

//       // Create 3 levels with different thresholds
//       const levels = [
//         avg > 10 ? Math.min(1, avg / 50) : 0,
//         avg > 30 ? Math.min(1, (avg - 20) / 50) : 0,
//         avg > 50 ? Math.min(1, (avg - 40) / 50) : 0,
//       ];

//       setAudioLevels(levels);
//       requestAnimationFrame(updateAudioLevels);
//     };

//     updateAudioLevels();

//     return () => {
//       audioSource.disconnect();
//       audioCtx.close();
//     };
//   }, [isInitialized]);

//   // Handle when webcam stream is ready
//   const handleUserMedia = (stream) => {
//     setIsInitialized(true);
//   };

//   // Start recording function
//   const startRecording = () => {
//     if (!webcamRef.current?.stream) return;
    
//     setRecordedChunks([]);
//     const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
//       mimeType: "video/webm"
//     });
    
//     mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
//     mediaRecorder.start();
//     mediaRecorderRef.current = mediaRecorder;
//     setIsRecording(true);
//   };

//   // Handle recorded video chunks
//   const handleDataAvailable = ({ data }) => {
//     if (data.size > 0) {
//       setRecordedChunks((prev) => [...prev, data]);
//     }
//   };

//   // Stop recording function - Fixed to properly use the recorded chunks
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
      
//       // Add event listener for when recording stops
//       mediaRecorderRef.current.addEventListener("stop", () => {
//         // Use the updated recordedChunks state to create blob
//         const blob = new Blob(recordedChunks, { type: "video/webm" });
//         const file = new File([blob], "interview_recording.webm", { type: "video/webm" });
        
//         // Create FormData and send it to FastAPI
//         const formData = new FormData();
//         formData.append("file", file);
        
//         // Send to server
//         fetch("http://127.0.0.1:8001/upload/", {
//           method: "POST",
//           body: formData,
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log("Upload success:", data);
//         })
//         .catch(error => {
//           console.error("Upload failed:", error);
//         });
//       });
//     }
//   };

 

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//         <div className="webcam-container bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
      
//         <Webcam
//           ref={webcamRef}
//           audio={true}
//           mirrored={true}
//           videoConstraints={{
//             width: 220,
//             height: 124,
//             facingMode: "user"
//           }}
//           onUserMedia={handleUserMedia}
//           className="w-56 h-32 object-cover"
//           muted={true}
//         />
        
  
//         <div className="absolute bottom-2 left-2 flex items-end space-x-1 bg-black bg-opacity-40 rounded-full px-3 py-2">
//           {audioLevels.map((level, index) => (
//             <div 
//               key={index}
//               className="w-2 rounded-full transition-transform duration-100 ease-in-out"
//               style={{ 
//                 height: `${5 + level * 5}px`,
//                 backgroundColor: `rgba(66, 133, 244, ${0.4 + level * 0.6})`, // Google Blue color
//                 transform: `scaleY(${1 + level * 0.2})`,
//                 boxShadow: level > 0.3 ? `0 0 6px rgba(66, 133, 244, ${level})` : 'none' // Glow effect
//               }}
//             />
//           ))}
//         </div>
        
//         {/* Add recording controls */}
//         <div className="absolute top-2 right-2 space-x-2">
//           {!isRecording ? (
//             <button
//               onClick={startRecording}
//               className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
//               title="Start Recording"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                 <circle cx="10" cy="10" r="5" />
//               </svg>
//             </button>
//           ) : (
//             <button
//               onClick={stopRecording}
//               className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-1"
//               title="Stop Recording"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                 <rect x="6" y="6" width="8" height="8" />
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebcamWithAudioDots;

import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.53.41:8000';

const WebcamWithAudioDots = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [audioLevels, setAudioLevels] = useState([0, 0, 0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isInitialized || !webcamRef.current) return;
    const stream = webcamRef.current.stream;
    if (!stream) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = audioCtx.createAnalyser();
    const audioSource = audioCtx.createMediaStreamSource(stream);
    audioSource.connect(analyserNode);
    analyserNode.fftSize = 32;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevels = () => {
      analyserNode.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      setAudioLevels([
        avg > 10 ? Math.min(1, avg / 50) : 0,
        avg > 30 ? Math.min(1, (avg - 20) / 50) : 0,
        avg > 50 ? Math.min(1, (avg - 40) / 50) : 0,
      ]);
      requestAnimationFrame(updateAudioLevels);
    };
    updateAudioLevels();

    return () => {
      audioSource.disconnect();
      audioCtx.close();
    };
  }, [isInitialized]);

  const handleUserMedia = (stream) => {
    setIsInitialized(true);
  };

  const startRecording = () => {
    if (!webcamRef.current?.stream) return;
    const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Capture 1-second chunks

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const formData = new FormData();
        formData.append('video_chunk', event.data, 'chunk.webm');
        try {
          await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    };
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="webcam-container bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
        <Webcam
          ref={webcamRef}
          audio={true}
          mirrored={true}
          videoConstraints={{ width: 220, height: 124, facingMode: 'user' }}
          onUserMedia={handleUserMedia}
          className="w-56 h-32 object-cover"
          muted={true}
        />

        <div className="absolute bottom-2 left-2 flex items-end space-x-1 bg-black bg-opacity-40 rounded-full px-3 py-2">
          {audioLevels.map((level, index) => (
            <div 
              key={index}
              className="w-2 rounded-full transition-transform duration-100 ease-in-out"
              style={{ 
                height: `${5 + level * 5}px`,
                backgroundColor: `rgba(66, 133, 244, ${0.4 + level * 0.6})`,
                transform: `scaleY(${1 + level * 0.2})`,
                boxShadow: level > 0.3 ? `0 0 6px rgba(66, 133, 244, ${level})` : 'none'
              }}
            />
          ))}
        </div>

        <div className="absolute top-2 right-2 space-x-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
              title="Start Recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="5" />
              </svg>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-1"
              title="Stop Recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <rect x="6" y="6" width="8" height="8" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamWithAudioDots;
