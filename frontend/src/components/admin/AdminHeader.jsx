import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, X, LogOut, Settings, ChevronDown, Menu, MessageSquare } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useLiveFeedback } from '../../contexts/LiveFeedbackContext';

const AdminHeader = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { notifications, dismissNotification, clearAllNotifications, lastUpdated } = useLiveFeedback();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authAPI.logout();
      localStorage.removeItem('auth_token');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('auth_token');
      navigate('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-neutral-100 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-25 transition-colors"
          >
            <Menu className="w-6 h-6 text-brand-dark" />
          </button>
          <div>
            <p className="text-sm text-neutral-500">Welcome back,</p>
            <h2 className="text-lg font-semibold text-brand-dark">Administrator</h2>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Live Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 mr-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span>Live</span>
            {lastUpdated && (
              <span>· {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-500 hover:text-brand-dark hover:bg-neutral-25 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 animate-bounce" style={{ animationDuration: '1s', animationIterationCount: 3 }}>
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-100 z-50">
                <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                  <h3 className="font-semibold text-brand-dark">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-brand-primary hover:text-brand-dark transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-8 h-8 text-neutral-100 mx-auto mb-2" />
                      <p className="text-neutral-500 text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 p-4 hover:bg-neutral-25 border-b border-neutral-100 last:border-b-0 cursor-pointer transition-colors"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/admin/feedback');
                        }}
                      >
                        <div className="w-8 h-8 bg-brand-primary/15 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-brand-dark">{notification.message}</p>
                          <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          className="p-1 text-neutral-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-4 border-l border-neutral-100 hover:bg-neutral-25 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-brand-dark">Admin User</p>
                <p className="text-xs text-neutral-500">admin@Rivio.com</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-100 z-50">
                <div className="p-4 border-b border-neutral-100">
                  <p className="font-semibold text-brand-dark">Admin User</p>
                  <p className="text-sm text-neutral-500">admin@Rivio.com</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-500 hover:text-brand-dark hover:bg-neutral-25 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        Logout
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
