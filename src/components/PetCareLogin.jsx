import React, { useState, useEffect } from 'react';

export default function PetCareAdminSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [addUserForm, setAddUserForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = sessionStorage.getItem('user');
    const storedCredentials = sessionStorage.getItem('authCredentials');
    if (storedUser && storedCredentials) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const credentials = sessionStorage.getItem('authCredentials');
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
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
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        const credentials = btoa(`${loginForm.username}:${loginForm.password}`);
        sessionStorage.setItem('authCredentials', credentials);
        
        setCurrentUser(userData);
        setIsLoggedIn(true);
        setLoginForm({ username: '', password: '' });
        fetchUsers();
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

  const handleAddUser = async () => {
    setError('');
    setSuccessMessage('');
    
    if (!addUserForm.firstname || !addUserForm.lastname || !addUserForm.username || !addUserForm.password) {
      setError('Please fill in all fields');
      return;
    }

    if (addUserForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const credentials = sessionStorage.getItem('authCredentials');
      const response = await fetch(`${API_BASE_URL}/adduser`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addUserForm)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`User "${addUserForm.username}" added successfully!`);
        setAddUserForm({ firstname: '', lastname: '', username: '', password: '' });
        setShowAddUserForm(false);
        fetchUsers();
      } else {
        setError(data.message || 'Failed to add user. Please try again.');
      }
    } catch (err) {
      console.error('Add user error:', err);
      setError('Unable to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const credentials = sessionStorage.getItem('authCredentials');
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`User "${username}" deleted successfully!`);
        fetchUsers();
      } else {
        setError(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError('Unable to connect to server.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authCredentials');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsers([]);
    setLoginForm({ username: '', password: '' });
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (!isLoggedIn) {
    // Login Screen
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
            <p style={styles.subtitle}>Admin System - Please login to continue</p>
          </div>

          <h2 style={styles.formTitle}>Admin Login</h2>

          {error && <div className="error-box">{error}</div>}

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

  // Admin Dashboard
  return (
    <div style={styles.dashboardContainer}>
      <style>{styles.css}</style>

      <div style={styles.dashboardHeader}>
        <div style={styles.dashboardHeaderLeft}>
          <div style={styles.dashboardLogo}>🐾</div>
          <div>
            <h1 style={styles.dashboardTitle}>Pet Care Management</h1>
            <p style={styles.dashboardSubtitle}>Admin Dashboard</p>
          </div>
        </div>
        <div style={styles.dashboardHeaderRight}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{currentUser?.firstname?.[0]}{currentUser?.lastname?.[0]}</div>
            <div>
              <div style={styles.userName}>{currentUser?.firstname} {currentUser?.lastname}</div>
              <div style={styles.userRole}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.dashboardContent}>
        <div style={styles.contentHeader}>
          <h2 style={styles.contentTitle}>User Management</h2>
          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            style={styles.addUserBtn}
          >
            {showAddUserForm ? '✕ Cancel' : '+ Add New User'}
          </button>
        </div>

        {error && <div className="error-box" style={{marginBottom: '20px'}}>{error}</div>}
        {successMessage && <div className="success-box" style={{marginBottom: '20px'}}>{successMessage}</div>}

        {showAddUserForm && (
          <div style={styles.addUserCard}>
            <h3 style={styles.cardTitle}>Add New User</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div className="input-container">
                <input
                  type="text"
                  value={addUserForm.firstname}
                  onChange={(e) => setAddUserForm({...addUserForm, firstname: e.target.value})}
                  className="input-field"
                  placeholder=" "
                />
                <label className="input-label">First Name</label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  value={addUserForm.lastname}
                  onChange={(e) => setAddUserForm({...addUserForm, lastname: e.target.value})}
                  className="input-field"
                  placeholder=" "
                />
                <label className="input-label">Last Name</label>
              </div>
            </div>

            <div className="input-container">
              <input
                type="text"
                value={addUserForm.username}
                onChange={(e) => setAddUserForm({...addUserForm, username: e.target.value})}
                className="input-field"
                placeholder=" "
              />
              <label className="input-label">Username</label>
            </div>

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={addUserForm.password}
                onChange={(e) => setAddUserForm({...addUserForm, password: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleAddUser)}
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
              onClick={handleAddUser}
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Adding User...' : 'Add User'}
            </button>
          </div>
        )}

        <div style={styles.usersGrid}>
          {users.map((user) => (
            <div key={user.id} style={styles.userCard}>
              <div style={styles.userCardHeader}>
                <div style={styles.userCardAvatar}>
                  {user.firstname?.[0]}{user.lastname?.[0]}
                </div>
                <div style={styles.userCardInfo}>
                  <div style={styles.userCardName}>{user.firstname} {user.lastname}</div>
                  <div style={styles.userCardUsername}>@{user.username}</div>
                </div>
              </div>
              <div style={styles.userCardActions}>
                <button
                  onClick={() => handleDeleteUser(user.id, user.username)}
                  style={styles.deleteBtn}
                  disabled={user.id === currentUser?.userId}
                >
                  {user.id === currentUser?.userId ? '👤 You' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <p style={styles.emptyText}>No users found. Add your first user!</p>
          </div>
        )}
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
  },
  dashboardContainer: {
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  dashboardHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
  },
  dashboardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  dashboardLogo: {
    width: '60px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    backdropFilter: 'blur(10px)'
  },
  dashboardTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'white',
    margin: '0',
    letterSpacing: '-0.5px'
  },
  dashboardSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '4px 0 0 0'
  },
  dashboardHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    backdropFilter: 'blur(10px)'
  },
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white'
  },
  userRole: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  logoutBtn: {
    padding: '10px 24px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
    backdropFilter: 'blur(10px)'
  },
  dashboardContent: {
    padding: '48px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  contentTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0'
  },
  addUserBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  addUserCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    marginBottom: '32px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '24px'
  },
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  userCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s'
  },
  userCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  userCardAvatar: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '18px'
  },
  userCardInfo: {
    flex: 1
  },
  userCardName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '4px'
  },
  userCardUsername: {
    fontSize: '14px',
    color: '#999',
    fontWeight: '500'
  },
  userCardActions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  deleteBtn: {
    padding: '8px 20px',
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.3s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5
  },
  emptyText: {
    fontSize: '16px',
    color: '#999',
    fontWeight: '500'
  }
};