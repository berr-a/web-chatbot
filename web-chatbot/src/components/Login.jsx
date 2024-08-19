import React, { useState } from 'react';
import './Login.css'; // Login sayfasının stil dosyası

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerMode, setRegisterMode] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      if (registerMode) {
        // Kullanıcı kaydı işlemi
        if (localStorage.getItem(username)) {
          setRegistrationMessage('Bu kullanıcı adı zaten alınmış.');
        } else {
          localStorage.setItem(username, password);
          setIsRegistered(true);
          setRegistrationMessage('Kayıt başarılı! Aşağıdaki butonu kullanarak giriş yapabilirsiniz.');
        }
      } else {
        // Kullanıcı girişi işlemi
        const storedPassword = localStorage.getItem(username);
        if (storedPassword && storedPassword === password) {
          onLogin(username); // Giriş başarılıysa onLogin fonksiyonunu çağır
        } else {
          alert('Kullanıcı adı veya şifre yanlış.');
        }
      }
    } else {
      alert('Lütfen kullanıcı adı ve şifre girin.');
    }
  };

  const handleDirectLogin = () => {
    const storedPassword = localStorage.getItem(loginUsername);
    if (storedPassword && storedPassword === loginPassword) {
      onLogin(loginUsername); // Giriş başarılıysa onLogin fonksiyonunu çağır
    } else {
      alert('Kullanıcı adı veya şifre yanlış.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-text">
          <h2>{registerMode ? 'Kayıt Ol' : 'Giriş Yap'}</h2>
          <form onSubmit={registerMode ? handleSubmit : handleSubmit}>
            <label>
              Kullanıcı Adı:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              Şifre:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">
              {registerMode ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </form>
          {isRegistered && (
            <div className="direct-login">
              <h3>Giriş Yap:</h3>
              <label>
                Kullanıcı Adı:
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </label>
              <label>
                Şifre:
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </label>
              <button onClick={handleDirectLogin}>Direkt Giriş Yap</button>
            </div>
          )}
          <button className="toggle-mode" onClick={() => {
            setRegisterMode(!registerMode);
            setRegistrationMessage('');
            setIsRegistered(false);
          }}>
            {registerMode ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
          {registrationMessage && <p>{registrationMessage}</p>}
        </div>
        <div className="login-image">
          <img src="https://www.weetechsolution.com/wp-content/uploads/2023/01/Appointment-bots.png" alt="Chatbot" />
        </div>
      </div>
    </div>
  );
}

export default Login;
