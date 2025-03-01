// import React, { useState, useEffect, useRef } from 'react';

// const InterviewRobot = () => {
//   // State variables
//   const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
//   const [totalQuestions, setTotalQuestions] = useState(5);
//   const [interviewQuestions, setInterviewQuestions] = useState({
//     "1": "Tell me about yourself and your background.",
//     "2": "What are your greatest strengths and weaknesses?",
//     "3": "Why are you interested in this position?",
//     "4": "Describe a challenge you faced and how you overcame it.",
//     "5": "Do you have any questions for me?"
//   });
//   const [status, setStatus] = useState('idle'); // idle, ready, listening, processing, completed
//   const [isInterviewRunning, setIsInterviewRunning] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const [transcript, setTranscript] = useState('');
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [webcamActive, setWebcamActive] = useState(false);
//   const [audioData, setAudioData] = useState([]);
  
//   // Refs
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null);
//   const videoRef = useRef(null);
//   const videoStreamRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const canvasRef = useRef(null);
//   const animationFrameRef = useRef(null);
  
//   // Clean up function for audio and video resources
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }
//       if (videoStreamRef.current) {
//         videoStreamRef.current.getTracks().forEach(track => track.stop());
//       }
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//       }
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, []);
  
//   // Start the interview process
//   const startInterview = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setIsInterviewRunning(true);
//       setStatus('ready');
      
//       // Reset to first question if interview was completed
//       if (status === 'completed') {
//         setCurrentQuestionNumber(1);
//         setAudioUrl(null);
//         setTranscript('');
//       }
      
//       // Start webcam
//       await startWebcam();
      
//       setLoading(false);
      
//       // Start recording automatically
//       startRecording();
//     } catch (err) {
//       setError(`Failed to start interview: ${err.message}`);
//       setLoading(false);
//       setIsInterviewRunning(false);
//     }
//   };
  
//   // Stop the interview process
//   const stopInterview = () => {
//     if (isRecording) {
//       stopRecording();
//     }
    
//     stopWebcam();
//     setIsInterviewRunning(false);
//     setStatus('idle');
//   };
  
//   // Start webcam
//   const startWebcam = async () => {
//     try {
//       const videoStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           width: { ideal: 640 },
//           height: { ideal: 480 },
//           facingMode: "user"
//         } 
//       });
      
//       videoStreamRef.current = videoStream;
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = videoStream;
//         setWebcamActive(true);
//       }
//     } catch (err) {
//       setError(`Failed to start webcam: ${err.message}`);
//       console.error("Webcam error:", err);
//     }
//   };
  
//   // Stop webcam
//   const stopWebcam = () => {
//     if (videoStreamRef.current) {
//       videoStreamRef.current.getTracks().forEach(track => track.stop());
//       videoStreamRef.current = null;
//     }
    
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
    
//     setWebcamActive(false);
//   };
  
//   // Start audio recording
//   const startRecording = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Get microphone access
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
      
//       // Set up audio processing for volume visualization
//       setupAudioProcessing(stream);
      
//       // Initialize media recorder
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
      
//       // Clear previous recording data
//       audioChunksRef.current = [];
//       setAudioData([]);
      
//       // Set up event handlers
//       mediaRecorder.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };
      
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//         const url = URL.createObjectURL(audioBlob);
//         setAudioUrl(url);
        
//         // Simulate transcription (in a real app, you'd send the blob to a speech-to-text API)
//         simulateTranscription();
//       };
      
//       // Start recording
//       mediaRecorder.start();
//       setIsRecording(true);
//       setStatus('listening');
//       setLoading(false);
//     } catch (err) {
//       setError(`Failed to start recording: ${err.message}`);
//       setLoading(false);
//     }
//   };
  
//   // Stop audio recording
//   const stopRecording = () => {
//     setLoading(true);
//     setStatus('processing');
    
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
      
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }
      
//       setIsRecording(false);
      
//       // Stop the animation frame
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//         animationFrameRef.current = null;
//       }
//     }
//   };
  
//   // Set up audio processing for volume visualization
//   const setupAudioProcessing = (stream) => {
//     try {
//       // Create audio context
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       audioContextRef.current = audioContext;
      
//       // Create analyzer
//       const analyser = audioContext.createAnalyser();
//       analyserRef.current = analyser;
//       analyser.fftSize = 256;
      
//       // Connect source to analyzer
//       const source = audioContext.createMediaStreamSource(stream);
//       source.connect(analyser);
      
//       // Start monitoring volume
//       monitorVolume();
      
