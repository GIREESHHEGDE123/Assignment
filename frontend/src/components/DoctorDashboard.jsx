import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import '../App.css'


const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  
  useEffect(() => {
    if (!user.token) {
      navigate("/login");
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
      setError("Failed to fetch patients.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const handleAddDiagnosis = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis) {
      setError("Please select a patient and enter a diagnosis.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/api/doctors/diagnoses/${selectedPatientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ diagnosis }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add diagnosis: ${response.status}`);
      }
      fetchPatients(); // Refresh patient data
      setDiagnosis("");
      setSelectedPatientId(null);
    } catch (err) {
      console.error("Error adding diagnosis:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Doctor Dashboard</h1>
      <button className="button2" onClick={handleLogout}>
        Logout
      </button>

      {error && <div className="alert-message">{error}</div>}
      {isLoading && <div className="alert-info">Loading...</div>}

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
              <th>Diagnoses</th>
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
                      style={{ width: "200px", height: "200px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setSelectedImage(patient.irisImage)}
                    />
                  ) : (
                    <span>No image available</span>
                  )}
                </td>
                <td>
                  {patient.diagnoses.length > 0 ? (
                    <ul>
                      {patient.diagnoses.map((diag, index) => (
                        <li key={index}>
                          <strong>Doctor:</strong> {diag.doctor} |{" "}
                          <strong>Diagnosis:</strong> {diag.diagnosis}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No diagnoses available</span>
                  )}
                </td>
                <td>
                  <button
                    className="submit-button"
                    onClick={() => setSelectedPatientId(patient._id)}
                  >
                    Add Diagnosis
                  </button>
           
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No patients found.</p>
      )}
 <br />

<h2>Add Diagnosis</h2>
<form onSubmit={handleAddDiagnosis}>
  <div className="mb-3">
    <label htmlFor="selectedPatient" className="form-label">
      Select Patient:
    </label>
    <select
      className="form-select"
      id="selectedPatient"
      value={selectedPatientId || ""}
      onChange={(e) => setSelectedPatientId(e.target.value)}
      required
    >
      <option value="">Choose a patient</option>
      {patients.map((patient) => (
        <option key={patient._id} value={patient._id}>
          {patient.name} ({patient.age} years)
        </option>
      ))}
    </select>
  </div>
  <div className="mb-3">
    <label htmlFor="diagnosis" className="form-label">
      Diagnosis:
    </label>
    <textarea
      className="form-control"
      id="diagnosis"
      rows="3"
      value={diagnosis}
      onChange={(e) => setDiagnosis(e.target.value)}
      required
    ></textarea>
  </div>
  <button type="submit" className="btn btn-success" disabled={isLoading}>
    {isLoading ? "Adding..." : "Add Diagnosis"}
  </button>
</form>

      {selectedImage && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Iris Image</h5>
                <button className="btn-close" onClick={() => setSelectedImage(null)}></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  alt="Enlarged iris"
                  style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
