import React from 'react';
import { 
    Box, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Avatar,
    Typography,
    Divider
} from '@mui/material';
import {
    Group as GroupIcon,
    Bookmark as BookmarkIcon,
    Store as StoreIcon,
    History as HistoryIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Star as StarIcon,
    Flag as FlagIcon,
    Event as EventIcon,
    SportsEsports as GamesIcon,
    People as PeopleIcon,
    Restore as RestoreIcon,
    Settings as SettingsIcon,
    VideoLibrary as VideoIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const LeftSidebar = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { 
            icon: <PeopleIcon sx={{ color: '#1B74E4', fontSize: 28 }} />, 
            text: 'Friends',
            path: '/friends'
        },
        { 
            icon: <RestoreIcon sx={{ color: '#1B74E4', fontSize: 28 }} />, 
            text: 'Memories',
            path: '/memories'
        },
        { 
            icon: <BookmarkIcon sx={{ color: '#8C939D', fontSize: 28 }} />, 
            text: 'Saved',
            path: '/saved'
        },
        { 
            icon: <GroupIcon sx={{ color: '#8C939D', fontSize: 28 }} />, 
            text: 'Groups',
            path: '/groups'
        },
        { 
            icon: <VideoIcon sx={{ color: '#1B74E4', fontSize: 28 }}/>,
            text: 'Videos',
            path: '/videos'
        },
        { 
            icon: <EventIcon sx={{ color: '#8C939D', fontSize: 28 }} />, 
            text: 'Events',
            path: '/events'
        },
        { 
            icon: <GamesIcon sx={{ color: '#8C939D', fontSize: 28 }} />, 
            text: 'Gaming',
            path: '/gaming'
        },
        { 
            icon: <FlagIcon sx={{ color: '#8C939D', fontSize: 28 }} />, 
            text: 'Pages',
            path: '/pages'
        },
        { 
            icon: <SettingsIcon sx={{ color: '#8C939D', fontSize: 28 }} />, 
            text: 'Settings',
            path: '/settings'
        }
    ];

    const shortcuts = [
        { text: 'Web Development Group', icon: '/group1.jpg' },
        { text: 'React JS Developers', icon: '/group2.jpg' },
        { text: 'UI/UX Design', icon: '/group3.jpg' }
    ];

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <Box
            sx={{
                width: 320,
                height: 'calc(100vh - 56px)',
                overflowY: 'auto',
                bgcolor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none'
                }
            }}
        >
            <List sx={{ pt: 2, pb: 1 }}>
                {menuItems.map((item, index) => (
                    <ListItem 
                        button 
                        key={index}
                        onClick={() => handleNavigation(item.path)}
                        selected={location.pathname === item.path}
                        sx={{
                            mx: 1,
                            mb: 0.5,
                            height: 52,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.05)',
                                transform: 'translateX(4px)'
                            },
                            '&.Mui-selected': {
                                bgcolor: 'rgba(24, 119, 242, 0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(24, 119, 242, 0.15)'
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 52 }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={
                                <Typography 
                                    sx={{ 
                                        fontWeight: location.pathname === item.path ? 600 : 500,
                                        fontSize: 15,
                                        color: location.pathname === item.path ? '#1B74E4' : '#050505',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {item.text}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 1, mx: 2 }} />

            <Box sx={{ px: 2, pb: 2 }}>
                <Typography
                    sx={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: '#65676B',
                        mb: 2,
                        px: 1
                    }}
                >
                    Your shortcuts
                </Typography>
                <List>
                    {shortcuts.map((shortcut, index) => (
                        <ListItem 
                            button 
                            key={index}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                height: 52,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 52 }}>
                                <Avatar 
                                    src={shortcut.icon} 
                                    variant="rounded"
                                    sx={{ 
                                        width: 36, 
                                        height: 36,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText 
                                primary={
                                    <Typography 
                                        sx={{ 
                                            fontSize: 15,
                                            fontWeight: 500,
                                            color: '#050505',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {shortcut.text}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ 
                px: 3, 
                pb: 3,
                '& .MuiTypography-root': {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                }
            }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: '#65676B',
                        fontSize: 13,
                        lineHeight: 1.4,
                        display: 'block',
                        mb: 2
                    }}
                >
                    Privacy · Terms · Advertising · Ad choices · Cookies · More · Meta © 2024
                </Typography>
            </Box>
        </Box>
    );
};

export default LeftSidebar;