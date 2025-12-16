import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProfilePage from '../components/Profile/ProfilePage';
import EditProfilePage from '../components/Profile/EditProfilePage';

const Profile = () => {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isOwnProfile = !id; // If no ID is passed, it's the logged-in user's profile

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const endpoint = id
                ? `http://localhost:3000/api/employees/profile/${id}`
                : 'http://localhost:3000/api/employees/profile';

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        if (isOwnProfile) {
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

<<<<<<< HEAD
    const handleSaveProfile = async (updatedData) => {
        setProfileData(prev => ({ ...prev, ...updatedData }));
=======
    const handleSaveProfile = (updatedUser) => {
        // called by EditProfilePage after successful save
        if (updatedUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
>>>>>>> origin/main
        setIsEditing(false);
        fetchProfile();
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {isEditing ? (
                <EditProfilePage
                    profile={profileData}
                    onCancel={handleCancelEdit}
                    onSave={handleSaveProfile}
                />
            ) : (
                <ProfilePage
                    profile={profileData}
                    onEditProfile={isOwnProfile ? handleEditProfile : null}
                />
            )}
        </div>
    );
};

export default Profile;