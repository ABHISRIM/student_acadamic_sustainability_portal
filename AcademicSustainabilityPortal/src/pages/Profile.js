import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setProfileData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: localStorage.getItem('phone') || '',
        institution: localStorage.getItem('institution') || '',
      });
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('phone', profileData.phone);
    localStorage.setItem('institution', profileData.institution);

    setUser(updatedUser);
    setMessage('Profile updated successfully!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage('All password fields are required');
      setMessageType('error');
      return;
    }

    const storedPassword = localStorage.getItem('userPassword') || user?.password || 'password123';

    if (passwordData.currentPassword !== storedPassword) {
      setMessage('Current password is incorrect');
      setMessageType('error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    localStorage.setItem('userPassword', passwordData.newPassword);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    setMessage('Password updated successfully!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Change Password
        </button>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="avatar-section">
              <div className="avatar">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <p>{user?.email}</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={profileData.institution}
                  onChange={handleProfileChange}
                  placeholder="Your institution name"
                />
              </div>

              <button type="submit" className="btn-submit">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-section">
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <h3>Change Your Password</h3>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                />
              </div>

              <button type="submit" className="btn-submit">
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
