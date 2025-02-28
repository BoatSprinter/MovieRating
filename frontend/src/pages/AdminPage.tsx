import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

interface UserListItem {
  id: number;
  username: string;
  approvalStatus: string;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (user && !user.isAdmin) {
      navigate('/');
      return;
    }

    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/pending-users');
        setPendingUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pending users');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPendingUsers();
  }, [user, navigate]);

  const handleApprove = async (userId: number) => {
    try {
      await axios.post(`/api/admin/approve-user/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to approve user');
      console.error(err);
    }
  };

  const handleReject = async (userId: number) => {
    try {
      await axios.post(`/api/admin/reject-user/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to reject user');
      console.error(err);
    }
  };

  if (loading) return <div className="d-flex justify-content-center my-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="display-6 fw-bold">Admin Dashboard</h2>
          <p className="text-muted">Manage user approval requests</p>
        </div>
      </div>
      
      {error && <div className="alert alert-danger shadow-sm">{error}</div>}
      
      {pendingUsers.length === 0 ? (
        <div className="alert alert-info shadow-sm p-4 text-center">
          <i className="bi bi-check-circle-fill me-2"></i>
          No pending user approvals at this time
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {pendingUsers.map(user => (
            <div className="col" key={user.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fw-bold">{user.username}</h5>
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                      {user.approvalStatus}
                    </span>
                  </div>
                  <p className="card-text text-muted mb-4">
                    <i className="bi bi-calendar3 me-2"></i>
                    Registered: {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </p>
                  <div className="d-grid gap-2">
                    <button 
                      onClick={() => handleApprove(user.id)} 
                      className="btn btn-success">
                      <i className="bi bi-check-lg me-2"></i>Approve
                    </button>
                    <button 
                      onClick={() => handleReject(user.id)} 
                      className="btn btn-danger">
                      <i className="bi bi-x-lg me-2"></i>Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage; 