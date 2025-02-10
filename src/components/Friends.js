import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardMedia, 
    CardContent, 
    Button,
    CircularProgress,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { friendService } from '../services/friendService';
import { toast } from 'react-toastify';
import { getProfilePictureUrl } from '../utils/helpers';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    border: '1px solid #dddfe2',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
    }
}));

const CardImageWrapper = styled(Box)({
    position: 'relative',
    paddingTop: '100%', // 1:1 Aspect ratio
    backgroundColor: '#f0f2f5',
    overflow: 'hidden'
});

const StyledCardMedia = styled(CardMedia)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)'
    }
});

const ActionButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '10px',
    fontWeight: 600,
    fontSize: '0.95rem',
    textTransform: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
}));

const ConfirmButton = styled(ActionButton)(({ theme }) => ({
    backgroundColor: '#0866ff',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#0851cc',
        transform: 'translateY(-2px)'
    }
}));

const DeleteButton = styled(ActionButton)(({ theme }) => ({
    backgroundColor: '#f0f2f5',
    color: '#65676b',
    '&:hover': {
        backgroundColor: '#e4e6eb',
        transform: 'translateY(-2px)'
    }
}));

const MutualFriendsText = styled(Typography)({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#65676b',
    fontSize: '0.9rem',
    marginBottom: '16px'
});

const SectionTitle = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1, 0)
}));