//       // Draw the circular audio visualization
//       drawAudioVisualization();
//     } catch (err) {
//       console.error("Error setting up audio processing:", err);
//     }
//   };
  
//   // Monitor and update volume level
//   const monitorVolume = () => {
//     if (!analyserRef.current) return;
    
//     const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
//     const updateVolume = () => {
//       if (!analyserRef.current || !isRecording) return;
      
//       analyserRef.current.getByteFrequencyData(dataArray);
      
//       // Calculate average volume
//       let sum = 0;
//       for (let i = 0; i < dataArray.length; i++) {
//         sum += dataArray[i];
//       }
//       const avg = sum / dataArray.length;
      
//       // Normalize to 0-1 range
//       const normalizedVolume = avg / 255;
//       setVolumeLevel(normalizedVolume);
      
//       // Store audio data for visualization (keep last 50 samples)
//       setAudioData(prevData => {
//         const newData = [...prevData, normalizedVolume];
//         if (newData.length > 50) newData.shift();
//         return newData;
//       });
      
//       // Continue monitoring
//       requestAnimationFrame(updateVolume);
//     };
    
//     updateVolume();
//   };
  
//   // Draw circular audio visualization
//   const drawAudioVisualization = () => {
//     if (!canvasRef.current || !isRecording) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;
//     const radius = Math.min(centerX, centerY) - 10;
    
//     const render = () => {
//       if (!isRecording) return;
      
//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
      
//       // Draw outer circle
//       ctx.beginPath();
//       ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
//       ctx.strokeStyle = '#e0e0e0';
//       ctx.lineWidth = 2;
//       ctx.stroke();
      
//       // Draw audio wave
//       const maxWaveHeight = radius * 0.5;
      
//       ctx.beginPath();
//       const angleIncrement = (2 * Math.PI) / 50;
      
//       for (let i = 0; i < audioData.length; i++) {
//         const angle = i * angleIncrement;
//         const waveHeight = audioData[i] * maxWaveHeight;
        
//         const innerRadius = radius - 30;
//         const outerRadius = innerRadius + waveHeight;
        
//         const innerX = centerX + innerRadius * Math.cos(angle);
//         const innerY = centerY + innerRadius * Math.sin(angle);
        
//         const outerX = centerX + outerRadius * Math.cos(angle);
//         const outerY = centerY + outerRadius * Math.sin(angle);
        
//         if (i === 0) {
//           ctx.moveTo(outerX, outerY);
//         } else {
//           ctx.lineTo(outerX, outerY);
//         }
//       }
      
//       // Close the path by connecting back to the first point
//       if (audioData.length > 0) {
//         const angle = 0;
//         const waveHeight = audioData[0] * maxWaveHeight;
//         const innerRadius = radius - 30;
//         const outerRadius = innerRadius + waveHeight;
//         ctx.lineTo(centerX + outerRadius * Math.cos(angle), centerY + outerRadius * Math.sin(angle));
//       }
      
//       ctx.closePath();
      
//       // Create gradient
//       const gradient = ctx.createRadialGradient(centerX, centerY, radius - 30, centerX, centerY, radius);
//       gradient.addColorStop(0, 'rgba(66, 135, 245, 0.8)');
//       gradient.addColorStop(1, 'rgba(96, 165, 250, 0.2)');
      
//       ctx.fillStyle = gradient;
//       ctx.fill();
      
//       // Draw inner circle
//       ctx.beginPath();
//       ctx.arc(centerX, centerY, radius - 30, 0, 2 * Math.PI);
//       ctx.strokeStyle = '#3b82f6';
//       ctx.lineWidth = 1.5;
//       ctx.stroke();
      
//       animationFrameRef.current = requestAnimationFrame(render);
//     };
    
//     render();
//   };
  
//   // Simulate transcription (in a real app, this would be a call to a speech-to-text API)
//   const simulateTranscription = () => {
//     const sampleResponses = [
//       "I have five years of experience in software development, specializing in web applications. I've worked on both frontend and backend technologies.",
//       "My greatest strength is problem-solving. I enjoy tackling complex challenges. My weakness is sometimes getting too focused on perfecting details.",
//       "I'm interested in this position because it aligns with my career goals and the company culture seems like a great fit for my working style.",
//       "When our project was behind schedule, I organized daily stand-ups and reprioritized tasks, which helped us deliver on time.",
//       "Yes, could you tell me more about the team structure and the day-to-day responsibilities of this role?"
//     ];
    
