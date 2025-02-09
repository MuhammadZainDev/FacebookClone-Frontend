import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, IconButton, Divider } from '@mui/material';
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
    const [isLiking, setIsLiking] = useState(false);

    const onLikeClick = async () => {
        if (isLiking) return;
        setIsLiking(true);
        
        try {
            await handleLike(post.id, !post.is_liked);
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                        src={getProfilePictureUrl(post.user_profile_picture)}
                        sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ flex: 1, ml: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>
                            {post.first_name} {post.last_name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#65676B' }}>
                                {new Date(post.created_at).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" sx={{ mx: 0.5, color: '#65676B' }}>·</Typography>
                            <PublicIcon sx={{ fontSize: 12, color: '#65676B' }} />
                        </Box>
                    </Box>
                    <IconButton size="small">
                        <MoreHorizIcon />
                    </IconButton>
                </Box>
                <Typography sx={{ mb: 2 }}>{post.content}</Typography>
                {post.media && post.media.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        {post.media.length === 1 ? (
                            <Box
                                component="img"
                                src={post.media[0]}
                                sx={{
                                    width: '100%',
                                    maxHeight: 500,
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <Box sx={{ 
                                display: 'grid', 
                                gap: 1,
                                gridTemplateColumns: post.media.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)',
                                p: 1
                            }}>
                                {post.media.map((url, index) => (
                                    <Box
                                        key={index}
                                        component="img"
                                        src={url}
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            objectFit: 'cover',
                                            borderRadius: 1
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    {post.likes_count > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ThumbUpIcon sx={{ fontSize: 18, color: 'white', bgcolor: '#1B74E4', p: 0.5, borderRadius: '50%' }} />
                            <Typography sx={{ ml: 1, color: '#65676B' }}>{post.likes_count}</Typography>
                        </Box>
                    )}
                    <Typography 
                        sx={{ color: '#65676B', cursor: 'pointer' }}
                        onClick={() => handleOpenComments(post)}
                    >
                        {post.comments_count || 0} comments
                    </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Box
                        onClick={onLikeClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: 1,
                            cursor: 'pointer',
                            flex: 1,
                            justifyContent: 'center',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        <ThumbUpIcon sx={{ 
                            color: post.is_liked ? '#1B74E4' : '#65676B',
                            mr: 1,
                            animation: isLiking ? 'likeAnimation 0.3s ease' : 'none',
                            '@keyframes likeAnimation': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.2)' },
                                '100%': { transform: 'scale(1)' }
                            }
                        }} />
                        <Typography sx={{ color: post.is_liked ? '#1B74E4' : '#65676B' }}>Like</Typography>
                    </Box>
                    <Box
                        onClick={() => handleOpenComments(post)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: 1,
                            cursor: 'pointer',
                            flex: 1,
                            justifyContent: 'center',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        <CommentIcon sx={{ color: '#65676B', mr: 1 }} />
                        <Typography sx={{ color: '#65676B' }}>Comment</Typography>
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
                        <ShareIcon sx={{ color: '#65676B', mr: 1 }} />
                        <Typography sx={{ color: '#65676B' }}>Share</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

const Home = () => {
    const [openPostModal, setOpenPostModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user')) || {};

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
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
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