const Friends = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allFriends, setAllFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [suggestionsData, requestsData, friendsData] = await Promise.all([
                friendService.getSuggestions(),
                friendService.getPendingRequests(),
                friendService.getAllFriends()
            ]);
            setSuggestions(suggestionsData);
            setPendingRequests(requestsData);
            setAllFriends(friendsData);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (userId) => {
        try {
            await friendService.sendRequest(userId);
            toast.success('Friend request sent');
            setSuggestions(prev => prev.filter(user => user.id !== userId));
        } catch (err) {
            console.error('Error sending friend request:', err);
            toast.error(err.message || 'Failed to send friend request');
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await friendService.acceptRequest(requestId);
            toast.success('Friend request accepted');
            fetchAllData();
        } catch (err) {
            toast.error('Failed to accept request');
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await friendService.rejectRequest(requestId);
            toast.success('Friend request rejected');
            fetchAllData();
        } catch (err) {
            toast.error('Failed to reject request');
        }
    };

    const handleUnfriend = async (friendId) => {
        try {
            await friendService.unfriend(friendId);
            toast.success('Friend removed successfully');
            setAllFriends(prev => prev.filter(friend => friend.id !== friendId));
            // Refresh suggestions to show the unfriended user
            const newSuggestions = await friendService.getSuggestions();
            setSuggestions(newSuggestions);
        } catch (err) {
            toast.error(err.message || 'Failed to remove friend');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
            <Header />
            <Box sx={{ display: 'flex', bgcolor: '#F0F2F5', height: 'calc(100vh - 56px)', pt: '56px' }}>
                <Box sx={{ width: 320, display: { xs: 'none', lg: 'block' } }}>
                    <LeftSidebar />
                </Box>
                
                <Box sx={{
                    flex: 1,
                    py: 4,
                    px: 2,
                    mx: 'auto',
                    maxWidth: '1200px',
                    overflowY: 'auto'
                }}>
                    {/* Friend Requests Section - Only show if there are pending requests */}
                    {pendingRequests.length > 0 && (
                        <>
                            <SectionTitle>
                                <Typography variant="h6" fontWeight={600}>
                                    Friend Requests ({pendingRequests.length})
                                </Typography>
                                <Button 
                                    sx={{ 
                                        color: '#0866ff',
                                        textTransform: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    See all
                                </Button>
                            </SectionTitle>

                            <Grid container spacing={3}>
                                {pendingRequests.map((request) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={request.id}>
                                        <StyledCard>
                                            <CardImageWrapper>
                                                <StyledCardMedia
                                                    component="img"
                                                    image={getProfilePictureUrl(request.profile_picture)}
                                                    alt={request.first_name}
                                                />
                                            </CardImageWrapper>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography 
                                                    gutterBottom 
                                                    variant="h6" 
                                                    component="div"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '1.1rem',
                                                        mb: 1,
                                                        color: '#050505'
                                                    }}
                                                >
                                                    {request.first_name} {request.last_name}
                                                </Typography>
                                                {request.mutual_friends > 0 && (
                                                    <MutualFriendsText>
                                                        <PersonAddIcon sx={{ fontSize: 18 }} />
                                                        {request.mutual_friends} mutual friend{request.mutual_friends > 1 ? 's' : ''}
                                                    </MutualFriendsText>
                                                )}
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                    <ConfirmButton
                                                        onClick={() => handleAcceptRequest(request.request_id)}
                                                    >
                                                        Confirm Request
                                                    </ConfirmButton>
                                                    <DeleteButton
                                                        onClick={() => handleRejectRequest(request.request_id)}
                                                    >
                                                        Delete Request
                                                    </DeleteButton>
                                                </Box>
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}

                    {/* Friend Suggestions Section */}
                    <Box sx={{ mt: pendingRequests.length > 0 ? 4 : 0 }}>
                        <SectionTitle>
                            <Typography variant="h6" fontWeight={600}>
                                People You May Know
                            </Typography>
                        </SectionTitle>
                        <Grid container spacing={3}>
                            {suggestions.map((suggestion) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={suggestion.id}>
                                    <StyledCard>
                                        <CardImageWrapper>
                                            <StyledCardMedia
                                                component="img"
                                                image={getProfilePictureUrl(suggestion.profile_picture)}
                                                alt={suggestion.first_name}
                                            />
                                        </CardImageWrapper>
                                        <CardContent sx={{ p: 2 }}>
                                            <Typography 
                                                gutterBottom 
                                                variant="h6" 
                                                component="div"
                                                sx={{ 
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem',
                                                    mb: 1,
                                                    color: '#050505'
                                                }}
                                            >
                                                {suggestion.first_name} {suggestion.last_name}
                                            </Typography>
                                            {suggestion.mutual_friends > 0 && (
                                                <MutualFriendsText>
                                                    <PersonAddIcon sx={{ fontSize: 18 }} />
                                                    {suggestion.mutual_friends} mutual friend{suggestion.mutual_friends > 1 ? 's' : ''}
                                                </MutualFriendsText>
                                            )}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <ConfirmButton
                                                    onClick={() => handleSendRequest(suggestion.id)}
                                                >
                                                    Add Friend
                                                </ConfirmButton>
                                            </Box>
                                        </CardContent>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* All Friends Section */}
                    {allFriends.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <SectionTitle>
                                <Typography variant="h6" fontWeight={600}>
                                    All Friends ({allFriends.length})
                                </Typography>
                            </SectionTitle>
                            <Grid container spacing={3}>
                                {allFriends.map((friend) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
                                        <StyledCard>
                                            <CardImageWrapper>
                                                <StyledCardMedia
                                                    component="img"
                                                    image={getProfilePictureUrl(friend.profile_picture)}
                                                    alt={friend.first_name}
                                                />
                                            </CardImageWrapper>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography 
                                                    gutterBottom 
                                                    variant="h6" 
                                                    component="div"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '1.1rem',
                                                        mb: 1,
                                                        color: '#050505'
                                                    }}
                                                >
                                                    {friend.first_name} {friend.last_name}
                                                </Typography>
                                                {friend.mutual_friends > 0 && (
                                                    <MutualFriendsText>
                                                        <PersonAddIcon sx={{ fontSize: 18 }} />
                                                        {friend.mutual_friends} mutual friend{friend.mutual_friends > 1 ? 's' : ''}
                                                    </MutualFriendsText>
                                                )}
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                    <DeleteButton
                                                        onClick={() => handleUnfriend(friend.id)}
                                                        sx={{
                                                            '&:hover': {
                                                                bgcolor: '#ffebe9',
                                                                color: '#dc3545'
                                                            }
                                                        }}
                                                    >
                                                        Unfriend
                                                    </DeleteButton>
                                                </Box>
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Friends;