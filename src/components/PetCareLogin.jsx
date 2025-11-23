import React, { useState } from 'react';

export default function PetCareLogin({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [signUpForm, setSignUpForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'http://localhost:8080';

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');
    
    if (!signUpForm.firstname || !signUpForm.lastname || !signUpForm.username || !signUpForm.password) {
      setError('Please fill in all fields');
      return;
    }

    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpForm)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`Account created successfully! You can now login with username: ${signUpForm.username}`);
        setSignUpForm({ firstname: '', lastname: '', username: '', password: '' });
        
        setTimeout(() => {
          setShowSignUp(false);
          setSuccessMessage('');
          setLoginForm({ username: signUpForm.username, password: '' });
        }, 2000);
      } else {
        setError(data.message || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Unable to connect to server. Please check if the backend is running on port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setSuccessMessage('');
    
    if (!loginForm.username || !loginForm.password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = {
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          userId: data.userId
        };
        
        // Store user data and credentials
        sessionStorage.setItem('user', JSON.stringify(userData));
        const credentials = btoa(`${loginForm.username}:${loginForm.password}`);
        sessionStorage.setItem('authCredentials', credentials);
        
        // Call the success handler passed from App.jsx
        onLoginSuccess(data.username);
        
        setLoginForm({ username: '', password: '' });
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please check if the backend is running on port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div style={styles.container}>
      <style>{styles.css}</style>

      <div style={{...styles.orb, ...styles.orb1}}></div>
      <div style={{...styles.orb, ...styles.orb2}}></div>
      <div style={{...styles.orb, ...styles.orb3}}></div>

      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoGlow}></div>
            <span style={{position: 'relative', zIndex: 1}}>🐾</span>
          </div>
          <h1 style={styles.title}>Pet Care Management</h1>
          <p style={styles.subtitle}>
            {showSignUp ? 'Create your admin account' : 'Admin System - Please login to continue'}
          </p>
        </div>

        <div style={styles.toggleContainer}>
          <button
            onClick={() => {
              setShowSignUp(false);
              setError('');
              setSuccessMessage('');
            }}
            style={{
              ...styles.toggleBtn,
              ...((!showSignUp) ? styles.toggleBtnActive : {})
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setShowSignUp(true);
              setError('');
              setSuccessMessage('');
            }}
            style={{
              ...styles.toggleBtn,
              ...((showSignUp) ? styles.toggleBtnActive : {})
            }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}
        {successMessage && <div className="success-box">{successMessage}</div>}

        {!showSignUp ? (
          <>
            <h2 style={styles.formTitle}>Admin Login</h2>

            <div className="input-container">
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Username</label>
            </div>

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                className="input-field"
                placeholder=" "
                style={{paddingRight: '50px'}}
              />
              <label className="input-label">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? (
                <span>
                  <span style={styles.spinner}>⏳</span> Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </>
        ) : (
          <>
            <h2 style={styles.formTitle}>Create Account</h2>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
              <div className="input-container" style={{marginBottom: 0}}>
                <input
                  type="text"
                  value={signUpForm.firstname}
                  onChange={(e) => setSignUpForm({...signUpForm, firstname: e.target.value})}
                  className="input-field"
                  placeholder=" "
                />
                <label className="input-label">First Name</label>
              </div>
              <div className="input-container" style={{marginBottom: 0}}>
                <input
                  type="text"
                  value={signUpForm.lastname}
                  onChange={(e) => setSignUpForm({...signUpForm, lastname: e.target.value})}
                  className="input-field"
                  placeholder=" "
                />
                <label className="input-label">Last Name</label>
              </div>
            </div>

            <div className="input-container">
              <input
                type="text"
                value={signUpForm.username}
                onChange={(e) => setSignUpForm({...signUpForm, username: e.target.value})}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Username</label>
            </div>

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={signUpForm.password}
                onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleSignUp)}
                className="input-field"
                placeholder=" "
                style={{paddingRight: '50px'}}
              />
              <label className="input-label">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <p style={styles.hint}>Must be at least 6 characters</p>
            </div>

            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </>
        )}

        <div className="demo-badge">
          🔒 Backend: {API_BASE_URL}
        </div>

        <p style={styles.footer}>
          © 2025 Pet Care Management. All rights reserved.
        </p>
      </div>
    </div>
  );
}

const styles = {
  css: `
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .input-container {
      position: relative;
      margin-bottom: 24px;
    }
    .input-field {
      width: 100%;
      padding: 16px 20px;
      font-size: 15px;
      border: 2px solid #e8e8e8;
      border-radius: 14px;
      outline: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
      background: #fafafa;
    }
    .input-field:focus {
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }
    .input-label {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 15px;
      color: #999;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: transparent;
      padding: 0 4px;
    }
    .input-field:focus ~ .input-label,
    .input-field:not(:placeholder-shown) ~ .input-label {
      top: 0;
      font-size: 12px;
      color: #667eea;
      font-weight: 600;
      background: white;
    }
    .submit-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 14px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 16px;
    }
    .submit-btn:not(:disabled):hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    }
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .error-box {
      background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
      color: white;
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
      font-weight: 500;
      margin-bottom: 20px;
    }
    .success-box {
      background: linear-gradient(135deg, #51cf66, #37b24d);
      color: white;
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 8px 25px rgba(81, 207, 102, 0.3);
      font-weight: 500;
      margin-bottom: 20px;
    }
    .demo-badge {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      border: 1px solid rgba(102, 126, 234, 0.3);
      padding: 14px 20px;
      border-radius: 12px;
      margin-top: 24px;
      font-size: 13px;
      color: #667eea;
      text-align: center;
      font-weight: 600;
    }
    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      pointer-events: none;
    }
  `,
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: '0.6',
    pointerEvents: 'none'
  },
  orb1: {
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, #667eea 0%, transparent 70%)',
    top: '-200px',
    left: '-200px',
    animation: 'float 20s infinite ease-in-out'
  },
  orb2: {
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, #764ba2 0%, transparent 70%)',
    bottom: '-250px',
    right: '-250px',
    animation: 'float 25s infinite ease-in-out',
    animationDelay: '3s'
  },
  orb3: {
    width: '350px',
    height: '350px',
    background: 'radial-gradient(circle, #f093fb 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 30s infinite ease-in-out',
    animationDelay: '6s'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    boxShadow: '0 30px 90px rgba(0,0,0,0.4)',
    padding: '48px',
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.2)',
    animation: 'slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    zIndex: 1
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px'
  },
  logo: {
    width: '90px',
    height: '90px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: '48px',
    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
    animation: 'bounce 2s infinite',
    position: 'relative'
  },
  logoGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    filter: 'blur(20px)',
    opacity: '0.5',
    animation: 'pulse 2s infinite'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    fontWeight: '500',
    lineHeight: '1.5'
  },
  toggleContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    background: '#f5f5f5',
    padding: '6px',
    borderRadius: '14px'
  },
  toggleBtn: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: '#666'
  },
  toggleBtnActive: {
    background: 'white',
    color: '#667eea',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '28px',
    color: '#1a1a2e',
    letterSpacing: '-0.3px'
  },
  eyeButton: {
    position: 'absolute',
    right: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#999',
    padding: '8px',
    zIndex: 2
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    marginTop: '6px',
    fontWeight: '500'
  },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
    color: '#999',
    fontSize: '12px',
    fontWeight: '500'
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite'
  }
};