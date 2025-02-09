import React, { useState } from 'react';
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
    Paper,
    DialogActions
} from '@mui/material';
import {
    Close as CloseIcon,
    Public as PublicIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getProfilePictureUrl } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const CreatePostModal = ({ open, handleClose, refreshPosts }) => {
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');
    const [feeling, setFeeling] = useState('');
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [showFeelingInput, setShowFeelingInput] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);
        
        // Filter for allowed file types
        const allowedFiles = files.filter(file => 
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        if (allowedFiles.length + selectedFiles.length > 5) {
            toast.error('Maximum 5 files allowed');
            return;
        }

        setSelectedFiles(prev => [...prev, ...allowedFiles]);

        // Create previews
        allowedFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, {
                        type: 'image',
                        url: reader.result
                    }]);
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('video/')) {
                const videoUrl = URL.createObjectURL(file);
                setPreviews(prev => [...prev, {
                    type: 'video',
                    url: videoUrl
                }]);
            }
        });
    };

    const removeFile = (indexToRemove) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async () => {
        if (!content.trim() && selectedFiles.length === 0) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            const formData = new FormData();
            formData.append('content', content);
            formData.append('privacy', 'public');
            formData.append('post_type', selectedFiles.length > 0 ? 'image' : 'text');
            
            if (location) formData.append('location', location);
            if (feeling) formData.append('feeling', feeling);
            
            selectedFiles.forEach(file => {
                formData.append('media', file);
            });

            await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Post created successfully');
            setContent('');
            setSelectedFiles([]);
            setPreviews([]);
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
            toast.error(error.response?.data?.message || 'Error creating post');
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

                {previews.length > 0 && (
                    <Box sx={{ 
                        display: 'grid', 
                        gap: 1,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        mb: 2
                    }}>
                        {previews.map((preview, index) => (
                            <Box
                                key={index}
                                sx={{
                                    position: 'relative',
                                    paddingTop: '100%',
                                    backgroundColor: '#f0f2f5',
                                    borderRadius: 1
                                }}
                            >
                                {preview.type === 'image' ? (
                                    <img
                                        src={preview.url}
                                        alt={`Preview ${index}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: 8
                                        }}
                                    />
                                ) : (
                                    <video
                                        src={preview.url}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: 8
                                        }}
                                        controls
                                    />
                                )}
                                <IconButton
                                    size="small"
                                    onClick={() => removeFile(index)}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.7)'
                                        }
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
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

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        borderColor: '#E4E6EB'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography>Add to your post</Typography>
                        <Box>
                            <input
                                accept="image/*,video/*"
                                style={{ display: 'none' }}
                                id="media-file"
                                multiple
                                type="file"
                                onChange={handleImageSelect}
                            />
                            <label htmlFor="media-file">
                                <IconButton 
                                    component="span"
                                    disabled={selectedFiles.length >= 5}
                                >
                                    <ImageIcon sx={{ color: '#45BD62' }} />
                                </IconButton>
                            </label>
                        </Box>
                    </Box>
                </Paper>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && selectedFiles.length === 0)}
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
