import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, CardHeader, CardContent, Avatar, IconButton } from '@mui/material';
import {
    MoreHoriz as MoreHorizIcon,
    ThumbUp as ThumbUpIcon,
    ChatBubbleOutline as CommentIcon,
    Share as ShareIcon,
    Public as PublicIcon
} from '@mui/icons-material';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import CommentModal from './CommentModal';
import axios from 'axios';
import { getProfilePictureUrl } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const VideoPost = ({ post, handleLike, handleOpenComments }) => {
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const videoRef = useRef(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.7 // 70% of the video must be visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Video is in view
                    const video = entry.target;
                    video.play().catch(error => {
                        // Handle autoplay error (some browsers require user interaction)
                        console.log("Autoplay prevented:", error);
                    });
                } else {
                    // Video is out of view
                    entry.target.pause();
                }
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const onLikeClick = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!liked) {
                await axios.post(`http://localhost:5000/api/posts/${post.id}/like`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLikesCount(prev => prev + 1);
            } else {
                await axios.delete(`http://localhost:5000/api/posts/${post.id}/like`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLikesCount(prev => prev - 1);
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
                        src={getProfilePictureUrl(post.profile_picture)}
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

            <Box sx={{ width: '100%', maxHeight: '600px', overflow: 'hidden' }}>
                <video
                    ref={videoRef}
                    src={post.media[0]}
                    controls
                    muted // Add muted for better autoplay support
                    playsInline // Better mobile support
                    loop // Optional: loop the video
                    style={{
                        width: '100%',
                        maxHeight: '600px',
                        objectFit: 'contain'
                    }}
                />
            </Box>

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
                            {likesCount}
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

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    pt: 1
                }}>
                    <Box
                        onClick={onLikeClick}
                        sx={{ 
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            py: 1,
                            cursor: 'pointer',
                            color: liked ? '#1B74E4' : 'text.secondary',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        <ThumbUpIcon />
                        <Typography>Like</Typography>
                    </Box>
                    <Box
                        onClick={() => handleOpenComments(post)}
                        sx={{ 
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            py: 1,
                            cursor: 'pointer',
                            color: 'text.secondary',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        <CommentIcon />
                        <Typography>Comment</Typography>
                    </Box>
                    <Box
                        sx={{ 
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            py: 1,
                            cursor: 'pointer',
                            color: 'text.secondary',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}
                    >
                        <ShareIcon />
                        <Typography>Share</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const VideoFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [openCommentModal, setOpenCommentModal] = useState(false);

    const handleOpenComments = (post) => {
        setSelectedPost(post);
        setOpenCommentModal(true);
    };

    const handleCloseComments = () => {
        setSelectedPost(null);
        setOpenCommentModal(false);
    };

    const fetchVideoPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter only video posts
            const videoPosts = response.data.data.filter(post => 
                post.media_types && post.media_types[0] === 'video'
            );
            setPosts(videoPosts);
        } catch (error) {
            console.error('Error fetching video posts:', error);
            toast.error('Failed to load video posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideoPosts();
    }, []);

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
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                        Video Posts
                    </Typography>

                    {loading ? (
                        <Typography>Loading video posts...</Typography>
                    ) : posts.length === 0 ? (
                        <Typography>No video posts found</Typography>
                    ) : (
                        posts.map(post => (
                            <VideoPost 
                                key={post.id} 
                                post={post}
                                handleOpenComments={handleOpenComments}
                            />
                        ))
                    )}
                </Box>

                <Box sx={{ width: 320, display: { xs: 'none', lg: 'block' } }} />
            </Box>

            <CommentModal
                open={openCommentModal}
                handleClose={handleCloseComments}
                post={selectedPost}
            />
        </Box>
    );
};

export default VideoFeed; 