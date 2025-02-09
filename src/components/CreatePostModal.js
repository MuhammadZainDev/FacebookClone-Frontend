import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Avatar,
    Typography,
    IconButton,
    Button,
    TextField,
    CircularProgress,
    Input
} from '@mui/material';
import {
    Close as CloseIcon,
    Public as PublicIcon,
    PhotoLibrary as PhotoIcon,
    PersonAdd as TagIcon,
    EmojiEmotions as EmojiIcon,
    LocationOn as LocationIcon,
    GifBox as GifIcon,
    MoreHoriz as MoreIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getProfilePictureUrl } from '../utils/helpers';

const CreatePostModal = ({ open, handleClose, refreshPosts }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [location, setLocation] = useState('');
    const [feeling, setFeeling] = useState('');
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [showFeelingInput, setShowFeelingInput] = useState(false);
    
    const fileInputRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);
        
        // Convert files to URLs for preview
        const imageUrls = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));
        
        setSelectedImages([...selectedImages, ...imageUrls]);
    };

    const removeImage = (indexToRemove) => {
        setSelectedImages(selectedImages.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async () => {
        if (!content.trim() && selectedImages.length === 0) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            // Create FormData to handle file upload
            const formData = new FormData();
            formData.append('content', content);
            formData.append('privacy', 'public');
            formData.append('post_type', selectedImages.length > 0 ? 'image' : 'text');
            
            if (location) formData.append('location', location);
            if (feeling) formData.append('feeling', feeling);
            
            // Append each image file
            selectedImages.forEach((image, index) => {
                formData.append('media', image.file);
            });

            await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clear form and close modal
            setContent('');
            setSelectedImages([]);
            setLocation('');
            setFeeling('');
            setShowLocationInput(false);
            setShowFeelingInput(false);
            handleClose();
            
            if (refreshPosts) {
                refreshPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    width: '500px',
                    maxWidth: '500px'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    textAlign: 'center', 
                    borderBottom: '1px solid #ddd',
                    p: 2,
                    position: 'relative'
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Create post
                </Typography>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        bgcolor: '#E4E6E9',
                        '&:hover': { bgcolor: '#D8DADF' },
                        width: 36,
                        height: 36
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar 
                        src={getProfilePictureUrl(user.profile_picture)}
                        sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<PublicIcon sx={{ fontSize: 16 }} />}
                            sx={{ 
                                textTransform: 'none',
                                bgcolor: '#E4E6E9',
                                color: '#050505',
                                fontSize: 13,
                                fontWeight: 600,
                                px: 1,
                                minWidth: 'unset',
                                '&:hover': { bgcolor: '#D8DADF' }
                            }}
                        >
                            Friends
                        </Button>
                    </Box>
                </Box>

                <TextField
                    multiline
                    fullWidth
                    placeholder="What's on your mind?"
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: '1.5rem' }
                    }}
                    sx={{ mb: 2 }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* Image Previews */}
                {selectedImages.length > 0 && (
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedImages.map((image, index) => (
                            <Box
                                key={index}
                                sx={{ position: 'relative' }}
                            >
                                <img
                                    src={image.url}
                                    alt={`Preview ${index}`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => removeImage(index)}
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        bgcolor: '#E4E6E9',
                                        '&:hover': { bgcolor: '#D8DADF' }
                                    }}
                                >
                                    <CancelIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Location Input */}
                {showLocationInput && (
                    <TextField
                        fullWidth
                        placeholder="Add location"
                        variant="outlined"
                        size="small"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                )}

                {/* Feeling Input */}
                {showFeelingInput && (
                    <TextField
                        fullWidth
                        placeholder="How are you feeling?"
                        variant="outlined"
                        size="small"
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                )}

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {/* Hidden file input */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                />

                <Box sx={{ 
                    border: '1px solid #ddd',
                    borderRadius: 3,
                    p: 1,
                    mb: 2
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 15, pl: 1 }}>
                            Add to your post
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                            <IconButton 
                                sx={{ color: '#45BD62' }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <PhotoIcon />
                            </IconButton>
                            <IconButton sx={{ color: '#1877F2' }}>
                                <TagIcon />
                            </IconButton>
                            <IconButton 
                                sx={{ color: '#F7B928' }}
                                onClick={() => setShowFeelingInput(!showFeelingInput)}
                            >
                                <EmojiIcon />
                            </IconButton>
                            <IconButton 
                                sx={{ color: '#F5533D' }}
                                onClick={() => setShowLocationInput(!showLocationInput)}
                            >
                                <LocationIcon />
                            </IconButton>
                            <IconButton sx={{ color: '#9360F7' }}>
                                <GifIcon />
                            </IconButton>
                            <IconButton>
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && selectedImages.length === 0)}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 1,
                        py: 1,
                        fontSize: '15px',
                        fontWeight: 600,
                        bgcolor: '#1B74E4',
                        '&:hover': { bgcolor: '#156CD0' },
                        '&.Mui-disabled': {
                            bgcolor: '#E4E6EB',
                            color: '#BCC0C4'
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Post'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostModal;
