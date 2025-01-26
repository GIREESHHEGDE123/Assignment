import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import '../App.css'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('doctors');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(baseURL + `/api/${userType}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Registration failed with status ${response.status}`);
      }

      navigate(`/login`); 
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message);
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
              <h3>Register</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert-message">{error}</div>}
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
                  <label htmlFor="name" className="form-label">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    required
                  />
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
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <div className="mt-3 text-center"> {/* Added link container */}
                <Link to="/login" className="btn btn-link"> {/* Link to Login */}
                  Already have an account? Login here.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;