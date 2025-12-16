import React, { useState } from 'react';
import {
    Heart,
    Download,
    Globe,
    MapPin,
    FileText,
    Monitor,
    Trash2,
    Clock,
    LogOut,
    Settings,
    UserPlus
} from 'lucide-react';
import DocumentManager from './DocumentManager';

const ProfilePage = ({ onEditProfile, profile }) => {
    const [activeTab, setActiveTab] = useState('feed');

    if (!profile) return null;

    return (
        <div className="p-4 sm:p-8 flex flex-col lg:flex-row gap-8">
            {/* Left Section */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-900 inline-block mb-8 pb-1">
                    My Profile
                </h1>

                <div className="flex items-center gap-6 mb-12">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar} // Assuming helper or absolute URL
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-2xl">
                                    {profile.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-gray-800 text-white p-1.5 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                        <p className="text-sm text-gray-600 mb-1">{profile.email}</p>
                        <p className="text-xs text-gray-500 mb-3">{profile.designation || 'Employee'} • {profile.department || 'General'}</p>
                        <button
                            onClick={onEditProfile}
                            className="bg-[#266ECD] text-white px-6 py-1.5 rounded-md text-sm font-medium hover:bg-opacity-90 transition"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="space-y-8 max-w-md">
                    <div className="space-y-6">
                        <button
                            onClick={() => setActiveTab('feed')}
                            className={`flex items-center gap-6 w-full text-left group ${activeTab === 'feed' ? 'text-[#266ECD]' : 'text-gray-900'}`}
                        >
                            <Heart className={`w-6 h-6 ${activeTab === 'feed' ? 'text-[#266ECD]' : 'text-gray-900'}`} />
                            <span className="text-lg font-medium group-hover:text-[#266ECD] transition">Latest feed</span>
                        </button>
                        <button className="flex items-center gap-6 w-full text-left group">
                            <Download className="w-6 h-6 text-gray-900" />
                            <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Latest uploads</span>
                        </button>
                    </div>

                    <div className="border-t border-gray-300 pt-8 space-y-6">
                        <div className="flex items-center gap-6 w-full text-left group">
                            <Globe className="w-6 h-6 text-gray-900" />
                            <span className="text-lg font-medium text-gray-900">Languages</span>
                        </div>
                        <div className="flex items-center gap-6 w-full text-left group">
                            <MapPin className="w-6 h-6 text-gray-900" />
                            <span className="text-lg font-medium text-gray-900">{profile.address || 'Location not set'}</span>
                        </div>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`flex items-center gap-6 w-full text-left group ${activeTab === 'documents' ? 'text-[#266ECD]' : 'text-gray-900'}`}
                        >
                            <FileText className={`w-6 h-6 ${activeTab === 'documents' ? 'text-[#266ECD]' : 'text-gray-900'}`} />
                            <span className="text-lg font-medium group-hover:text-[#266ECD] transition">Files and documents</span>
                        </button>
                    </div>

                    <div className="border-t border-gray-300 pt-8 space-y-6">
                        <button className="flex items-center gap-6 w-full text-left group">
                            <LogOut className="w-6 h-6 text-gray-900 rotate-180" />
                            <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Exit</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Section - Content Area */}
            <div className="w-full lg:w-3/5">
                {activeTab === 'documents' ? (
                    <DocumentManager />
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4">About</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500">Skills</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map(skill => (
                                            <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{skill}</span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-800">No skills listed</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-800">{profile.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">DOB</p>
                                    <p className="text-sm text-gray-800">{profile.dob ? new Date(profile.dob).toLocaleDateString() : '-'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Emergency Contact</p>
                                <p className="text-sm text-gray-800">
                                    {profile.emergency_contact ?
                                        `${profile.emergency_contact.name} (${profile.emergency_contact.relation}): ${profile.emergency_contact.phone}`
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;