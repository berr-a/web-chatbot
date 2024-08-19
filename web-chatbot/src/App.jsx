import React, { useState } from 'react';
import './App.css';
import Chatbot from './components/chatbot.jsx'; 
import Login from './components/Login'; 

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const handleLogin = (username) => {
    setCurrentUser(username);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser('');
    setLoggedIn(false);
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Chatbot user={currentUser} />
          <button onClick={handleLogout}>Çıkış Yap</button>
        </>
      )}
    </div>
  );
}

export default App;
