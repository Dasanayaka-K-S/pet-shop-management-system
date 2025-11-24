import React, { useState, useEffect } from 'react';

export default function UserManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchUsers();
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

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div style={styles.container}>
      <style>{styles.css}</style>

      {/* Updated Title Section with Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            👥
          </div>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a2e',
              margin: '0'
            }}>User Management</h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>Manage system administrators and users</p>
          </div>
        </div>
        
        {/* Updated Add User Button */}
        <button
          onClick={() => setShowAddUserForm(!showAddUserForm)}
          style={{
            padding: '14px 28px',
            background: showAddUserForm 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: showAddUserForm
              ? '0 4px 15px rgba(239, 68, 68, 0.3)'
              : '0 4px 15px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showAddUserForm ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            )}
          </svg>
          {showAddUserForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {error && <div className="error-box" style={{marginBottom: '20px'}}>{error}</div>}
      {successMessage && <div className="success-box" style={{marginBottom: '20px'}}>{successMessage}</div>}

      {showAddUserForm && (
        <div style={styles.addUserCard} className="fade-in">
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
          <div key={user.id} style={styles.userCard} className="hover-card">
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
                style={{
                  ...styles.deleteBtn,
                  background: user.id === currentUser?.userId ? '#94a3b8' : '#ef4444',
                  cursor: user.id === currentUser?.userId ? 'not-allowed' : 'pointer',
                  opacity: user.id === currentUser?.userId ? 0.7 : 1
                }}
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
  );
}

const styles = {
  css: `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .fade-in {
      animation: fadeIn 0.4s ease-out;
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
    .hover-card {
      transition: all 0.3s ease;
    }
    .hover-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12) !important;
    }
  `,
  container: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  addUserCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    marginBottom: '32px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#0f172a'
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
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  userCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
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
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '18px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  userCardInfo: {
    flex: 1
  },
  userCardName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  userCardUsername: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  userCardActions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  deleteBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    transition: 'all 0.3s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '600'
  }
};