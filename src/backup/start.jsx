// import React, { useState, useEffect, useRef } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import Robo from './robo.jsx';

// function Interview() {
//   const [isStarted, setIsStarted] = useState(false);
//   const [countdown, setCountdown] = useState(5);
//   const [isRedirected, setIsRedirected] = useState(false);
//   const [hasMediaAccess, setHasMediaAccess] = useState(false);
//   const [showSyllabusPage, setShowSyllabusPage] = useState(false);
//   const [syllabus, setSyllabus] = useState('');
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationRef = useRef(null);

//   useEffect(() => {
//     let timer;
//     if (isStarted && countdown > 0) {
//       timer = setTimeout(() => {
//         setCountdown(countdown - 1);
//       }, 1000);
//     } else if (isStarted && countdown === 0) {
//       setIsRedirected(true);
//     }
//     return () => clearTimeout(timer);
//   }, [isStarted, countdown]);

//   useEffect(() => {
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
      
//       if (audioContextRef.current) {
//         audioContextRef.current.close().catch(err => console.error("Error closing audio context:", err));
//       }
//     };
//   }, []);

//   const startInterview = () => {
//     setIsStarted(true);
//   };

//   const handleUserMedia = (stream) => {
//     setHasMediaAccess(true);
//     visualizeAudio(stream);
//   };

//   const handleUserMediaError = (error) => {
//     console.error("Error accessing media devices:", error);
//     setHasMediaAccess(false);
//   };

//   const navigateToSyllabusPage = () => {
//     setShowSyllabusPage(true);
//   };

//   const navigateBackToInterview = () => {
//     setShowSyllabusPage(false);
//   };

//   const handleSyllabusChange = (e) => {
//     setSyllabus(e.target.value);
//   };

//   //backend req
//   const handleSyllabusSubmit = (e) => {
//     e.preventDefault();
//     console.log("Syllabus submitted:", syllabus);

//     const data = {
//       message: syllabus
//     };
  
//     axios.post('http://10.0.53.41:8000/dynamic_question', data, {
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })
//     .then((response) => {
//       console.log("Response:", response.data);
//       alert("Syllabus submitted successfully!");
//       setShowSyllabusPage(false);
//     })
//     .catch((error) => {
//       console.error("Error submitting syllabus:", error);
//       if (error.response) {
//         console.log("Response Data:", error.response.data);
//       }
//       alert("Failed to submit syllabus. Please check the console for more details.");
//     });
//   };

//   //audio(wave line)
//   const visualizeAudio = (stream) => {
//     try {
//       const AudioContext = window.AudioContext || window.webkitAudioContext;
//       const audioContext = new AudioContext();
//       audioContextRef.current = audioContext;
      
//       const analyser = audioContext.createAnalyser();
//       analyserRef.current = analyser;
//       analyser.fftSize = 2048;
    
//       const source = audioContext.createMediaStreamSource(stream);
//       source.connect(analyser); 
    
//       const canvas = canvasRef.current;
//       if (!canvas) return;
      
//       const canvasCtx = canvas.getContext("2d");
//       const bufferLength = analyser.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);
      
//       const draw = () => {
//         animationRef.current = requestAnimationFrame(draw);
  
//         analyser.getByteTimeDomainData(dataArray);
//         canvasCtx.fillStyle = "rgb(0, 0, 0)";
//         canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
//         canvasCtx.lineWidth = 2;
//         canvasCtx.strokeStyle = "rgb(0, 255, 0)";
//         canvasCtx.beginPath();
  
//         const sliceWidth = canvas.width / bufferLength;
//         let x = 0;
  
//         for (let i = 0; i < bufferLength; i++) {
//           const v = dataArray[i] / 128.0;
//           const y = (v * canvas.height) / 2;
  
//           if (i === 0) {
//             canvasCtx.moveTo(x, y);
//           } else {
//             canvasCtx.lineTo(x, y);
//           }
  
//           x += sliceWidth;
//         }
  
//         canvasCtx.lineTo(canvas.width, canvas.height / 2);
//         canvasCtx.stroke();
//       };
  
