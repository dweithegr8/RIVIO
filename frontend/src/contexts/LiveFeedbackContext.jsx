import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { feedbackAPI } from '../services/api';

const LiveFeedbackContext = createContext(null);

const POLL_INTERVAL = 5000; // 5 seconds

export const LiveFeedbackProvider = ({ children }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [stats, setStats] = useState({
        totalFeedback: 0,
        pendingReviews: 0,
        approvedReviews: 0,
        avgRating: 0,
        thisWeekFeedback: 0,
        lastWeekFeedback: 0,
    });
    const [newFeedbackIds, setNewFeedbackIds] = useState(new Set());
    const [notifications, setNotifications] = useState([]);
    const [toast, setToast] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const knownIds = useRef(new Set());
    const notificationIdCounter = useRef(0);

    // Show toast notification
    const showToast = useCallback((message, count) => {
        setToast({ message, count });
        setTimeout(() => setToast(null), 4000);
    }, []);

    // Dismiss a notification
    const dismissNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    // Clear all notifications
    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Central polling function
    const fetchData = useCallback(async () => {
        if (isFirstLoad) {
            setIsLoading(true);
        }
        try {
            const [statsResponse, feedbackResponse] = await Promise.all([
                feedbackAPI.getStats(),
                feedbackAPI.getAll(),
            ]);

            const newStats = statsResponse.data;
            const feedbackData = feedbackResponse.data?.data ?? feedbackResponse.data ?? [];

            // Detect new feedback
            if (knownIds.current.size > 0) {
                const currentIds = new Set(feedbackData.map((r) => r.id));
                const newIds = [...currentIds].filter((id) => !knownIds.current.has(id));

                if (newIds.length > 0) {
                    // Set highlight IDs
                    setNewFeedbackIds(new Set(newIds));
                    setTimeout(() => setNewFeedbackIds(new Set()), 6000);

                    // Show toast
                    showToast(
                        newIds.length === 1 ? 'New feedback received!' : `${newIds.length} new feedbacks received!`,
                        newIds.length
                    );

                    // Add to notification bell
                    const newNotifications = newIds.map((id) => {
                        const feedback = feedbackData.find((f) => f.id === id);
                        notificationIdCounter.current += 1;
                        return {
                            id: notificationIdCounter.current,
                            feedbackId: id,
                            message: `New review from ${feedback?.name || 'Anonymous'} (${feedback?.rating || '?'}★)`,
                            time: 'Just now',
                            createdAt: new Date(),
                        };
                    });
                    setNotifications((prev) => [...newNotifications, ...prev].slice(0, 20));
                }
            }

            // Update known IDs
            knownIds.current = new Set(feedbackData.map((r) => r.id));

            setStats(newStats);
            setFeedbackList(feedbackData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Live feedback poll failed:', error);
        } finally {
            setIsLoading(false);
            setIsFirstLoad(false);
        }
    }, [isFirstLoad, showToast]);

    // Poll on mount + interval
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchData]);

    // Update notification times every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications((prev) =>
                prev.map((n) => {
                    const seconds = Math.floor((Date.now() - n.createdAt.getTime()) / 1000);
                    let time;
                    if (seconds < 60) time = 'Just now';
                    else if (seconds < 3600) time = `${Math.floor(seconds / 60)}m ago`;
                    else time = `${Math.floor(seconds / 3600)}h ago`;
                    return { ...n, time };
                })
            );
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const value = {
        feedbackList,
        setFeedbackList,
        stats,
        newFeedbackIds,
        notifications,
        toast,
        lastUpdated,
        isLoading,
        isFirstLoad,
        dismissNotification,
        clearAllNotifications,
        refreshData: fetchData,
    };

    return (
        <LiveFeedbackContext.Provider value={value}>
            {children}
        </LiveFeedbackContext.Provider>
    );
};

export const useLiveFeedback = () => {
    const context = useContext(LiveFeedbackContext);
    if (!context) {
        throw new Error('useLiveFeedback must be used within a LiveFeedbackProvider');
    }
    return context;
};

export default LiveFeedbackContext;