//     // Simulate processing delay
//     setTimeout(() => {
//       setTranscript(sampleResponses[currentQuestionNumber - 1] || "Response transcription would appear here.");
      
//       // Move to next question or complete interview
//       if (currentQuestionNumber < totalQuestions) {
//         setCurrentQuestionNumber(prev => prev + 1);
//         setStatus('ready');
//       } else {
//         setStatus('completed');
//       }
      
//       setLoading(false);
//     }, 2000);
//   };
  
//   // Helper function to determine status color
//   const getStatusColor = () => {
//     switch (status) {
//       case 'ready': return 'text-green-500';
//       case 'listening': return 'text-yellow-500';
//       case 'processing': return 'text-blue-500';
//       case 'completed': return 'text-purple-500';
//       default: return 'text-gray-500';
//     }
//   };
  
//   // Return component JSX
//   return (
//     <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl">
//       <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Interactive Interview Assistant</h2>
      
//       {/* Progress Bar */}
//       <div className="mb-8 px-4">
//         <div className="flex justify-between text-sm text-gray-600 mb-2">
//           <span>Progress</span>
//           <span>{Math.round((currentQuestionNumber / totalQuestions) * 100)}%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2.5">
//           <div 
//             className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
//             style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
//           ></div>
//         </div>
//       </div>
      
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center">
//           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
//           </svg>
//           {error}
//         </div>
//       )}
      
//       {/* Control Panel */}
//       <div className="flex justify-center space-x-4 mb-8">
//         {!isInterviewRunning ? (
//           <button
//             onClick={startInterview}
//             disabled={status === 'completed' || loading}
//             className={`px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
//               status === 'completed'
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
//             }`}
//           >
//             {status === 'completed' ? (
//               <>
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 Interview Completed
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Start Interview
//               </>
//             )}
//           </button>
//         ) : (
//           <button
//             onClick={stopInterview}
//             disabled={loading}
//             className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             Stop Interview
//           </button>
//         )}
        
//         {isRecording && (
//           <button
//             onClick={stopRecording}
//             disabled={loading}
//             className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
//             </svg>
//             Stop Recording
//           </button>
//         )}
//       </div>
      
//       {/* Video and Audio Visualization Section */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Webcam Card */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl">
//           <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             Video Preview
//           </h3>
          
//           <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
//             {webcamActive ? (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="absolute inset-0 flex items-center justify-center text-gray-400">
//                 <div className="text-center">
//                   <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                   </svg>
//                   <p>Webcam inactive</p>
//                 </div>
//               </div>
//             )}
            
//             {/* Recording indicator */}
//             {isRecording && webcamActive && (
//               <div className="absolute top-3 right-3 flex items-center bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
//                 <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
//                 REC
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Audio Visualization Card */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl">
//           <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//             </svg>
//             Speech Visualization
//           </h3>
          
//           <div className="aspect-square relative flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//             <canvas 
//               ref={canvasRef} 
//               width={300} 
//               height={300} 
//               className="max-w-full"
//             />
            
//             {isRecording ? (
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center text-gray-500 font-medium">
//                   {volumeLevel > 0.1 ? 'Speaking...' : 'Listening...'}
//                 </div>
//               </div>
//             ) : (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="text-center text-gray-400">
//                   <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                   </svg>
//                   <p>Audio visualization will appear here</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Two-column layout for desktop */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Question Card */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col transition-all duration-500 hover:shadow-xl">
//           <div className="mb-4 flex justify-between items-center">
//             <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
//               Question {currentQuestionNumber} of {totalQuestions}
//             </span>
//             <div className="flex items-center">
//               <span className="text-sm mr-2">Status:</span>
//               <span className={`text-sm font-medium px-2 py-1 rounded-full ${
//                 status === 'ready' ? 'bg-green-100 text-green-800' :
//                 status === 'listening' ? 'bg-yellow-100 text-yellow-800' :
//                 status === 'processing' ? 'bg-blue-100 text-blue-800' :
//                 status === 'completed' ? 'bg-purple-100 text-purple-800' :
//                 'bg-gray-100 text-gray-800'
//               }`}>
//                 {loading ? 'Loading...' : status}
//               </span>
//             </div>
//           </div>
          
//           <div className="text-xl font-medium mb-6 text-gray-800 flex-grow">
//             {currentQuestionNumber <= totalQuestions
//               ? interviewQuestions[currentQuestionNumber.toString()]
//               : "Congratulations! You've completed the interview."}
//           </div>
          
