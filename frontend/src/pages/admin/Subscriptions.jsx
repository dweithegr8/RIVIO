import { useState, useEffect } from 'react';
import { CreditCard, Calendar, User, Search, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { paymentAPI } from '../../services/api';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await paymentAPI.getSubscriptions();
            if (response.data.success) {
                setSubscriptions(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch subscriptions');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching subscriptions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const filteredSubscriptions = subscriptions.filter(sub => 
        (sub.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.plan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.last_four || '').includes(searchTerm)
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark">Subscription Management</h1>
                    <p className="text-neutral-500">View and manage all plan purchases</p>
                </div>
                <button 
                    onClick={fetchSubscriptions}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-100 rounded-lg text-neutral-600 hover:bg-neutral-25 transition-colors"
                >
                    <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center p-6">
                    <p className="text-sm text-neutral-500 font-medium mb-1">Total Purchases</p>
                    <p className="text-3xl font-bold text-brand-dark">{subscriptions.length}</p>
                </div>
                <div className="card text-center p-6">
                    <p className="text-sm text-neutral-500 font-medium mb-1">Monthly Plans</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {subscriptions.filter(s => s.plan === 'monthly').length}
                    </p>
                </div>
                <div className="card text-center p-6">
                    <p className="text-sm text-neutral-500 font-medium mb-1">Yearly Plans</p>
                    <p className="text-3xl font-bold text-brand-primary">
                        {subscriptions.filter(s => s.plan === 'yearly').length}
                    </p>
                </div>
            </div>

            {/* Content Card */}
            <div className="card">
                <div className="p-4 border-b border-neutral-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Filter by name, plan or card..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
                            <p className="text-neutral-500">Loading subscriptions...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold text-brand-dark mb-2">Failed to load subscriptions</h3>
                            <p className="text-neutral-500 max-w-md mb-6">{error}</p>
                            <button 
                                onClick={fetchSubscriptions}
                                className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:shadow-lg transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredSubscriptions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                            <CreditCard className="w-12 h-12 text-neutral-200 mb-4" />
                            <h3 className="text-lg font-semibold text-brand-dark mb-1">No subscriptions found</h3>
                            <p className="text-neutral-500">Try adjusting your search filters.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-neutral-25 text-neutral-500 text-sm font-medium">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Card Detail</th>
                                    <th className="px-6 py-4">Purchase Date</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filteredSubscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-neutral-25/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                                    {sub.name ? sub.name.charAt(0) : <User className="w-4 h-4" />}
                                                </div>
                                                <span className="font-semibold text-brand-dark">{sub.name || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                sub.plan === 'yearly' 
                                                ? 'bg-orange-100 text-orange-600' 
                                                : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {sub.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-neutral-600">
                                                <CreditCard className="w-4 h-4 text-neutral-400" />
                                                <span className="text-sm font-mono italic">•••• {sub.last_four}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-neutral-400" />
                                                {formatDate(sub.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold ring-1 ring-inset ring-green-600/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                                                Active
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
