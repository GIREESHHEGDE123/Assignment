import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import IrisUploadModal from './IrisUploadModal'; 
import './Dashboard.css'

const Dashboard = () => {


const navigate = useNavigate();
  const { user, clearUser } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [newPatient, setNewPatient] = useState({ name: '', gender: '', age: '',symptoms:'', irisImage: '' });
  const [editingPatientId, setEditingPatientId] = useState(null);

  useEffect(() => {
    if (!user.token) {
      navigate('/login');
      return;
    }
    fetchPatients();
  }, [user, navigate]);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/patients`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch patients.');
    } finally {
      setIsLoading(false);
    }
  };

  const [showIrisModal, setShowIrisModal] = useState(false);

  const handleOpenIrisModal = () => {
    setShowIrisModal(true);
  };

  const handleCloseIrisModal = () => {
    setShowIrisModal(false);
  };

  const handleIrisUpload = (imageUrl) => {
    setNewPatient(prevPatient => ({
      ...prevPatient,
      irisImage: imageUrl,
    }));
  };

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create patient: ${response.status}`);
      }
      fetchPatients();
      setNewPatient({ name: '', gender: '', age: '',symptoms:'', irisImage: '' });
    } catch (err) {
      console.error("Error creating patient:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatientId(patient._id);
    setNewPatient(patient);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/patients/${editingPatientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update patient: ${response.status}`);
      }
      fetchPatients();
      setEditingPatientId(null);
      setNewPatient({ name: '', gender: '', age: '',symptoms:'', irisImage: '' });
    } catch (err) {
      console.error("Error updating patient:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete patient: ${response.status}`);
      }
      fetchPatients();
    } catch (err) {
      console.error("Error deleting patient:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mt-4">
  <h1>Dashboard</h1>
  <button className="button2" onClick={handleLogout}>Logout</button>

  {error && <div className="alert-message">{error}</div>}
  {isLoading && <div className="alert-info">Loading...</div>}

  <h2>{editingPatientId ? "Edit Patient" : "Create Patient"}</h2>
  <form onSubmit={editingPatientId ? handleUpdatePatient : handleCreatePatient}>
    <div className="mb-3">
      <label htmlFor="name" className="form-label">Name:</label>
      <input
        type="text"
        className="form-control"
        id="name"
        name="name"
        value={newPatient.name}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="mb-3">
      <label htmlFor="gender" className="form-label">Gender:</label>
      <select
        className="form-select"
        id="gender"
        name="gender"
        value={newPatient.gender}
        onChange={handleInputChange}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div className="mb-3">
      <label htmlFor="age" className="form-label">Age:</label>
      <input
        type="number"
        className="form-control"
        id="age"
        name="age"
        value={newPatient.age}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="mb-3">
      <label htmlFor="name" className="form-label">Symptoms:</label>
      <input
        type="text"
        className="form-control"
        id="symptoms"
        name="symptoms"
        value={newPatient.symptoms}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="mb-3">
      <label htmlFor="irisImage" className="form-label">Iris Image:</label>
      <input
        type="text"
        className="form-control"
        id="irisImage"
        name="irisImage"
        value={newPatient.irisImage}
        onChange={handleInputChange}
      />
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mt-2"
        onClick={handleOpenIrisModal}
      >
        Upload Image
      </button>
    </div>
    <button type="submit" className="btn btn-primary" disabled={isLoading}>
      {isLoading
        ? editingPatientId
          ? "Updating..."
          : "Creating..."
        : editingPatientId
        ? "Update Patient"
        : "Create Patient"}
    </button>
    {editingPatientId && (
      <button
        type="button"
        className="btn btn-secondary ms-2"
        onClick={() => {
          setEditingPatientId(null);
          setNewPatient({ name: '', gender: '', age: '',symptoms:'', irisImage: '' });
        }}
      >
        Cancel
      </button>
    )}
  </form>
  <br />
  <IrisUploadModal
    show={showIrisModal}
    handleClose={handleCloseIrisModal}
    onUpload={handleIrisUpload}
  />

  <h2>Patient List</h2>
  {patients.length > 0 ? (
  <table className="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Gender</th>
        <th>Symptoms</th>
        <th>Age</th>
     
        <th>Iris Image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {patients.map((patient) => (
        <tr key={patient._id}>
          <td>{patient.name}</td>
          <td>{patient.gender}</td>
          <td>{patient.symptoms}</td>
          <td>{patient.age}</td>
          <td>
            {patient.irisImage ? (
              <img
                src={patient.irisImage}
                alt={`${patient.name}'s iris`}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            ) : (
              <span>No image available</span>
            )}
          </td>
          <td>
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => handleEdit(patient)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(patient._id)}
              disabled={isLoading}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No patients found.</p>
)}

</div>

  );
};

export default Dashboard;