import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    IconButton,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Header from './Header';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import { profileService } from '../services/profileService';
import { useState, useEffect } from 'react';
import { getProfilePictureUrl } from '../utils/helpers';
import axios from 'axios';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        date_of_birth: user.date_of_birth ? parseISO(user.date_of_birth) : null,
        gender: user.gender || '',
        profile_picture: user.profile_picture || null
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProfile();
            setFormData({
                ...data,
                date_of_birth: data.date_of_birth ? parseISO(data.date_of_birth) : null
            });
        } catch (err) {
            toast.error('Failed to load profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
    
            try {
                const updatedProfile = await profileService.uploadProfilePicture(file);
                
                // Update form data
                setFormData(prev => ({
                    ...prev,
                    profile_picture: updatedProfile.profile_picture
                }));
                
                // Update localStorage user data
                const user = JSON.parse(localStorage.getItem('user'));
                const updatedUser = {
                    ...user,
                    profile_picture: updatedProfile.profile_picture
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Force a re-render of components using profile picture
                window.dispatchEvent(new Event('storage'));
                console.log('Storage event dispatched');
                
                toast.success('Profile picture updated successfully');
                setImagePreview(null);
            } catch (error) {
                toast.error('Failed to update profile picture');
                console.error(error);
                setImagePreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/profile/update',
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update local storage with new user data
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F5' }}>
            <Header />
            <Container maxWidth="md" sx={{ pt: 10, pb: 4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        {/* Profile Header */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 4
                        }}>
                            <Typography variant="h5" fontWeight={600}>
                                Profile Information
                            </Typography>
                            <Button
                                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                                variant="contained"
                                onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
                                sx={{
                                    bgcolor: isEditing ? '#42b72a' : '#1877f2',
                                    '&:hover': {
                                        bgcolor: isEditing ? '#36a420' : '#166fe5'
                                    }
                                }}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </Box>

                        {/* Profile Picture */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            mb: 4
                        }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={imagePreview || getProfilePictureUrl(formData.profile_picture)}
                                    sx={{ 
                                        width: 150, 
                                        height: 150,
                                        border: '4px solid white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                                {isEditing && (
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: '#1877f2',
                                            color: 'white',
                                            '&:hover': { bgcolor: '#166fe5' }
                                        }}
                                        component="label"
                                    >
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={handleImageChange}
                                        />
                                        <PhotoCameraIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Profile Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        type="email"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Date of Birth"
                                            value={formData.date_of_birth}
                                            onChange={(newValue) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    date_of_birth: newValue
                                                }));
                                            }}
                                            disabled={!isEditing}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled={!isEditing}>
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            label="Gender"
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="custom">Custom</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {isEditing && (
                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#42b72a',
                                            '&:hover': { bgcolor: '#36a420' }
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default Profile; 