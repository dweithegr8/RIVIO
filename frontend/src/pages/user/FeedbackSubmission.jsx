import { useState, useEffect } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import FeedbackForm from '../../components/common/FeedbackForm';
import { feedbackAPI, settingsAPI } from '../../services/api';

const FeedbackSubmission = () => {
  const [allowAnonymousReviews, setAllowAnonymousReviews] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.getPublic();
        setAllowAnonymousReviews(res.data?.allowAnonymousReviews !== false);
      } catch {
        // keep default true
      }
    };
    fetchSettings();
  }, []);

  const handleFeedbackSubmit = async (data) => {
    const payload = {
      name: data.name || 'Anonymous',
      email: data.email || '',
      message: data.comment,
      rating: data.rating,
    };
    await feedbackAPI.submit(payload);
  };

  return (
    <div className="min-h-screen bg-neutral-25 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-6">
            <MessageSquarePlus className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Share Your Feedback
          </h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            We value your opinion! Your feedback helps us improve and helps others 
            make informed decisions. All reviews are moderated before being published.
          </p>
        </div>

        {/* Feedback Form */}
        <FeedbackForm onSubmit={handleFeedbackSubmit} allowAnonymousReviews={allowAnonymousReviews} />

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-neutral-100">
            <h3 className="font-semibold text-brand-dark mb-3">Review Guidelines</h3>
            <ul className="space-y-2 text-neutral-500 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold">•</span>
                Be honest and constructive in your feedback
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold">•</span>
                Focus on your actual experience
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold">•</span>
                Avoid using offensive or inappropriate language
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-primary font-bold">•</span>
                Reviews are moderated and may take up to 24 hours to appear
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSubmission;
