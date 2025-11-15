import { Calendar, MapPin, Image } from 'lucide-react';

function IssueList({ issues, onIssueClick }) {
  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No issues found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr
                key={issue._id}
                onClick={() => onIssueClick(issue._id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {issue.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {issue.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {issue.location?.county || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    issue.status === 'Resolved'
                      ? 'bg-green-100 text-green-800'
                      : issue.status === 'In Progress'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {issue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {issues.map((issue) => (
          <div
            key={issue._id}
            onClick={() => onIssueClick(issue._id)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">{issue.title}</h3>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                issue.status === 'Resolved'
                  ? 'bg-green-100 text-green-800'
                  : issue.status === 'In Progress'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {issue.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{issue.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full mr-2">
                  {issue.category}
                </span>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {issue.location?.county || 'N/A'}
                </div>
                {issue.imageUrl && (
                  <div className="flex items-center ml-2">
                    <Image className="w-3 h-3 text-green-600" />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IssueList;
