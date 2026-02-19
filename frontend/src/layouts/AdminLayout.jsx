import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { LiveFeedbackProvider, useLiveFeedback } from '../contexts/LiveFeedbackContext';
import { Bell } from 'lucide-react';

// Toast component rendered at the layout level
const GlobalToast = () => {
  const { toast } = useLiveFeedback();

  if (!toast) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="flex items-center gap-3 bg-brand-dark text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/10">
        <div className="w-9 h-9 bg-brand-primary/30 rounded-full flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-brand-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">{toast.message}</p>
          <p className="text-xs text-white/60">Just now</p>
        </div>
        {toast.count && (
          <div className="ml-2 w-7 h-7 bg-brand-primary rounded-full flex items-center justify-center text-xs font-bold">
            {toast.count}
          </div>
        )}
      </div>
    </div>
  );
};

// Inner layout that can access the context
const AdminLayoutInner = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-neutral-25">
      <GlobalToast />
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={toggleSidebar} />
        <main className="flex-grow p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // DEV BYPASS: Skip auth check for development
    // const token = localStorage.getItem('auth_token');
    // setIsAuthenticated(!!token);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <LiveFeedbackProvider>
      <AdminLayoutInner />
    </LiveFeedbackProvider>
  );
};

export default AdminLayout;
