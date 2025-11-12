import { useState, useEffect } from 'react';
import { Users, FileText, Trash2, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUsers, getReports, deleteReport, promoteUser } from '../utils/api';
import toast from 'react-hot-toast';

function Admin() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('reports');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, reportsData] = await Promise.all([
        getUsers(),
        getReports()
      ]);
      setUsers(usersData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      await deleteReport(reportId);
      setReports(prev => prev.filter(r => r._id !== reportId));
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      await promoteUser(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
      toast.success('User promoted to admin');
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user');
    }
  };

  const tabs = [
    { id: 'reports', label: 'Reports', icon: FileText, count: reports.length },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and reports</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Reports</h2>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report._id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{report.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Category: {report.category}</span>
                              <span>Location: {report.location?.county}</span>
                              <span>Status: {report.status}</span>
                              <span>By: {report.createdBy?.name}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        {report.imageUrl && (
                          <img src={report.imageUrl} alt="Report" className="mt-4 max-w-xs rounded-lg" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Users</h2>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user._id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handlePromoteUser(user._id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Promote</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;