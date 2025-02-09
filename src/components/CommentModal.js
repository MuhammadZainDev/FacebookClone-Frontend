import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Avatar,
    Typography,
    IconButton,
    TextField,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    Close as CloseIcon,
    ThumbUp as ThumbUpIcon,
    ChatBubbleOutline as CommentIcon,
    Share as ShareIcon,
    Public as PublicIcon,
    MoreHoriz as MoreIcon,
    EmojiEmotionsOutlined as EmojiIcon,
    Image as ImageIcon,
    Gif as GifIcon,
    AddPhotoAlternate as StickerIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getProfilePictureUrl } from '../utils/helpers';

const CommentModal = ({ open, handleClose, post }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        if (open && post) {
            fetchComments();
        }
    }, [open, post]);

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/posts/${post.id}/comments`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setComments(response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/posts/${post.id}/comments`,
                { content: newComment },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!post) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxWidth: '700px'
                }
            }}
        >
            <Box sx={{ 
                position: 'relative', 
                p: 2,
                borderBottom: '1px solid #ddd'
            }}>
                <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                    {post.first_name}'s Post
                </Typography>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        bgcolor: '#E4E6E9',
                        '&:hover': { bgcolor: '#D8DADF' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {/* Post Content */}
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                            src={getProfilePictureUrl(currentUser.profile_picture)}
                            sx={{ width: 32, height: 32 }}
                        />
                        <Box>
                            <Typography sx={{ fontWeight: 600 }}>
                                {post.first_name} {post.last_name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(post.created_at).toLocaleString()}
                                </Typography>
                                <PublicIcon sx={{ fontSize: 12, ml: 0.5, color: 'text.secondary' }} />
                            </Box>
                        </Box>
                        <IconButton sx={{ ml: 'auto' }}>
                            <MoreIcon />
                        </IconButton>
                    </Box>

                    <Typography sx={{ mb: 2 }}>{post.content}</Typography>

                    {post.media && post.media.length > 0 && (
                        <Box
                            component="img"
                            src={post.media[0]}
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                mb: 2
                            }}
                        />
                    )}

                    {/* Like/Comment Count */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ThumbUpIcon 
                                sx={{ 
                                    fontSize: 20, 
                                    color: 'white',
                                    bgcolor: '#1B74E4',
                                    p: 0.5,
                                    borderRadius: '50%',
                                    mr: 0.5
                                }} 
                            />
                            <Typography color="textSecondary">
                                {post.likes_count || 0}
                            </Typography>
                        </Box>
                        <Typography color="textSecondary">
                            {comments.length} comments
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Like/Comment/Share Buttons */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 2
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                            p: 1,
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}>
                            <ThumbUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography color="textSecondary">Like</Typography>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                            p: 1,
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}>
                            <CommentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography color="textSecondary">Comment</Typography>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: 'center',
                            p: 1,
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#F0F2F5' }
                        }}>
                            <ShareIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography color="textSecondary">Share</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Comments Section */}
                    <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 2 }}>
                        {comments.map((comment) => (
                            <Box key={comment.id} sx={{ display: 'flex', mb: 2, gap: 1 }}>
                                <Avatar 
                                    src={getProfilePictureUrl(comment.user_profile_picture)}
                                    sx={{ width: 32, height: 32 }}
                                />
                                <Box sx={{ 
                                    bgcolor: '#F0F2F5',
                                    borderRadius: 3,
                                    p: 1.5,
                                    maxWidth: '80%'
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {comment.first_name} {comment.last_name}
                                    </Typography>
                                    <Typography variant="body2">{comment.content}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Add Comment Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1 }}>
                        <Avatar 
                            src={getProfilePictureUrl(currentUser.profile_picture)}
                            sx={{ width: 32, height: 32 }}
                        />
                        <Box
                            component="form"
                            onSubmit={handleAddComment}
                            sx={{
                                flex: 1,
                                bgcolor: '#F0F2F5',
                                borderRadius: 50,
                                display: 'flex',
                                alignItems: 'center',
                                p: 0.5,
                                pl: 2
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Write a comment..."
                                variant="standard"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CommentModal; 