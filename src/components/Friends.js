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
    borderRadius: '8px',
    border: '1px solid #dddfe2',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '8px',
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'none',
    borderRadius: '6px',
}));

const ConfirmButton = styled(ActionButton)(({ theme }) => ({
    backgroundColor: '#0866ff',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#0851cc',
    }
}));

const DeleteButton = styled(ActionButton)(({ theme }) => ({
    backgroundColor: '#f0f2f5',
    color: '#65676b',
    '&:hover': {
        backgroundColor: '#e4e6eb',
    }
}));

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
                    overflowY: 'auto'
                }}>
                    <SectionTitle>
                        <Typography variant="h6" fontWeight={600}>
                            Friend Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
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

                    <Grid container spacing={2}>
                        {pendingRequests.map((request) => (
                            <Grid item xs={12} sm={6} md={3} key={request.id}>
                                <StyledCard>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={getProfilePictureUrl(request.profile_picture)}
                                        alt={request.first_name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography 
                                            gutterBottom 
                                            variant="h6" 
                                            component="div"
                                            sx={{ 
                                                fontWeight: 600,
                                                fontSize: '1.1rem',
                                                mb: 1
                                            }}
                                        >
                                            {request.first_name} {request.last_name}
                                        </Typography>
                                        {request.mutual_friends > 0 && (
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ mb: 2, fontSize: '0.9rem' }}
                                            >
                                                {request.mutual_friends} mutual friend{request.mutual_friends > 1 ? 's' : ''}
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <ConfirmButton
                                                onClick={() => handleAcceptRequest(request.request_id)}
                                            >
                                                Confirm
                                            </ConfirmButton>
                                            <DeleteButton
                                                onClick={() => handleRejectRequest(request.request_id)}
                                            >
                                                Delete
                                            </DeleteButton>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>

                    {/* All Friends Section */}
                    {allFriends.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                All Friends ({allFriends.length})
                            </Typography>
                            <Grid container spacing={2}>
                                {allFriends.map(friend => (
                                    <Grid item xs={12} sm={6} key={friend.id}>
                                        <FriendCard 
                                            user={friend} 
                                            type="friend"
                                            onUnfriend={handleUnfriend}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Suggestions Section */}
                    {suggestions.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                People You May Know
                            </Typography>
                            <Grid container spacing={2}>
                                {suggestions.map(user => (
                                    <Grid item xs={12} sm={6} key={user.id}>
                                        <FriendCard 
                                            user={user} 
                                            type="suggestion"
                                            onAddFriend={handleSendRequest}
                                            onUnfriend={handleUnfriend}
                                        />
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

// FriendCard component
const FriendCard = ({ user, type, onUnfriend, onAddFriend }) => (
    <Card sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        boxShadow: 'none',
        border: '1px solid #E4E6EB'
    }}>
        <CardMedia
            component="img"
            height="200"
            image={getProfilePictureUrl(user.profile_picture)}
            alt={`${user.first_name} ${user.last_name}`}
            sx={{ objectFit: 'cover' }}
        />
        <CardContent>
            <Typography variant="h6">
                {user.first_name} {user.last_name}
            </Typography>
            {user.mutual_friends > 0 && (
                <Typography variant="body2" color="text.secondary">
                    {user.mutual_friends} mutual friends
                </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                {type === 'suggestion' && (
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        fullWidth
                        onClick={() => onAddFriend(user.id)}
                        sx={{ bgcolor: '#E4E6EB', color: 'black', '&:hover': { bgcolor: '#D8DADF' } }}
                    >
                        Add Friend
                    </Button>
                )}
                {type === 'friend' && (
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => onUnfriend(user.id)}
                        sx={{ 
                            bgcolor: '#E4E6EB', 
                            color: 'black',
                            '&:hover': { 
                                bgcolor: '#DC3545',
                                color: 'white'
                            }
                        }}
                    >
                        Unfriend
                    </Button>
                )}
            </Box>
        </CardContent>
    </Card>
);

export default Friends;