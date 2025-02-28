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

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard - Pending Approvals</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {pendingUsers.length === 0 ? (
        <div className="alert alert-info">No pending user approvals</div>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <span className="badge bg-warning">{user.approvalStatus}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => handleApprove(user.id)} 
                    className="btn btn-success btn-sm me-2">
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(user.id)} 
                    className="btn btn-danger btn-sm">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage; 