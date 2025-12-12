import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import * as api from '../utils/api';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Edit } from 'lucide-react';

interface MySubmissionsProps {
  user: any;
  onLogout: () => void;
}

export default function MySubmissions({ user, onLogout }: MySubmissionsProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.id || !user?.accessToken) return;

      try {
        setLoading(true);
        const fetchedSubmissions = await api.getUserSubmissions(user.accessToken, user.id);
        setSubmissions(fetchedSubmissions || []);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Submitted: 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      Accepted: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <FileText size={16} />;
      case 'Under Review':
        return <Clock size={16} />;
      case 'Accepted':
        return <CheckCircle size={16} />;
      case 'Rejected':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (submissionId: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      const updatedSubmissions = submissions.filter(sub => sub.id !== submissionId);
      setSubmissions(updatedSubmissions);
      localStorage.setItem(`submissions_${user.id}`, JSON.stringify(updatedSubmissions));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} onLogout={onLogout} />
      
      <main className="flex-1 py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-gray-900 mb-8">My Submissions</h1>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="mx-auto text-gray-400 mb-4" size={64} />
              <h2 className="text-gray-900 mb-2">Loading Submissions</h2>
              <p className="text-gray-600 mb-6">
                Please wait while we load your submissions.
              </p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="mx-auto text-gray-400 mb-4" size={64} />
              <h2 className="text-gray-900 mb-2">No Submissions Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't submitted any work yet. Browse competitions and start showcasing your talent!
              </p>
              <Link
                to="/competitions"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Competitions
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900">{submission.title}</h3>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Competition: <span className="text-gray-900">{submission.competitionName}</span>
                      </p>
                      {submission.description && (
                        <p className="text-gray-600 mb-2">{submission.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} />
                        <span>Submitted: {formatDate(submission.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FileText size={16} />
                      View Submission
                    </button>
                    
                    {submission.status === 'Submitted' && (
                      <>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}