import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';

const EditProfilePage = ({ onCancel, onSave, profile }) => {
    const [formData, setFormData] = useState({
        name: profile?.fullname || profile?.name || '',
        designation: profile?.designation || '',
        department: profile?.department || '',
        dob: profile?.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        skills: profile?.skills ? (Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills) : '',
        emergency_contact_name: profile?.emergency_contact?.name || '',
        emergency_contact_phone: profile?.emergency_contact?.phone || '',
        emergency_contact_relation: profile?.emergency_contact?.relation || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            const dataToSend = {
                fullname: formData.name,
                designation: formData.designation,
                department: formData.department,
                phone: formData.phone
                // Other fields are ignored by backend for now but kept in state
            };

            const userId = profile?.id || JSON.parse(localStorage.getItem('user'))?.id;

            await axios.put(`http://localhost:3000/api/users/${userId}`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update localStorage if it's the current user
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.id === userId) {
                const updatedUser = { ...storedUser, ...dataToSend };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            onSave(dataToSend);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    if (!profile) return null;

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-900 inline-block mb-12 pb-1">Edit Profile</h1>

            <div className="flex flex-col items-center mb-12">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                        {profile.avatar || profile.profile_picture ? (
                            <img
                                src={profile.avatar || profile.profile_picture}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-4xl">
                                {(formData.name || '').charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{formData.name}</h2>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#266ECD] focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Email (Read Only)</label>
                        <input
                            type="email"
                            value={profile.email}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-500 bg-gray-50 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Skills (comma separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none"
                        placeholder="Java, Python, React..."
                    />
                </div>

                <div className="border-t pt-4">
                    <h4 className="text-sm font-bold mb-3">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="emergency_contact_name"
                            value={formData.emergency_contact_name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            type="text"
                            name="emergency_contact_relation"
                            value={formData.emergency_contact_relation}
                            onChange={handleChange}
                            placeholder="Relation"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            type="tel"
                            name="emergency_contact_phone"
                            value={formData.emergency_contact_phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={onCancel}
                        className="px-8 py-2.5 rounded-full bg-gray-400 text-white font-bold hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 rounded-full bg-[#0066FF] text-white font-bold hover:bg-blue-600 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;