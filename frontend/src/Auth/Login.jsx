import React, { useState, useContext } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import '../App.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('doctors'); // Default user type
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const { setToken, setUserId, setUserType: setContextUserType } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const response = await fetch(baseURL + `/api/${userType}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Login failed with status ${response.status}`);
      }

      const data = await response.json();
      setToken(data.token);
      setUserId(data.id);
      setContextUserType(userType); // Set userType in context
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid credentials or an error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-box">
      <div className="row1">
        <div className="col1">
          <div className="card shadow">
            <div className="card-header">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              {loginError && <div className="alert-message">{loginError}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="userType" className="form-label">User Type:</label>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="form-select"
                  >
                    <option value="doctors">Doctor</option>
                    <option value="operators">Operator</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="button1"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <div className="mt-3 text-center"> {/* Added link container */}
                <Link to="/register" className="btn btn-link"> {/* Link to Register */}
                  Don't have an account? Register here.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;