import { X, Calendar, MapPin, User, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function IssueDetailModal({ issue, isOpen, onClose }) {
  if (!issue) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-60"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="issue-detail-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 id="issue-detail-title" className="text-2xl font-bold text-gray-900">
                {issue.title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issue Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{issue.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Category</p>
                        <p className="text-sm text-gray-600">{issue.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        issue.status === 'Resolved' ? 'bg-green-500' :
                        issue.status === 'In Progress' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Status</p>
                        <p className="text-sm text-gray-600">{issue.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">
                          {issue.location?.county || 'N/A'}
                          {issue.location?.subCounty && `, ${issue.location.subCounty}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reported</p>
                        <p className="text-sm text-gray-600">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {issue.createdBy && (
                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reported by</p>
                        <p className="text-sm text-gray-600">{issue.createdBy.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Display */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                  {issue.imageUrl ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={issue.imageUrl}
                          alt="Issue"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      {issue.additionalImages && issue.additionalImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {issue.additionalImages.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Issue ${index + 2}`}
                              className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">No images available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IssueDetailModal;