//           {isRecording && (
//             <div className="flex items-center justify-center bg-red-50 p-4 rounded-lg border border-red-100">
//               <div
//                 className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"
//                 style={{ opacity: Math.max(0.3, volumeLevel * 2) }}
//               ></div>
//               <span className="text-red-600 font-medium">Recording your answer...</span>
//             </div>
//           )}
//         </div>
        
//         {/* Response Card */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl">
//           <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//             </svg>
//             Your Response
//           </h3>
          
//           {audioUrl ? (
//             <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <audio
//                 controls
//                 src={audioUrl}
//                 className="w-full"
//               />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
//               <div className="text-center text-gray-400 italic">
//                 <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                 </svg>
//                 <p>Your recorded response will appear here</p>
//               </div>
//             </div>
//           )}
          
//           {transcript ? (
//             <div>
//               <h3 className="text-lg font-medium mb-2 text-gray-700 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Transcript
//               </h3>
//               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
//                 <p className="whitespace-pre-wrap text-sm font-mono text-gray-700">
//                   {transcript}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center text-gray-400 italic">
//               <p>Transcript will appear here after recording</p>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Tips Section */}
//       <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
//         <h3 className="text-md font-medium mb-2 text-blue-700 flex items-center">
//         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// </svg>
// Interview Tips
// </h3>
// <ul className="text-sm text-blue-700 space-y-2">
//   <li className="flex items-start">
//     <svg className="w-4 h-4 mr-2 mt-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//     Speak clearly and at a moderate pace
//   </li>
//   <li className="flex items-start">
//     <svg className="w-4 h-4 mr-2 mt-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//     Use the STAR method (Situation, Task, Action, Result) for behavioral questions
//   </li>
//   <li className="flex items-start">
//     <svg className="w-4 h-4 mr-2 mt-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//     Maintain eye contact with the camera to simulate in-person interaction
//   </li>
//   <li className="flex items-start">
//     <svg className="w-4 h-4 mr-2 mt-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//     Take a moment to gather your thoughts before answering complex questions
//   </li>
// </ul>
// </div>
// </div>
// );
// };

// export default InterviewRobot;


// now <onemptied className="apply">{/* Two-column layout for desktop */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Question Card */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col transition-all duration-500 hover:shadow-xl">
//           <div className="mb-4 flex justify-between items-center">
//             <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
//               Question {currentQuestionNumber} of {totalQuestions}
//             </span>
//             <div className="flex items-center">
//               <span className="text-sm mr-2">Status:</span>
//               <span className={`text-sm font-medium px-2 py-1 rounded-full ${
//                 status === 'ready' ? 'bg-green-100 text-green-800' :
//                 status === 'listening' ? 'bg-yellow-100 text-yellow-800' :
//                 status === 'processing' ? 'bg-blue-100 text-blue-800' :
//                 status === 'completed' ? 'bg-purple-100 text-purple-800' :
//                 'bg-gray-100 text-gray-800'
//               }`}>
//                 {loading ? 'Loading...' : status}
//               </span>
//             </div>
//           </div>
          
//           <div className="text-xl font-medium mb-6 text-gray-800 flex-grow">
//             {currentQuestionNumber <= totalQuestions
//               ? interviewQuestions[currentQuestionNumber.toString()]
//               : "Congratulations! You've completed the interview."}
//           </div>
          
//           {isRecording && (
//             <div className="flex items-center justify-center bg-red-50 p-4 rounded-lg border border-red-100">
//               <div
//                 className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"
//                 style={{ opacity: Math.max(0.3, volumeLevel * 2) }}
//               ></div>
//               <span className="text-red-600 font-medium">Recording your answer...</span>
//             </div>
//           )}
//         </div>
        
//         {/* Response Card */}
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl">
//           <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//             </svg>
//             Your Response
//           </h3>
          
//           {audioUrl ? (
//             <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <audio
//                 controls
//                 src={audioUrl}
//                 className="w-full"
//               />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
//               <div className="text-center text-gray-400 italic">
//                 <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                 </svg>
//                 <p>Your recorded response will appear here</p>
//               </div>
//             </div>
//           )}
          
//           {transcript ? (
//             <div>
//               <h3 className="text-lg font-medium mb-2 text-gray-700 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Transcript
//               </h3>
//               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
//                 <p className="whitespace-pre-wrap text-sm font-mono text-gray-700">
//                   {transcript}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center text-gray-400 italic">
//               <p>Transcript will appear here after recording</p>
//             </div>
//           )}
//         </div>
//       </div></onemptied>