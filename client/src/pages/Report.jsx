import { useState, useEffect } from 'react';
import { Construction, Trash2, Droplets, Zap, ShieldAlert, Activity, Building, Plus, Menu, X } from 'lucide-react';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import MapView from '../components/MapView';
import IssueList from '../components/IssueList';
import ReportModal from '../components/ReportModal';
import IssueDetailModal from '../components/IssueDetailModal';
import SettingsModal from '../components/SettingsModal';
import { getReports, createReport } from '../utils/api';
import { motion } from 'framer-motion';

const CATEGORY_CARDS = [
  { name: 'Roads & Infrastructure', icon: Construction, color: 'bg-orange-500' },
  { name: 'Water & Sanitation', icon: Droplets, color: 'bg-blue-500' },
  { name: 'Waste Management', icon: Trash2, color: 'bg-green-600' },
  { name: 'Safety & Security', icon: ShieldAlert, color: 'bg-red-500' },
  { name: 'Electricity & Lighting', icon: Zap, color: 'bg-yellow-500' },
  { name: 'Health & Environment', icon: Activity, color: 'bg-purple-500' },
  { name: 'Public Services', icon: Building, color: 'bg-indigo-500' },
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
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchReports();

    // Connect to socket
    const socketUrl = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(socketUrl);
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
    const issue = issues.find(i => i._id === issueId);
    if (issue) {
      setSelectedIssue(issue);
      setIsDetailModalOpen(true);
    }
  };

  const handleViewReports = () => {
    // Scroll to the reports section
    const reportsSection = document.getElementById('recent-issues');
    if (reportsSection) {
      reportsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSettings = () => {
    setIsSettingsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-secondary">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 w-64 bg-white shadow-xl h-full overflow-y-auto"
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              filters={filters}
              onFilterChange={setFilters}
              onViewReports={handleViewReports}
              onSettings={handleSettings}
            />
          </motion.aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          filters={filters}
          onFilterChange={setFilters}
          onViewReports={handleViewReports}
          onSettings={handleSettings}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Report Dashboard</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Report Dashboard</h1>
            <p className="text-gray-600 text-sm lg:text-base">View and manage community issues across Kenya 🇰🇪</p>
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
            <p className="text-gray-600 text-sm mb-4">CIMA covers the most common issues affecting Kenyan communities, enabling faster response and transparent reporting</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
              {CATEGORY_CARDS.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`${category.color} text-white p-4 lg:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 lg:space-y-3`}
                >
                  <category.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                  <span className="font-semibold text-sm lg:text-base">{category.name}</span>
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
                id="recent-issues"
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
        className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 bg-primary text-white p-3 lg:p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Report Issue"
      >
        <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
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

      <IssueDetailModal
        issue={selectedIssue}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIssue(null);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

export default Report;

