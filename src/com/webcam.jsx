// import React, { useRef, useState } from "react";
// import axios from "axios";

// const Webcam = () => {
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const [recording, setRecording] = useState(false);
//   const [stream, setStream] = useState(null);

//   // Function to start recording
//   const startRecording = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       videoRef.current.srcObject = mediaStream;
//       setStream(mediaStream);

//       const mediaRecorder = new MediaRecorder(mediaStream, {
//         mimeType: "video/webm",
//       });

//       mediaRecorderRef.current = mediaRecorder;
//       mediaRecorder.start(1000); // Splits into 1-sec chunks

//       mediaRecorder.ondataavailable = async (event) => {
//         if (event.data.size > 0) {
//           const formData = new FormData();
//           formData.append("video_chunk", event.data, "chunk.webm");

//           await axios.post("http://10.0.51.196:8000/upload", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           });
//         }
//       };

//       setRecording(true);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   };

//   // Function to stop recording
//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }

//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }

//     setRecording(false);
//   };

//   return (
//     <div>
//       <h2>Live Video Streaming to FastAPI</h2>
//       <video ref={videoRef} autoPlay playsInline style={{ width: "500px", border: "2px solid black" }}></video>
//       <div>
//         {!recording ? (
//           <button onClick={startRecording}>Start Recording</button>
//         ) : (
//           <button onClick={stopRecording}>Stop Recording</button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Webcam;
