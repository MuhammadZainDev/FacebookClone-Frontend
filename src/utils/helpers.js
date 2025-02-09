export const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return '/default-avatar.png';
    
    if (profilePicture.startsWith('http')) {
        return profilePicture;
    }
    
    if (profilePicture.startsWith('/uploads')) {
        return `http://localhost:5000${profilePicture}`;
    }
    
    return `http://localhost:5000/uploads/profiles/${profilePicture}`;
}; 