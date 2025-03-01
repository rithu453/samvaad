import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';       
import SignUpPage from './com/signup';
import InterviewApp from './backup/start';
import Robo from './backup/robo';
import SyllabusPage from './com/setsyllabus';    
import LandingPage from './com/landing';   
import InteractiveInterviewApp from './com/interview';  
import Coding from './level2/code'; 
import Webcam from './com/webcam';
import Thirdgo from './com/thirdlevelgo';




function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/interviewapp" element={<InterviewApp />} />
          <Route path="/robo" element={<Robo />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/interview" element={<InteractiveInterviewApp />} />
          <Route path="/code" element={<Coding />} />
          <Route path="/now" element={<Webcam />} />
          <Route path="/finish" element={<Thirdgo />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
