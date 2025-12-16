import { useState, useEffect } from 'react';

// Simple Modal Component for Employee Selection
const EmployeeSelectionModal = ({ isOpen, onClose, onSave }) => {
    const [candidates, setCandidates] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingCandidates, setLoadingCandidates] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCandidates();
        }
    }, [isOpen]);

    const fetchCandidates = async () => {
        setLoadingCandidates(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('http://localhost:3000/api/employee-of-month/candidates', { headers });
            if (response.ok) {
                const data = await response.json();
                setCandidates(data);
            }
        } catch (error) {
            console.error('Error fetching candidates', error);
        } finally {
            setLoadingCandidates(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // Hardcoding team members for now as per MVP plan, can represent current user or random
            // In real app, this would be another multi-select
            const dummyTeam = [
                { userId: candidates.find(c => c.id !== parseInt(selectedUserId))?.id || 1, role: 'Member' },
                { userId: candidates.find(c => c.id !== parseInt(selectedUserId))?.id || 2, role: 'Member' }
            ];

            const payload = {
                userId: selectedUserId,
                month: new Date().toISOString().slice(0, 10), // Today's date as month identifier
                description,
                teamMembers: dummyTeam
            };

            const response = await fetch('http://localhost:3000/api/employee-of-month', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onSave(); // Refresh parent data
                onClose();
            } else {
                alert('Failed to save');
            }
        } catch (error) {
            console.error('Error saving winner', error);
            alert('Error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Select Employee of the Month</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                        <select
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            disabled={loadingCandidates}
                        >
                            <option value="">Select an employee...</option>
                            {candidates.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Why are they the winner?"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedUserId}
                            className="px-4 py-2 bg-[#266ECD] text-white rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'Publishing...' : 'Publish Winner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FeedPage3 = ({ onNavigateBack }) => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEmployee = async () => {
        setLoading(true); // Show loading while refreshing
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('http://localhost:3000/api/employee-of-month/current', { headers });

            if (!response.ok) {
                if (response.status === 404) {
                    setEmployee(null);
                    // setLoading(false); // Handled in finally
                    return;
                }
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setEmployee(data);
            setError(null);
        } catch (err) {
            console.error(err);
            // setError('Could not load Employee of the Month'); 
            // Don't show error on refresh if possible, but for initial load it's fine
            if (!employee) setError('Could not load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, []);

    // Loading State
    if (loading && !employee) {
        // Only show full screen spinner if we don't have data yet
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <EmployeeSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchEmployee}
            />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onNavigateBack}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-[#266ECD]">Feed</h1>
                            <p className="text-sm text-gray-500 mt-1">Stay Connected and Informed</p>
                        </div>
                    </div>

                    {/* Admin Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Select Winner
                    </button>
                </div>

                {/* Empty State / No Winner */}
                {(error || !employee) ? (
                    <div className="text-center p-12 bg-white rounded-3xl shadow-md border-2 border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🏆</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-700">No Employee of the Month Yet</h2>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            The winner for this month hasn't been selected yet. Click the "Select Winner" button above to announce the champion!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Employee of the Month Card */}
                            <div className="bg-white rounded-3xl shadow-md p-8">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-sm font-bold text-gray-700 tracking-widest uppercase">
                                        Employee of the Month
                                    </h2>
                                </div>

                                {/* Featured Employee */}
                                <div className="text-center mb-8">
                                    <div className="inline-block mb-6">
                                        <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white border border-gray-200 p-1">
                                            <div className="w-full h-full rounded-3xl overflow-hidden">
                                                <img
                                                    src={`https://i.pravatar.cc/200?u=${employee.user_id}`}
                                                    alt={employee.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{employee.name}</h3>
                                    <p className="text-sm text-gray-500">{employee.email}</p>
                                </div>

                                {/* Description */}
                                <div className="max-w-2xl mx-auto mb-8">
                                    <p className="text-gray-700 text-center leading-relaxed">
                                        {employee.description}
                                    </p>
                                </div>
                            </div>

                            {/* Team Section */}
                            {employee.team && employee.team.length > 0 && (
                                <div className="bg-white rounded-3xl shadow-md p-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6">Team</h3>

                                    <div className="grid grid-cols-3 gap-6">
                                        {employee.team.map((member) => (
                                            <div key={member.id} className="text-center">
                                                <div className="mb-4">
                                                    <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden bg-white border border-gray-200 p-1">
                                                        <div className="w-full h-full rounded-3xl overflow-hidden">
                                                            <img
                                                                src={`https://i.pravatar.cc/150?u=${member.user_id}`}
                                                                alt={member.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">{member.name}</h4>
                                                <p className="text-gray-500 text-xs">{member.role}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar - Same as FeedPage2 */}
                        <div className="space-y-6">
                            {/* New Point Alert */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <h3 className="text-lg font-bold text-[#266ECD] mb-4">New Point Alert!</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-5xl font-bold text-[#266ECD]">250</div>
                                    <div className="w-10 h-10 rounded-full bg-[#266ECD] flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Reward points with Manager</p>
                                <button className="w-full bg-[#266ECD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                                    Attempt
                                </button>
                            </div>

                            {/* Don't Miss Out! Training Session */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <h3 className="text-lg font-bold text-[#266ECD] mb-4">Don't Miss Out! Upcoming Training Session</h3>
                                <div className="space-y-2 mb-5">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Date:</span> 29 Oct
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Time:</span> 9:00 AM - 12:00 PM
                                    </p>
                                </div>
                                <button className="w-full bg-[#266ECD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                                    Register
                                </button>
                            </div>

                            {/* Upcoming Events */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        Upcoming Events
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Team Building Workshop</p>
                                            <p className="text-xs text-gray-500">10:00 AM - 1:00 PM</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">13 Oct</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Employee of the Month Award</p>
                                            <p className="text-xs text-gray-500">4:00 PM - 4:30 PM</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">20 Oct</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Diversity and Inclusion Seminar</p>
                                            <p className="text-xs text-gray-500">9:30 AM - 12:30 PM</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">5 Nov</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Town Hall Meeting</p>
                                            <p className="text-xs text-gray-500">2:00 PM - 3:30 PM</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">10 Nov</span>
                                    </div>
                                    <button className="text-[#266ECD] text-sm font-semibold hover:underline">More...</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedPage3;