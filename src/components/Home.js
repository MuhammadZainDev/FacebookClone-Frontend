import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, IconButton, Divider, Card, CardHeader, CardContent, CardMedia, Button } from '@mui/material';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import CommentModal from './CommentModal';
import {
    VideoCall as VideoCallIcon,
    PhotoLibrary as PhotoLibraryIcon,
    InsertEmoticon as InsertEmoticonIcon,
    MoreHoriz as MoreHorizIcon,
    ThumbUp as ThumbUpIcon,
    ChatBubbleOutline as CommentIcon,
    Share as ShareIcon,
    Public as PublicIcon
} from '@mui/icons-material';
import CreatePostModal from './CreatePostModal';
import axios from 'axios';
import { getProfilePictureUrl } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const CreatePost = ({ onOpenPostModal }) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    return (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, cursor: 'pointer' }} onClick={onOpenPostModal}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                    src={getProfilePictureUrl(user.profile_picture)} 
                    sx={{ width: 40, height: 40 }}
                />
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: '#F0F2F5',
                        borderRadius: 50,
                        p: 1,
                        px: 2,
                        ml: 2,
                        '&:hover': { bgcolor: '#E4E6E9' }
                    }}
                >
                    <Typography sx={{ color: '#65676B' }}>
                        What's on your mind?
                    </Typography>
                </Box>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    flex: 1,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: '#F0F2F5' }
                }}>
                    <VideoCallIcon sx={{ color: '#F3425F', mr: 1 }} />
                    <Typography sx={{ color: '#65676B' }}>Live video</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    flex: 1,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: '#F0F2F5' }
                }}>
                    <PhotoLibraryIcon sx={{ color: '#45BD62', mr: 1 }} />
                    <Typography sx={{ color: '#65676B' }}>Photo/video</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    flex: 1,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: '#F0F2F5' }
                }}>
                    <InsertEmoticonIcon sx={{ color: '#F7B928', mr: 1 }} />
                    <Typography sx={{ color: '#65676B' }}>Feeling/activity</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

const Post = ({ post, handleLike, handleOpenComments }) => {
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(parseInt(post.likes_count) || 0);

    const onLikeClick = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!liked) {
                const response = await axios.post(
                    `http://localhost:5000/api/posts/${post.id}/like`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setLikesCount(response.data.likesCount);
            } else {
                const response = await axios.delete(
                    `http://localhost:5000/api/posts/${post.id}/like`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setLikesCount(response.data.likesCount);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Failed to update like');
        }
    };

    return (
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid #E4E6EB' }}>
            <CardHeader
                avatar={
                    <Avatar 
                        src={post.profile_picture ? getProfilePictureUrl(post.profile_picture) : undefined}
                        sx={{ width: 40, height: 40 }}
                    />
                }
                action={
                    <IconButton>
                        <MoreHorizIcon />
                    </IconButton>
                }
                title={
                    <Typography sx={{ fontWeight: 600 }}>
                        {post.first_name} {post.last_name}
                    </Typography>
                }
                subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            {new Date(post.created_at).toLocaleString()}
                        </Typography>
                        <PublicIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    </Box>
                }
            />
            
            {post.content && (
                <CardContent sx={{ py: 1 }}>
                    <Typography variant="body1">
                        {post.content}
                    </Typography>
                </CardContent>
            )}

            {post.media && post.media.length > 0 && (
                <Box sx={{ position: 'relative' }}>
                    {post.media_types && post.media_types[0] === 'video' ? (
                        <Box sx={{ width: '100%', maxHeight: '600px', overflow: 'hidden' }}>
                            <video
                                src={post.media[0]}
                                controls
                                style={{
                                    width: '100%',
                                    maxHeight: '600px',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    ) : (
                        <CardMedia
                            component="img"
                            image={post.media[0]}
                            sx={{
                                width: '100%',
                                maxHeight: '600px',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </Box>
            )}

            <CardContent sx={{ py: 1 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbUpIcon 
                            sx={{ 
                                fontSize: 20, 
                                color: 'white',
                                bgcolor: '#1B74E4',
                                p: 0.5,
                                borderRadius: '50%'
                            }} 
                        />
                        <Typography color="text.secondary">
                            {likesCount > 0 ? likesCount : '0'}
                        </Typography>
                    </Box>
                    <Typography 
                        color="text.secondary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenComments(post)}
                    >
                        {post.comments_count} comments
                    </Typography>
                </Box>

                <Divider />

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    pt: 1
                }}>
                    <Button
                        startIcon={<ThumbUpIcon />}
                        onClick={onLikeClick}
                        sx={{ 
                            flex: 1,
                            color: liked ? '#1B74E4' : 'text.secondary',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        Like
                    </Button>
                    <Button
                        startIcon={<CommentIcon />}
                        onClick={() => handleOpenComments(post)}
                        sx={{ 
                            flex: 1,
                            color: 'text.secondary',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        Comment
                    </Button>
                    <Button
                        startIcon={<ShareIcon />}
                        sx={{ 
                            flex: 1,
                            color: 'text.secondary',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        Share
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

const Home = () => {
    const [openPostModal, setOpenPostModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [openCommentModal, setOpenCommentModal] = useState(false);

    const handleOpenPostModal = () => setOpenPostModal(true);
    const handleClosePostModal = () => setOpenPostModal(false);

    const handleOpenComments = (post) => {
        setSelectedPost(post);
        setOpenCommentModal(true);
    };

    const handleCloseComments = () => {
        setSelectedPost(null);
        setOpenCommentModal(false);
    };

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter out video posts, only show image posts or posts without media
            const filteredPosts = response.data.data.filter(post => 
                !post.media_types || 
                post.media_types.length === 0 || 
                post.media_types[0] === 'image'
            );
            setPosts(filteredPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId, shouldLike) => {
        try {
            const token = localStorage.getItem('token');
            
            // Optimistically update UI
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        is_liked: shouldLike,
                        likes_count: shouldLike ? post.likes_count + 1 : post.likes_count - 1
                    };
                }
                return post;
            }));

            // Make API call
            if (shouldLike) {
                await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.delete(`http://localhost:5000/api/posts/${postId}/like`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Error handling like:', error);
            // Revert optimistic update on error
            fetchPosts();
        }
    };

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
                    maxWidth: 680,
                    mx: 'auto',
                    overflowY: 'auto',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}>
                    <CreatePost onOpenPostModal={handleOpenPostModal} />

                    {loading ? (
                        <Typography>Loading posts...</Typography>
                    ) : (
                        posts.map(post => (
                            <Post 
                                key={post.id} 
                                post={post}
                                handleLike={handleLike}
                                handleOpenComments={handleOpenComments}
                            />
                        ))
                    )}
                </Box>

                <Box sx={{ width: 320, display: { xs: 'none', lg: 'block' } }} />
            </Box>

            <CreatePostModal 
                open={openPostModal}
                handleClose={handleClosePostModal}
                refreshPosts={fetchPosts}
            />
            <CommentModal
                open={openCommentModal}
                handleClose={handleCloseComments}
                post={selectedPost}
            />
        </Box>
    );
};

export default Home;