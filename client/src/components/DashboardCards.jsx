import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function DashboardCards({ issues }) {
  const totalReports = issues.length;
  const openReports = issues.filter(issue => issue.status !== 'Resolved').length;
  const resolvedReports = issues.filter(issue => issue.status === 'Resolved').length;

  const cards = [
    {
      title: 'Total Reports',
      value: totalReports,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Open Reports',
      value: openReports,
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      title: 'Resolved',
      value: resolvedReports,
      icon: CheckCircle,
      color: 'bg-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className={`${card.color} p-3 rounded-2xl`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardCards;
