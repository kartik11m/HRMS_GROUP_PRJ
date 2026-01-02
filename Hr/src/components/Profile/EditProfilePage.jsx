import React, { useState } from 'react';

<<<<<<< HEAD
import axios from 'axios';
=======
import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Camera, Trash2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920

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

<<<<<<< HEAD
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
=======
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [designation, setDesignation] = useState('');
    const [gender, setGender] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fullname = storedUser?.fullname || '';
        const parts = fullname.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setEmail(storedUser?.email || '');
        setDesignation(storedUser?.designation || '');
        setGender(storedUser?.gender || '');
        // Use profile_picture if available, otherwise null
        setPreviewUrl(storedUser?.profile_picture || null);
    }, [storedUser]);

    // ensure inputs are focusable
    const firstNameRef = useRef(null);
    useEffect(() => {
        if (firstNameRef.current) {
            firstNameRef.current.focus();
        }
        const onStorage = (e) => {
            if (e.key === 'user') {
                try { setStoredUser(JSON.parse(e.newValue)); } catch { setStoredUser(null); }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setIsRemovingPhoto(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null); // Clear preview to show default icon
        setIsRemovingPhoto(true);
        // Clear file input so same file can be selected again if user changes mind immediately
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccess("");
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to update your profile.');
            setSaving(false);
            return;
        }
        const id = storedUser?.id;
        const fullname = `${firstName} ${lastName} `.trim();

        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('email', email);
        formData.append('designation', designation);
        formData.append('gender', gender || 'Not Specified');

        if (isRemovingPhoto) {
            formData.append('profile_picture', ""); // Send empty string to remove it
        } else if (selectedFile) {
            formData.append('profile_picture', selectedFile);
        }
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920

    const handleSubmit = async () => {
        try {
<<<<<<< HEAD
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
=======
            // Note: When using FormData, do NOT set Content-Type header manually, let browser set it with boundary
            const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
            });

            // Update localStorage if it's the current user
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.id === userId) {
                const updatedUser = { ...storedUser, ...dataToSend };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

<<<<<<< HEAD
            onSave(dataToSend);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
=======
            // update localStorage and navigate back to profile
            // Ensure we merge existing user data with updates to keep other fields valid
            const newUser = { ...storedUser, ...data.user };
            localStorage.setItem('user', JSON.stringify(newUser));

            // Dispatch event so Sidebar updates immediately
            window.dispatchEvent(new Event("user-updated"));

            if (onSave) onSave(newUser);
            setSuccess('Profile updated successfully');

            // reflect change immediately
            setTimeout(() => window.location.href = '/profile', 800);
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
        }
    };

    if (!profile) return null;

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-900 inline-block mb-12 pb-1">Edit Profile</h1>

            <div className="flex flex-col items-center mb-12">
<<<<<<< HEAD
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
=======
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg relative flex items-center justify-center">
                        {previewUrl ? (
                            <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-gray-400" />
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
                        )}
                    </div>

                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-8 h-8" />
                    </div>

                    <div className="absolute bottom-0 right-0 bg-[#266ECD] p-2 rounded-full border-2 border-white text-white z-10">
                        <Pencil size={16} />
                    </div>

                    {/* Delete Button */}
                    <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-0 right-0 bg-red-500 p-2 rounded-full border-2 border-white text-white hover:bg-red-600 transition z-20"
                        title="Remove photo"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
<<<<<<< HEAD
                <h2 className="text-xl font-bold text-gray-900 mt-4">{formData.name}</h2>
=======
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />

                <h2 className="text-xl font-bold text-gray-900 mt-4">{firstName} {lastName}</h2>
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
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

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#266ECD] focus:border-transparent">
                            <option value="">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
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
