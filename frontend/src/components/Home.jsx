import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import Dashboard from './Dashboard';
import DoctorDashboard from './DoctorDashboard';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1 className="display-4">Welcome to HealthTrack Portal...</h1>
      </div>
      <div className="card shadow-lg">
        <div className="card-body">
          {user?.userType === 'operators' ? (
            <>
              <h2 className="text-primary">Operator Dashboard</h2>
              <Dashboard />
            </>
          ) : (
            <>
              <h2 className="text-success">Doctor Dashboard</h2>
              <DoctorDashboard />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
