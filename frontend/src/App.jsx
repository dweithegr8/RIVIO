import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Common Components
import ErrorBoundary from './components/common/ErrorBoundary';

// User Portal Pages
import Home from './pages/user/Home';
import HowItWorks from './pages/user/HowItWorks';
import FeedbackSubmission from './pages/user/FeedbackSubmission';
import PublicReviews from './pages/user/PublicReviews';
import PrivacyPolicy from './pages/user/PrivacyPolicy';
import TermsOfService from './pages/user/TermsOfService';

// Admin Portal Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import Subscriptions from './pages/admin/Subscriptions';
import Settings from './pages/admin/Settings';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* User Portal Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="submit-feedback" element={<FeedbackSubmission />} />
            <Route path="reviews" element={<PublicReviews />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="feedback" element={<FeedbackManagement />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
