import { Star, MessageSquare, Clock, CheckCircle, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { useLiveFeedback } from '../../contexts/LiveFeedbackContext';

const Dashboard = () => {
  const { stats, feedbackList, newFeedbackIds, isLoading } = useLiveFeedback();

  // Get recent 5 reviews
  const recentReviews = [...feedbackList]
    .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
    .slice(0, 5);

  const weeklyTrend = (stats.lastWeekFeedback || 0) > 0
    ? (((stats.thisWeekFeedback || 0) - (stats.lastWeekFeedback || 0)) / (stats.lastWeekFeedback || 1) * 100).toFixed(1)
    : '0.0';
  const isTrendPositive = parseFloat(weeklyTrend) >= 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-neutral-500">Welcome back! Here's an overview of your feedback system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Feedback */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Feedback</p>
              <p className="text-3xl font-bold text-brand-dark mt-1">
                {(stats.totalFeedback || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-dark/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-brand-dark" />
            </div>
          </div>
          <div className={`flex items-center gap-1 mt-3 text-sm ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isTrendPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(parseFloat(weeklyTrend))}% from last week</span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold text-brand-primary mt-1">
                {stats.pendingReviews || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-brand-primary" />
            </div>
          </div>
          <p className="text-sm text-neutral-500 mt-3">
            Awaiting moderation
          </p>
        </div>

        {/* Approved Reviews */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Approved Reviews</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {(stats.approvedReviews || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-neutral-500 mt-3">
            Published publicly
          </p>
        </div>

        {/* Average Rating */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-brand-dark mt-1">
                {(stats.avgRating || 0).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-brand-primary fill-brand-primary" />
            </div>
          </div>
          <div className="mt-3">
            <StarRating rating={Math.round(stats.avgRating || 0)} readonly size="sm" />
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-brand-dark">Recent Reviews</h2>
          <a
            href="/admin/feedback"
            className="text-sm text-brand-primary hover:text-brand-dark transition-colors"
          >
            View all →
          </a>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
          </div>
        ) : recentReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-neutral-100 mx-auto mb-3" />
            <p className="text-neutral-500">No feedback received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-700 ${newFeedbackIds.has(review.id)
                    ? 'bg-green-50 ring-2 ring-green-400/50 animate-highlight-fade'
                    : 'bg-neutral-25'
                  }`}
              >
                <div className="w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary font-semibold">
                    {review.name ? review.name.charAt(0) : 'A'}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-brand-dark">{review.name || 'Anonymous'}</h4>
                    {newFeedbackIds.has(review.id) && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500 text-white animate-pulse">
                        NEW
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${review.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <StarRating rating={review.rating} readonly size="sm" />
                  <p className="text-neutral-500 text-sm mt-2 truncate">{review.comment || review.message}</p>
                </div>
                <span className="text-xs text-neutral-500 flex-shrink-0">
                  {new Date(review.date || review.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
