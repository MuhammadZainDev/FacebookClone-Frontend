import React, { useState, useEffect } from 'react';
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
    DialogActions,
    Modal,
    InputAdornment,
    Tooltip
} from '@mui/material';
import {
    Close as CloseIcon,
    Public as PublicIcon,
    Image as ImageIcon,
    InsertEmoticon as InsertEmoticonIcon,
    LocationOn as LocationOnIcon,
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getProfilePictureUrl } from '../utils/helpers';
import { toast } from 'react-hot-toast';
import locationData from '../data/locations.json';

// Feeling options data
const feelings = [
    { emoji: '😊', name: 'happy' },
    { emoji: '😇', name: 'blessed' },
    { emoji: '🥰', name: 'loved' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😊', name: 'lovely' },
    { emoji: '🙏', name: 'thankful' },
    { emoji: '😎', name: 'excited' },
    { emoji: '❤️', name: 'in love' },
    { emoji: '🤪', name: 'crazy' },
    { emoji: '🙏', name: 'grateful' },
    { emoji: '😊', name: 'blissful' },
    { emoji: '🤩', name: 'fantastic' }
];

// Location suggestions
const locationSuggestions = [
    {
        name: 'Karachi',
        address: 'Karachi, Sindh, Pakistan'
    },
    {
        name: 'Elite Dental & Aesthetic Clinic',
        address: '26-C, 9th Sunset Lane, Phase II Extension, DHA, Karachi, Pakistan'
    },
    {
        name: 'APNI DUNIYA ME',
        address: 'Karachi, Sindh, Pakistan'
    },
    {
        name: 'Public School & College',
        address: 'ST-2 Sector 11/C-2 Sir Syed Town North Karachi, Karachi, Pakistan-75850'
    }
];

const CreatePostModal = ({ open, handleClose, refreshPosts }) => {
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('');
    const [feeling, setFeeling] = useState('');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showFeelingModal, setShowFeelingModal] = useState(false);
    const [locationSearch, setLocationSearch] = useState('');
    const [feelingSearch, setFeelingSearch] = useState('');
    const [allLocations, setAllLocations] = useState([]);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        // Flatten all locations from the JSON data
        const flattenedLocations = locationData.countries.reduce((acc, country) => {
            const countryLocations = country.cities.reduce((cityAcc, city) => {
                return [...cityAcc, ...city.locations];
            }, []);
            return [...acc, ...countryLocations];
        }, []);
        setAllLocations(flattenedLocations);
    }, []);

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

    const handleLocationSelect = (selectedLocation) => {
        setLocation(selectedLocation.name);
        setShowLocationModal(false);
    };

    const handleFeelingSelect = (selectedFeeling) => {
        setFeeling(selectedFeeling.name);
        setShowFeelingModal(false);
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

    const generateAITitle = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select an image or video first');
            return;
        }

        setIsGeneratingTitle(true);
        try {
            const file = selectedFiles[0];
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:5000/api/ai/generate-title', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setContent(response.data.title);
            toast.success('AI title generated successfully!');
        } catch (error) {
            console.error('Error generating AI title:', error);
            toast.error('Failed to generate AI title');
        } finally {
            setIsGeneratingTitle(false);
        }
    };

    const filteredLocations = locationSearch
        ? allLocations.filter(loc => 
            loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
            loc.address.toLowerCase().includes(locationSearch.toLowerCase())
        )
        : allLocations;

    const filteredFeelings = feelingSearch
        ? feelings.filter(feel => 
            feel.name.toLowerCase().includes(feelingSearch.toLowerCase())
        )
        : feelings;

    return (
        <>
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
                    <Typography component="div" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
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

                <DialogContent sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1.5 }}>
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

                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            multiline
                            fullWidth
                            placeholder={`What's on your mind, ${user.first_name}?`}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: { fontSize: '1rem' },
                                endAdornment: selectedFiles.length > 0 && (
                                    <InputAdornment position="end">
                                        <Tooltip title="Generate AI title">
                                            <IconButton 
                                                onClick={generateAITitle}
                                                disabled={isGeneratingTitle}
                                                sx={{ 
                                                    color: '#1B74E4',
                                                    '&:hover': { bgcolor: 'rgba(27, 116, 228, 0.1)' }
                                                }}
                                            >
                                                {isGeneratingTitle ? (
                                                    <CircularProgress size={24} />
                                                ) : (
                                                    <AutoAwesomeIcon />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ mb: 1.5 }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Box>

                    {/* Location and Feeling Display */}
                    {(location || feeling) && (
                        <Box sx={{ mb: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {location && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    bgcolor: '#E4E6E9',
                                    p: 0.5,
                                    px: 1,
                                    borderRadius: 1,
                                    gap: 0.5
                                }}>
                                    <LocationOnIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="body2">{location}</Typography>
                                </Box>
                            )}
                            {feeling && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    bgcolor: '#E4E6E9',
                                    p: 0.5,
                                    px: 1,
                                    borderRadius: 1,
                                    gap: 0.5
                                }}>
                                    <InsertEmoticonIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="body2">feeling {feeling}</Typography>
                                </Box>
                            )}
                        </Box>
                    )}

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

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            borderColor: '#E4E6EB'
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            '& .MuiIconButton-root': {
                                p: 1
                            }
                        }}>
                            <Typography variant="body2">Add to your post</Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                                        sx={{ color: '#45BD62' }}
                                    >
                                        <ImageIcon />
                                    </IconButton>
                                </label>
                                <IconButton 
                                    onClick={() => setShowFeelingModal(true)}
                                    sx={{ color: '#F7B928' }}
                                >
                                    <InsertEmoticonIcon />
                                </IconButton>
                                <IconButton 
                                    onClick={() => setShowLocationModal(true)}
                                    sx={{ color: '#F5533D' }}
                                >
                                    <LocationOnIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || (!content.trim() && selectedFiles.length === 0)}
                        sx={{
                            mt: 1.5,
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

            {/* Location Selection Modal */}
            <Dialog
                open={showLocationModal}
                onClose={() => setShowLocationModal(false)}
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
                <DialogTitle sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid #ddd'
                }}>
                    <IconButton 
                        onClick={() => setShowLocationModal(false)}
                        size="small"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">Search for location</Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 1.5 }}>
                    <TextField
                        fullWidth
                        placeholder="Where are you?"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        sx={{ mb: 1.5, mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#65676B' }}>
                        Suggested
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 0.5,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: '3px'
                        }
                    }}>
                        {filteredLocations.map((loc, index) => (
                            <Box
                                key={index}
                                onClick={() => handleLocationSelect(loc)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 1,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#F0F2F5' }
                                }}
                            >
                                <Avatar sx={{ bgcolor: '#E4E6EB' }}>
                                    <LocationOnIcon />
                                </Avatar>
                                <Box>
                                    <Typography>{loc.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {loc.address}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Feeling Selection Modal */}
            <Dialog
                open={showFeelingModal}
                onClose={() => setShowFeelingModal(false)}
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
                <DialogTitle sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid #ddd'
                }}>
                    <IconButton 
                        onClick={() => setShowFeelingModal(false)}
                        size="small"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">How are you feeling?</Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 1.5 }}>
                    <TextField
                        fullWidth
                        placeholder="Search feelings..."
                        value={feelingSearch}
                        onChange={(e) => setFeelingSearch(e.target.value)}
                        sx={{ mb: 1.5 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 0.5
                    }}>
                        {filteredFeelings.map((feel, index) => (
                            <Box
                                key={index}
                                onClick={() => handleFeelingSelect(feel)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 1,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#F0F2F5' }
                                }}
                            >
                                <Avatar sx={{ bgcolor: '#E4E6EB', width: 36, height: 36 }}>
                                    {feel.emoji}
                                </Avatar>
                                <Typography>{feel.name}</Typography>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreatePostModal;