//       draw();
//     } catch (error) {
//       console.error("Error setting up audio visualization:", error);
//     }
//   };
  
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
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           Interview Tips
//         </h3>
//         <ul className="text-sm text-blue-800">
//           <li className="mb-1">• Speak clearly and at a moderate pace</li>
//           <li className="mb-1">• Structure your answers with examples when possible</li>
//           <li className="mb-1">• Take a moment to collect your thoughts before answering</li>
//         </ul>
//       </div>
//     </div>

//   );
// }

// export default Interview;



import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import WebcamWithAudioDots from '../com/audio';

const API_BASE_URL = 'http://10.0.53.41:8000';

const InterviewRobot = () => {
  // State variables
  const [status, setStatus] = useState('idle'); // idle, ready, listening, processing, completed
  const [isInterviewRunning, setIsInterviewRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRedirected, setIsRedirected] = useState(false);
  const [hasMediaAccess, setHasMediaAccess] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  
 // Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
      
  
  //robo code/
  const Robo = () => {
    // State management
    const [audioUrl, setAudioUrl] = useState('');
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [isInterviewRunning, setIsInterviewRunning] = useState(false);
    const [status, setStatus] = useState('idle');
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [silenceTimer, setSilenceTimer] = useState(null);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [syllabusData, setSyllabusData] = useState([]);
    
    // Constants
    const silenceThreshold = 0.05;
    const silenceDuration = 3000;
  
    // References
    const navigate = useNavigate();
    const location = useLocation();
    const audioRef = useRef(null);
    const timeoutRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
  
    // Get questions from location state or use default questions
    const defaultQuestions = {
      "1": "Explain the difference between `let`, `const`, and `var` in JavaScript.",
      "2": "How do you select an HTML element by its ID using JavaScript?",
      "3": "Describe what a JavaScript function is and how you define one.",
      "4": "What is the purpose of the `addEventListener` method?",
      "5": "Explain the concept of closures in JavaScript and provide a simple example of how they work."
    };
  
    // Use questions from location state if available, otherwise use syllabus data or default questions
    useEffect(() => {
      if (location.state?.questions) {
        setSyllabusData(location.state.questions);
      } else {
        // You could fetch questions from backend here if needed
        // For now, we'll stick with default questions if nothing is provided
      }
    }, [location.state]);
  
    const interviewQuestions = syllabusData.length
      ? Object.fromEntries(syllabusData.map((q, index) => [index + 1, q])) 
      : defaultQuestions;
  
    const totalQuestions = Object.keys(interviewQuestions).length;
  
    // Cleanup effect
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (silenceTimer) clearTimeout(silenceTimer);
        if (audioRef.current) audioRef.current.pause();
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      };
    }, [silenceTimer]);
  
    // Control interview flow
    useEffect(() => {
      if (isInterviewRunning) {
        askQuestion();
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (silenceTimer) clearTimeout(silenceTimer);
      }
    }, [isInterviewRunning, currentQuestionNumber]);
  
    // Function to ask a question
    const askQuestion = async () => {
      if (currentQuestionNumber > totalQuestions) {
        setStatus('completed');
        setIsInterviewRunning(false);
        return;
      }
      
      setStatus('asking');
      const questionText = interviewQuestions[currentQuestionNumber.toString()];
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/tts/`,
          {
            params: { text: questionText },
            responseType: 'blob'
          }
        );
        
        const url = URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
        setAudioUrl(url);
        
        if (audioRef.current) audioRef.current.pause();
        
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onended = () => {
          setStatus('listening');
          startRecording();
        };
        
        audio.play().catch(error => {
          handleError("Error playing audio: " + error.message);
          setStatus('listening');
          startRecording();
        });
      } catch (error) {
        handleError("Failed to fetch audio: " + (error.response?.data?.detail || error.message || "Unknown error"));
        setStatus('listening');
        startRecording();
      } finally {
        setLoading(false);
      }
    };
  
    // Monitor audio levels to detect silence
    const monitorAudioLevel = (analyserNode) => {
      if (!analyserNode) return;
      
      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      const checkVolume = () => {
        if (!isRecording) return;
        
        analyserNode.getByteFrequencyData(dataArray);
  
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        
        const average = sum / bufferLength / 255;
        setVolumeLevel(average);
  
        if (average < silenceThreshold) {
          if (!silenceTimer) {
            const timer = setTimeout(() => {
              stopRecording();
            }, silenceDuration);
            setSilenceTimer(timer);
          }
        } else {
          if (silenceTimer) {
            clearTimeout(silenceTimer);
            setSilenceTimer(null);
          }
        }
  
        if (isRecording) {
          requestAnimationFrame(checkVolume);
        }
      };
  
      checkVolume();
    };
  
    // Handle errors
    const handleError = (errorMessage) => {
      setStatus('error');
      setError(errorMessage || 'An error occurred');
      timeoutRef.current = setTimeout(() => {
        setCurrentQuestionNumber(prevNumber => prevNumber + 1);
        setError('');
      }, 2000);
    };
  
    // Start interview
    const startInterview = () => {
      setCurrentQuestionNumber(1);
      setStatus('starting');
      setError('');
      setTranscript('');
      setRecordedAudio(null);
      setIsInterviewRunning(true);
    };
  
    // Stop interview
    const stopInterview = () => {
      setIsInterviewRunning(false);
      setStatus('stopped');
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (silenceTimer) clearTimeout(silenceTimer);
      if (audioRef.current) audioRef.current.pause();
      if (isRecording) stopRecording();
    };
  
    // Start recording
    const startRecording = async () => {
      try {
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true, 
            noiseSuppression: true, 
            autoGainControl: true 
          } 
        });
        
        streamRef.current = stream;
  
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyserRef.current = analyser;
  
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
  
        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunksRef.current.push(event.data);
        });
  
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudio(audioUrl);
          sendAudioToServer(audioBlob);
          
          if (silenceTimer) {
            clearTimeout(silenceTimer);
            setSilenceTimer(null);
          }
        });
  
        mediaRecorder.start();
        setIsRecording(true);
        monitorAudioLevel(analyser);
      } catch (error) {
        handleError('Microphone access denied. Please check your settings.');
        timeoutRef.current = setTimeout(() => {
          setCurrentQuestionNumber(prevNumber => prevNumber + 1);
        }, 3000);
      }
    };
  
    // Stop recording
    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive' && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setStatus('processing');
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    };
  
    // Send audio to server for speech-to-text processing
    const sendAudioToServer = async (audioBlob) => {
      setLoading(true);
      
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
    
        const response = await axios.post(`${API_BASE_URL}/stt/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
    
        if (response.data && response.data.transcript) {
          setTranscript(prevTranscripts =>
            `${prevTranscripts}Q${currentQuestionNumber}: ${interviewQuestions[currentQuestionNumber.toString()]}\nA: ${response.data.transcript}\n\n`
          );
        } else {
          setTranscript(prevTranscripts =>
            `${prevTranscripts}Q${currentQuestionNumber}: ${interviewQuestions[currentQuestionNumber.toString()]}\nA: [No transcript available]\n\n`
          );
        }
  
        timeoutRef.current = setTimeout(() => {
          setCurrentQuestionNumber(prevNumber => prevNumber + 1);
        }, 2000);
      } catch (error) {
        handleError('Failed to process audio: ' + (error.response?.data?.detail || error.message || 'Unknown error'));
        timeoutRef.current = setTimeout(() => {
          setCurrentQuestionNumber(prevNumber => prevNumber + 1);
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
  
    // Status Badge component
    const StatusBadge = ({ status, loading }) => {
      const statusConfig = {
        idle: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Ready' },
        asking: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Asking' },
        listening: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Listening' },
        processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
        completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completed' },
        error: { bg: 'bg-red-100', text: 'text-red-800', label: 'Error' },
        stopped: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Stopped' },
        starting: { bg: 'bg-green-100', text: 'text-green-800', label: 'Starting' }
      };
  
      const config = statusConfig[status] || statusConfig.idle;
      
      return (
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
          {loading ? 'Loading...' : config.label}
        </span>
      );
    };
  
    return (
      <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Interactive Interview Assistant
        </h2>
        
        {/* Progress Bar */}
        <div className="mb-8 px-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentQuestionNumber / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            {error}
          </div>
        )}
        
        {/* Control Panel */}
        <div className="flex justify-center space-x-4 mb-8">
          {!isInterviewRunning ? (
            <button
              onClick={startInterview}
              disabled={status === 'completed' || loading}
              className={`px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                status === 'completed'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
              }`}
            >
              {status === 'completed' ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Interview Completed
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Interview
                </>
              )}
            </button>
          ) : (
            <button
              onClick={stopInterview}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Stop Interview
            </button>
          )}
          
          {isRecording && (
            <button
              onClick={stopRecording}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Recording
            </button>
          )}
        </div>
        
        {/* Two-column layout for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col transition-all duration-500 hover:shadow-xl">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Question {currentQuestionNumber} of {totalQuestions}
              </span>
              <div className="flex items-center">
                <span className="text-sm mr-2">Status:</span>
                <StatusBadge status={status} loading={loading} />
              </div>
            </div>
            
            <div className="text-xl font-medium mb-6 text-gray-800 flex-grow">
              {currentQuestionNumber <= totalQuestions
                ? interviewQuestions[currentQuestionNumber.toString()]
                : "Congratulations! You've completed the interview."}
            </div>
            
            {isRecording && (
              <div className="flex items-center justify-center bg-red-50 p-4 rounded-lg border border-red-100">
                <div
                  className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"
                  style={{ opacity: Math.max(0.3, volumeLevel * 2) }}
                ></div>
                <span className="text-red-600 font-medium">Recording your answer...</span>
              </div>
            )}
          </div>
          
          {/* Response Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Your Response
            </h3>
            
            {recordedAudio ? (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <audio
                  controls
                  src={recordedAudio}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
                <div className="text-center text-gray-400 italic">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p>Your recorded response will appear here</p>
                </div>
              </div>
            )}
            
            {transcript ? (
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-700 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Transcript
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  <p className="whitespace-pre-wrap text-sm font-mono text-gray-700">
                    {transcript}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 italic">
                <p>Transcript will appear here after recording</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Clean up function for audio resources
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Start the interview process
  const startInterview = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsInterviewRunning(true);
      setStatus('ready');
      setIsRedirected(true); 
      // Start recording automatically
      startRecording();
    } catch (err) {
      setError(`Failed to start interview: ${err.message}`);
      setLoading(false);
      setIsInterviewRunning(false);
    }
  };
  const handleUserMedia = (stream) => {
    setHasMediaAccess(true);
  
  };

  const handleUserMediaError = (error) => {
    console.error("Error accessing media devices:", error);
    setHasMediaAccess(false);
  };

  
  // Stop the interview process
  const stopInterview = () => {
    if (isRecording) {
      stopRecording();
    }
    
    setIsInterviewRunning(false);
    setStatus('idle');
  };
  
  // Start audio recording
  const startRecording = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    
      
      // Initialize media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Clear previous recording data
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Simulate transcription (in a real app, you'd send the blob to a speech-to-text API)

      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setStatus('listening');
      setLoading(false);
    } catch (err) {
      setError(`Failed to start recording: ${err.message}`);
      setLoading(false);
    }
  };
  



  // Stop audio recording
  const stopRecording = () => {
    setLoading(true);
    setStatus('processing');
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
    }
  };
  

  
  // Helper function to determine status color
  const getStatusColor = () => {
    switch (status) {
      case 'ready': return 'text-green-500';
      case 'listening': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'completed': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };
  
  // Return component JSX
  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Interactive Interview Assistant</h2>
      
      <div>
      <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ← Back
      </button>
      <br/>
      </div>

      <Robo/>
    

      <div>
      <WebcamWithAudioDots/>
      </div>


      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-md font-medium mb-2 text-blue-700 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Interview Tips
        </h3>
        <ul className="text-sm text-blue-800">
          <li className="mb-1">• Speak clearly and at a moderate pace</li>
          <li className="mb-1">• Structure your answers with examples when possible</li>
          <li className="mb-1">• Take a moment to collect your thoughts before answering</li>
        </ul>
      </div>
    </div>
  );
};

export default InterviewRobot;
