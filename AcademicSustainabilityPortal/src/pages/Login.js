import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const CONSTANT_PASSWORD = '123456';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== CONSTANT_PASSWORD) {
      setError(`Incorrect password. Use: ${CONSTANT_PASSWORD}`);
      return;
    }

    // Success - Store in localStorage
    const user = {
      email: email,
      loginTime: new Date().toISOString(),
      rememberMe: rememberMe
    };

    localStorage.setItem('authToken', 'demo_token_' + Date.now());
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('userName', email);

    if (rememberMe) {
      localStorage.setItem('rememberUser', email);
    }

    // Redirect to reports page
    navigate('/reports');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Password reset feature coming soon!');
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    alert('Sign up feature coming soon!');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-left">
          <div className="brand-content">
            <h1>ACADEMIC<br />SUSTAINABILITY<br />INTELLIGENCE<br />PORTAL</h1>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="form-wrapper">
            <h2>Welcome Back</h2>
            <p className="form-subtitle">Sign in to your account</p>

            {error && <div className="error-message-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    title="Show/Hide Password"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" onClick={handleForgotPassword} className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary">
                SIGN IN
              </button>
            </form>

            <div className="form-footer">
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={handleCreateAccount} className="create-account">
                  CREATE ACCOUNT
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
