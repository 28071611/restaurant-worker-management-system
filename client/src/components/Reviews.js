import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Star,
    MessageSquare,
    Send,
    User,
    AlertCircle,
    ThumbsUp
} from 'lucide-react';

const Reviews = () => {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [formData, setFormData] = useState({
        workerId: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
        fetchWorkers();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('/api/reviews');
            setReviews(response.data.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkers = async () => {
        try {
            const response = await axios.get('/api/workers');
            setWorkers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch workers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.comment) return;

        try {
            setPosting(true);
            await axios.post('/api/reviews', formData);
            setFormData({ workerId: '', rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            console.error('Failed to post review:', error);
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black text-gray-900 tracking-tight">Customer Feedbacks</h1>
                <p className="text-gray-500 max-w-2xl mx-auto italic text-lg">
                    We value your experience and strive for excellence. Share your thoughts about our service and staff.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Review Form - Only for Customers */}
                <div className="lg:col-span-1">
                    {isAuthenticated && user?.role === 'customer' ? (
                        <div className="sticky top-24 backdrop-blur-xl bg-neutral-900 p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-amber-500" />
                                Submit a Review
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tag a Worker (Optional)</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        value={formData.workerId}
                                        onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                                    >
                                        <option value="" className="bg-neutral-800">General Restaurant Review</option>
                                        {workers.map(w => (
                                            <option key={w._id} value={w._id} className="bg-neutral-800">{w.name} ({w.role})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: num })}
                                                className={`p-2 rounded-lg transition-all ${formData.rating >= num ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-500'
                                                    }`}
                                            >
                                                <Star className={`h-6 w-6 ${formData.rating >= num ? 'fill-current' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Comment</label>
                                    <textarea
                                        rows="4"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        placeholder="Tell us about your experience..."
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={posting || !formData.comment}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {posting ? 'Sending...' : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Submit Review
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="sticky top-24 bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                            <p className="text-white font-bold">Want to leave a review?</p>
                            <p className="text-gray-400 text-sm mt-2">Only registered customers can submit feedback.</p>
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
                            >
                                Sign In
                            </button>
                        </div>
                    )}
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Reviews ({reviews.length})</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No reviews yet. Be the first to share!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xl">
                                            {review.customer?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 uppercase tracking-tighter">{review.customer?.name}</h4>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>

                                {review.worker && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 text-white rounded-lg text-[10px] font-black tracking-widest uppercase mb-4">
                                        <User className="h-3 w-3 text-amber-500" />
                                        Staff: {review.worker.name} ({review.worker.role})
                                    </div>
                                )}

                                <p className="text-gray-700 leading-relaxed italic">
                                    "{review.comment}"
                                </p>

                                <div className="mt-6 flex items-center gap-4 text-gray-400">
                                    <button className="flex items-center gap-1.5 text-xs hover:text-amber-600 transition-colors">
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                        Helpful
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
