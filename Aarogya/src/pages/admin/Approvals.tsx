import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'doctor' | 'lab';
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  specialization?: string;
  address?: string;
}

export default function Approvals() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingApprovals = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/approvals/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data.users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/admin/approvals/${userId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove from list
      setUsers(users.filter(u => u.id !== userId));
      alert('User approved successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this user?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/admin/approvals/${userId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove from list
      setUsers(users.filter(u => u.id !== userId));
      alert('User rejected');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject user');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">No pending approvals</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'doctor' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.role === 'doctor' ? user.specialization : user.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

