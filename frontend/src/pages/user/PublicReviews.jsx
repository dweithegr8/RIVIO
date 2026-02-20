import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Filter, ArrowUpDown, Calendar, Star, Search, Loader2, MessageSquare, Lock, ShieldCheck, Eye, X, CreditCard, Check, Sparkles } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { feedbackAPI, settingsAPI, paymentAPI } from '../../services/api';

const POLL_INTERVAL = 5000;
const FREE_REVIEW_LIMIT = 2;

const PublicReviews = () => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRating, setFilterRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    enablePublicReviews: true,
    showRatingsBreakdown: true,
    minimumRatingToShow: 1,
  });

  const [reviews, setReviews] = useState([]);
  const isFirstLoad = useRef(true);

  // Subscription state (persisted in localStorage)
  const [hasSubscription, setHasSubscription] = useState(() => {
    return localStorage.getItem('repufeed_subscribed') === 'true';
  });

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardError, setCardError] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  // Luhn algorithm to validate card number
  const isValidCardNumber = (number) => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  // Check if expiry is valid and in the future
  const isValidExpiry = (expiry) => {
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0], 10);
    const year = parseInt('20' + parts[1], 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const expiryDate = new Date(year, month);
    return expiryDate > now;
  };



  const handlePaymentInput = (field, value) => {
    if (field === 'cardNumber') value = formatCardNumber(value);
    if (field === 'expiry') value = formatExpiry(value);
    if (field === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
    setCardError(''); // Clear error on input change
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setCardError('');

    // Validate cardholder name
    if (paymentForm.name.trim().length < 2) {
      setCardError('Please enter a valid cardholder name.');
      return;
    }

    // Validate card number with Luhn
    if (!isValidCardNumber(paymentForm.cardNumber)) {
      setCardError('Invalid card number. Please check and try again.');
      return;
    }

    // Validate expiry
    if (!isValidExpiry(paymentForm.expiry)) {
      setCardError('Invalid or expired card. Please check the expiry date.');
      return;
    }

    // Validate CVC
    if (paymentForm.cvc.length < 3) {
      setCardError('CVC must be at least 3 digits.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await paymentAPI.subscribe({
        card_number: paymentForm.cardNumber,
        plan: selectedPlan,
        name: paymentForm.name,
        expiry: paymentForm.expiry,
        cvc: paymentForm.cvc,
      });

      if (response.data.success) {
        setPaymentSuccess(true);
        setHasSubscription(true);
        localStorage.setItem('repufeed_subscribed', 'true');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Payment failed. Please try again.';
      setCardError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setCardError('');
    setPaymentForm({ cardNumber: '', expiry: '', cvc: '', name: '' });
  };

  const plans = [
    { id: 'monthly', label: 'Monthly', price: '₱299', period: '/month', savings: null },
    { id: 'yearly', label: 'Yearly', price: '₱2,499', period: '/year', savings: 'Save 30%' },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.getPublic();
        setSettings((prev) => ({ ...prev, ...res.data }));
      } catch {
        // keep defaults
      }
    };
    fetchSettings();
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!settings.enablePublicReviews) {
      setReviews([]);
      setIsLoading(false);
      return;
    }
    if (isFirstLoad.current) {
      setIsLoading(true);
    }
    try {
      const response = await feedbackAPI.getApproved();
      setReviews(response.data?.data ?? response.data ?? []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      if (isFirstLoad.current) {
        setReviews([]);
      }
    } finally {
      setIsLoading(false);
      isFirstLoad.current = false;
    }
  }, [settings.enablePublicReviews]);

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchReviews]);

  const minimumRating = settings.minimumRatingToShow ?? 1;

  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    result = result.filter((review) => review.rating >= minimumRating);
    if (filterRating > 0) {
      result = result.filter((review) => review.rating === filterRating);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const text = (r) => (r.message || r.comment || '').toLowerCase();
      result = result.filter(
        (review) =>
          (review.name || '').toLowerCase().includes(query) ||
          text(review).includes(query)
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.created_at || a.date);
        const dateB = new Date(b.created_at || b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      }
    });
    return result;
  }, [reviews, sortBy, sortOrder, filterRating, searchQuery, minimumRating]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const reviewsAboveMin = reviews.filter((r) => r.rating >= minimumRating);
  const avgRating = reviewsAboveMin.length > 0
    ? (reviewsAboveMin.reduce((sum, r) => sum + r.rating, 0) / reviewsAboveMin.length).toFixed(1)
    : '0.0';
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsAboveMin.filter((r) => r.rating === star).length,
    percentage: reviewsAboveMin.length > 0
      ? (reviewsAboveMin.filter((r) => r.rating === star).length / reviewsAboveMin.length) * 100
      : 0,
  }));

  const showRatingsBreakdown = settings.showRatingsBreakdown !== false;

  // Split reviews into free and blurred
  const freeReviews = hasSubscription ? filteredReviews : filteredReviews.slice(0, FREE_REVIEW_LIMIT);
  const blurredReviews = hasSubscription ? [] : filteredReviews.slice(FREE_REVIEW_LIMIT);

  // Review card component
  const ReviewCard = ({ review, isBlurred = false }) => (
    <div className={`card relative ${isBlurred ? 'select-none pointer-events-none' : ''}`}>
      <div className={isBlurred ? 'blur-[6px]' : ''}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
              <span className="text-brand-primary font-semibold text-lg">
                {review.name ? review.name.charAt(0) : 'A'}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-brand-dark">{review.name || 'Anonymous'}</h4>
              <StarRating rating={review.rating || 0} readonly size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <Calendar className="w-4 h-4" />
            {review.created_at || review.date
              ? new Date(review.created_at || review.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
              : 'N/A'}
          </div>
        </div>
        <p className="text-neutral-950 leading-relaxed">
          "{review.message || review.comment || 'No comment'}"
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-25 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Customer Reviews
          </h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Read what our customers have to say about their experiences
          </p>
        </div>

        {!settings.enablePublicReviews ? (
          <div className="card text-center py-16">
            <MessageSquare className="w-16 h-16 text-neutral-100 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-dark mb-2">Reviews Not Displayed</h3>
            <p className="text-neutral-500">Public reviews are currently disabled by the administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Stats & Filters */}
            {showRatingsBreakdown && (
              <div className="lg:col-span-1 space-y-6">
                <div className="card">
                  <h3 className="font-semibold text-brand-dark mb-4">Rating Summary</h3>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-brand-dark">{avgRating}</div>
                    <StarRating rating={Math.round(parseFloat(avgRating))} readonly size="md" />
                    <p className="text-neutral-500 text-sm mt-1">
                      Based on {reviewsAboveMin.length} reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    {ratingCounts.map(({ star, count, percentage }) => (
                      <button
                        key={star}
                        onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${filterRating === star
                          ? 'bg-brand-primary/10'
                          : 'hover:bg-neutral-100/50'
                          }`}
                      >
                        <span className="text-sm text-neutral-500 w-8">{star}★</span>
                        <div className="flex-grow h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-neutral-500 w-8">{count}</span>
                      </button>
                    ))}
                  </div>

                  {filterRating > 0 && (
                    <button
                      onClick={() => setFilterRating(0)}
                      className="w-full mt-4 text-sm text-brand-primary hover:text-brand-dark transition-colors"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Main Content - Reviews List */}
            <div className={showRatingsBreakdown ? 'lg:col-span-3 space-y-6' : 'lg:col-span-4 space-y-6'}>
              {isLoading ? (
                <div className="card flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="card text-center py-16">
                  <MessageSquare className="w-16 h-16 text-neutral-100 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-brand-dark mb-2">No Reviews Yet</h3>
                  <p className="text-neutral-500">Be the first to share your experience!</p>
                </div>
              ) : (
                <>
                  {/* Controls */}
                  <div className="card">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="Search reviews..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-neutral-500" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white"
                        >
                          <option value="date">Sort by Date</option>
                          <option value="rating">Sort by Rating</option>
                        </select>
                        <button
                          onClick={toggleSortOrder}
                          className="p-2 border border-neutral-100 rounded-lg hover:bg-neutral-100 transition-colors"
                          title={`Order: ${sortOrder === 'desc' ? 'Descending' : 'Ascending'}`}
                        >
                          <ArrowUpDown className="w-5 h-5 text-neutral-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  {filteredReviews.length === 0 ? (
                    <div className="card text-center py-12">
                      <p className="text-neutral-500 text-lg">No reviews found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Free (visible) reviews */}
                      {freeReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}

                      {/* Blurred reviews with paywall overlay */}
                      {blurredReviews.length > 0 && (
                        <div className="relative">
                          {/* Blurred review cards */}
                          <div className="space-y-4">
                            {blurredReviews.map((review) => (
                              <ReviewCard key={review.id} review={review} isBlurred />
                            ))}
                          </div>

                          {/* Gradient fade from clear to blurred */}
                          <div className="absolute inset-0 bg-gradient-to-b from-neutral-25/0 via-neutral-25/60 to-neutral-25/95 pointer-events-none" />

                          {/* Paywall overlay CTA */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="pointer-events-auto w-full max-w-lg mx-4">
                              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-100/80 p-8 text-center">
                                {/* Lock icon */}
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-primary/25">
                                  <Lock className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-brand-dark mb-2">
                                  Unlock All Reviews
                                </h3>
                                <p className="text-neutral-500 mb-6 leading-relaxed">
                                  Subscribe to access all <span className="font-semibold text-brand-dark">{filteredReviews.length} customer reviews</span> and gain full insights into what people are saying.
                                </p>

                                {/* Features */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 text-sm">
                                  <div className="flex items-center gap-2 text-neutral-500">
                                    <Eye className="w-4 h-4 text-brand-primary" />
                                    <span>Full review access</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-neutral-500">
                                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                                    <span>Verified reviews</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-neutral-500">
                                    <Star className="w-4 h-4 text-brand-primary" />
                                    <span>Ratings analytics</span>
                                  </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                  onClick={() => setShowPaymentModal(true)}
                                  className="w-full sm:w-auto bg-gradient-to-r from-brand-primary to-orange-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                  Subscribe Now
                                </button>

                                <p className="text-xs text-neutral-400 mt-4">
                                  Cancel anytime · Instant access
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Results count */}
                  {!isLoading && reviews.length > 0 && (
                    <p className="text-center text-neutral-500 text-sm">
                      Showing {hasSubscription ? filteredReviews.length : Math.min(FREE_REVIEW_LIMIT, filteredReviews.length)} of {reviewsAboveMin.length} reviews
                      {minimumRating > 1 && ` (rating ${minimumRating}+ only)`}
                      {!hasSubscription && filteredReviews.length > FREE_REVIEW_LIMIT && (
                        <span className="text-brand-primary font-medium"> · Subscribe to see all</span>
                      )}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            onClick={() => !isProcessing && setShowPaymentModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in">
            {paymentSuccess ? (
              /* ===== SUCCESS SCREEN ===== */
              <div className="p-8 text-center">
                {/* Animated checkmark */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  {/* Sparkle decorations */}
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                  <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-brand-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <Star className="absolute top-0 -left-4 w-4 h-4 text-yellow-400 animate-pulse" />
                </div>

                <h3 className="text-2xl font-bold text-brand-dark mb-2">🎉 Congratulations!</h3>
                <p className="text-lg text-neutral-500 mb-1">
                  Your subscription is now <span className="font-semibold text-green-600">active</span>!
                </p>
                <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
                  Thank you for subscribing to RepuFeed. You now have full access
                  to all customer reviews, ratings analytics, and premium insights.
                </p>

                {/* Plan summary */}
                <div className="bg-neutral-25 rounded-xl p-4 mb-6 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Plan</span>
                    <span className="font-semibold text-brand-dark">
                      {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-neutral-500">Amount</span>
                    <span className="font-semibold text-brand-dark">
                      {selectedPlan === 'monthly' ? '₱299/month' : '₱2,499/year'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCloseSuccess}
                  className="w-full bg-gradient-to-r from-brand-primary to-orange-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Start Reading Reviews
                </button>

                <p className="text-xs text-neutral-400 mt-4">
                  A receipt has been sent to your email
                </p>
              </div>
            ) : (
              /* ===== PAYMENT FORM ===== */
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-dark to-brand-dark/90 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Subscribe to RepuFeed</h3>
                        <p className="text-sm text-white/60">Unlock all reviews & insights</p>
                      </div>
                    </div>
                    <button
                      onClick={() => !isProcessing && setShowPaymentModal(false)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Plan Selection */}
                  <div>
                    <label className="text-sm font-semibold text-brand-dark mb-2 block">Choose your plan</label>
                    <div className="grid grid-cols-2 gap-3">
                      {plans.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.id
                            ? 'border-brand-primary bg-brand-primary/5'
                            : 'border-neutral-100 hover:border-neutral-300'
                            }`}
                        >
                          {plan.savings && (
                            <span className="absolute -top-2.5 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {plan.savings}
                            </span>
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-brand-primary' : 'border-neutral-300'
                              }`}>
                              {selectedPlan === plan.id && (
                                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                              )}
                            </div>
                            <span className="font-semibold text-brand-dark">{plan.label}</span>
                          </div>
                          <div className="ml-6">
                            <span className="text-xl font-bold text-brand-dark">{plan.price}</span>
                            <span className="text-sm text-neutral-500">{plan.period}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Form */}
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-brand-dark mb-1.5 block">Cardholder name</label>
                      <input
                        type="text"
                        placeholder="Juan Dela Cruz"
                        required
                        value={paymentForm.name}
                        onChange={(e) => handlePaymentInput('name', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-brand-dark mb-1.5 block">Card number</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          required
                          value={paymentForm.cardNumber}
                          onChange={(e) => handlePaymentInput('cardNumber', e.target.value)}
                          className="w-full pl-4 pr-12 py-3 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                        />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-brand-dark mb-1.5 block">Expiry date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          required
                          value={paymentForm.expiry}
                          onChange={(e) => handlePaymentInput('expiry', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-brand-dark mb-1.5 block">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          required
                          value={paymentForm.cvc}
                          onChange={(e) => handlePaymentInput('cvc', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Validation Error */}
                    {cardError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{cardError}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-brand-primary to-orange-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay {selectedPlan === 'monthly' ? '₱299' : '₱2,499'} — Subscribe Now
                        </>
                      )}
                    </button>
                  </form>

                  {/* Security badges */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>SSL Encrypted</span>
                    </div>
                    <span>·</span>
                    <span>Cancel anytime</span>
                    <span>·</span>
                    <span>Instant access</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicReviews;
