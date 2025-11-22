import React, { useState, useEffect } from 'react';

export default function PetCareLogin({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onLoginSuccess(formData.username);
      setIsLoading(false);
    }, 500);
  };

  const handleRegister = () => {
    setError('');
    
    if (!formData.firstname || !formData.lastname || !formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      alert('Registration successful! You can now login.');
      setShowRegister(false);
      setFormData({ 
        username: formData.username, 
        password: formData.password 
      });
      setIsLoading(false);
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showRegister) {
        handleRegister();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
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
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
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
          position: relative;
          overflow: hidden;
          letter-spacing: 0.5px;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }
        .submit-btn:not(:disabled):active {
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .submit-btn:hover::before {
          left: 100%;
        }
        .error-box {
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          color: white;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 24px;
          animation: slideIn 0.3s ease-out;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
          font-weight: 500;
        }
        .link-text {
          color: #667eea;
          text-decoration: none;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
          position: relative;
        }
        .link-text:hover {
          color: #764ba2;
        }
        .link-text::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }
        .link-text:hover::after {
          width: 100%;
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
          backdrop-filter: blur(10px);
        }
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      {/* Animated Background Orbs */}
      <div style={{...styles.orb, ...styles.orb1}}></div>
      <div style={{...styles.orb, ...styles.orb2}}></div>
      <div style={{...styles.orb, ...styles.orb3}}></div>

      {/* Floating Particles */}
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
            {showRegister ? 'Create your account to get started' : 'Welcome back! Please login to continue'}
          </p>
        </div>

        {!showRegister ? (
          // Login Form
          <div>
            <h2 style={styles.formTitle}>Sign In</h2>

            {error && <div className="error-box">{error}</div>}

            <div className="input-container">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput('')}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Username</label>
            </div>

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
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

            <div style={styles.rememberRow}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                <span>Remember me</span>
              </label>
              <a href="#" className="link-text" style={{textDecoration: 'none'}}>Forgot password?</a>
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

            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>or</span>
              <span style={styles.dividerLine}></span>
            </div>

            <div style={{textAlign: 'center', marginTop: '24px', fontSize: '15px', color: '#666'}}>
              Don't have an account?{' '}
              <span onClick={() => setShowRegister(true)} className="link-text">
                Sign Up
              </span>
            </div>

            <div className="demo-badge">
              💡 Demo Mode: Enter any username and password to access
            </div>
          </div>
        ) : (
          // Register Form
          <div>
            <h2 style={styles.formTitle}>Create Account</h2>

            {error && <div className="error-box">{error}</div>}

            <div style={styles.gridRow}>
              <div className="input-container">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder=" "
                />
                <label className="input-label">First Name</label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder=" "
                />
                <label className="input-label">Last Name</label>
              </div>
            </div>

            <div className="input-container">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Username</label>
            </div>

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
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
              <p style={styles.hint}>
                Must be at least 6 characters
              </p>
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? (
                <span>
                  <span style={styles.spinner}>⏳</span> Creating account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>or</span>
              <span style={styles.dividerLine}></span>
            </div>

            <div style={{textAlign: 'center', marginTop: '24px', fontSize: '15px', color: '#666'}}>
              Already have an account?{' '}
              <span onClick={() => setShowRegister(false)} className="link-text">
                Sign In
              </span>
            </div>
          </div>
        )}
 
        <p style={styles.footer}>
          © 2025 Pet Care Management. All rights reserved.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
    boxShadow: '0 30px 90px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.3)',
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
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '28px',
    color: '#1a1a2e',
    letterSpacing: '-0.3px'
  },
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#666',
    fontWeight: '500'
  },
  checkbox: {
    marginRight: '8px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#667eea'
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
    transition: 'transform 0.2s',
    zIndex: 2
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '28px',
    marginBottom: '8px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)'
  },
  dividerText: {
    padding: '0 16px',
    color: '#999',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
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