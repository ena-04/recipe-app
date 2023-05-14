import { db } from "./firebase.config"
import { useState, useEffect } from "react"
import {storage} from "./firebase.config";
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login"
import { signOut } from "firebase/auth";
import { auth } from "./firebase.config"; 


import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc
} from "firebase/firestore"

function App() { 
  

  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  
  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };



  return (




    <Router>
      <nav>
        <Link to="/">Home</Link>
        {!isAuth ? <Link to="/login">Login</Link>: (

        <button onClick={signUserOut}>Log Out</button>
        )}

      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth}/>} />
      </Routes>
    </Router>


    

    
  );
}

export default App;