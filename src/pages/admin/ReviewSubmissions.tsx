import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Shield, LogOut, CheckCircle, XCircle, MessageSquare, ArrowLeft } from 'lucide-react';
import { fetchEventById } from '../../utils/supabaseHelpers';

interface ReviewSubmissionsProps {
  onLogout: () => void;
}

export default function ReviewSubmissions({ onLogout }: ReviewSubmissionsProps) {
  const { id } = useParams<{ id: string }>();
  const [competition, setCompetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const eventData = await fetchEventById(id!);
      setCompetition(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock submissions for review (submissions feature not yet in database schema)
  const [submissions, setSubmissions] = useState([
    {
      id: '1',
      title: 'Abstract Landscape',
      participant: 'John Doe',
      email: 'john@example.com',
      submittedDate: '2025-11-15',
      status: 'Pending',
      fileUrl: '#',
    },
    {
      id: '2',
      title: 'Digital Portrait',
      participant: 'Jane Smith',
      email: 'jane@example.com',
      submittedDate: '2025-11-16',
      status: 'Pending',
      fileUrl: '#',
    },
    {
      id: '3',
      title: 'Modern Art Collection',
      participant: 'Mike Johnson',
      email: 'mike@example.com',
      submittedDate: '2025-11-17',
      status: 'Pending',
      fileUrl: '#',
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [comment, setComment] = useState('');

  const handleApprove = (submissionId: string) => {
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId ? { ...sub, status: 'Approved' } : sub
    ));
    setSelectedSubmission(null);
    setComment('');
  };

  const handleReject = (submissionId: string) => {
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId ? { ...sub, status: 'Rejected' } : sub
    ));
    setSelectedSubmission(null);
    setComment('');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!competition && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-900 mb-4">Competition Not Found</h1>
          <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={32} />
            <div>
              <h1 className="text-white">Admin Portal</h1>
              <p className="text-sm text-gray-400">Review Submissions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/manage-competitions"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Manage Competitions
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <Link
            to="/admin/manage-competitions"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Competitions</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-gray-900 mb-2">{competition?.title}</h2>
            <p className="text-gray-600">
              {competition?.category} • Deadline: {competition?.date}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-gray-600 mb-1">Total Submissions</div>
              <div className="text-gray-900">{submissions.length}</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-gray-600 mb-1">Pending Review</div>
              <div className="text-gray-900">
                {submissions.filter(s => s.status === 'Pending').length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-gray-600 mb-1">Approved</div>
              <div className="text-gray-900">
                {submissions.filter(s => s.status === 'Approved').length}
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">All Submissions</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-gray-900">{submission.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        Participant: {submission.participant}
                      </p>
                      <p className="text-sm text-gray-600">
                        Submitted: {submission.submittedDate}
                      </p>
                    </div>

                    {submission.status === 'Pending' && (
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-gray-900 mb-6">Review Submission</h2>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-gray-600">Title:</span>
                <p className="text-gray-900">{selectedSubmission.title}</p>
              </div>
              <div>
                <span className="text-gray-600">Participant:</span>
                <p className="text-gray-900">
                  {selectedSubmission.participant} ({selectedSubmission.email})
                </p>
              </div>
              <div>
                <span className="text-gray-600">Submitted:</span>
                <p className="text-gray-900">{selectedSubmission.submittedDate}</p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
              <p className="text-gray-600">Submission file preview would appear here</p>
            </div>

            <div className="mb-6">
              <label htmlFor="comment" className="flex items-center gap-2 text-gray-700 mb-2">
                <MessageSquare size={16} />
                Add Comment (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Add feedback or comments..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setComment('');
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedSubmission.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle size={20} />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedSubmission.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={20} />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}