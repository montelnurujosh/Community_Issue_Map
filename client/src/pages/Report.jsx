import { useState, useEffect } from 'react';
import { Construction, Trash2, Droplets, Zap, ShieldAlert, Plus } from 'lucide-react';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import MapView from '../components/MapView';
import IssueList from '../components/IssueList';
import ReportModal from '../components/ReportModal';
import { getReports, createReport } from '../utils/api';
import { motion } from 'framer-motion';

const CATEGORY_CARDS = [
  { name: 'Road', icon: Construction, color: 'bg-orange-500' },
  { name: 'Water', icon: Droplets, color: 'bg-blue-500' },
  { name: 'Electricity', icon: Zap, color: 'bg-yellow-500' },
  { name: 'Waste', icon: Trash2, color: 'bg-green-600' },
  { name: 'Security', icon: ShieldAlert, color: 'bg-red-500' },
];

function Report() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All',
    county: 'All',
    status: 'All',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [focusedIssueId, setFocusedIssueId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchReports();

    // Connect to socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('newReport', (newReport) => {
      setIssues(prev => [newReport, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [issues, filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];

    if (filters.category !== 'All') {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }

    if (filters.county !== 'All') {
      filtered = filtered.filter(issue => issue.location?.county === filters.county);
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }

    setFilteredIssues(filtered);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmitReport = async (reportData) => {
    try {
      await createReport(reportData);
      setIsModalOpen(false);
      setSelectedCategory('');
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleIssueClick = (issueId) => {
    setFocusedIssueId(issueId);
  };

  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar filters={filters} onFilterChange={setFilters} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Dashboard</h1>
            <p className="text-gray-600">View and manage community issues across Kenya 🇰🇪</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <DashboardCards issues={issues} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Report by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {CATEGORY_CARDS.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`${category.color} text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-3`}
                >
                  <category.icon className="w-8 h-8" />
                  <span className="font-semibold">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">Loading issues...</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Issue Map</h2>
                <MapView issues={filteredIssues} focusedIssueId={focusedIssueId} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recent Issues ({filteredIssues.length})
                </h2>
                <IssueList issues={filteredIssues} onIssueClick={handleIssueClick} />
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Floating Report Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Report Issue"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory('');
        }}
        onSubmit={handleSubmitReport}
        initialCategory={selectedCategory}
      />
    </div>
  );
}

export default Report;
