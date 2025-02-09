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
    OndemandVideo as VideoIcon,
    History as HistoryIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Star as StarIcon,
    Flag as FlagIcon,
    Event as EventIcon,
    SportsEsports as GamesIcon,
    People as PeopleIcon,
    Restore as RestoreIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';

const LeftSidebar = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

    const menuItems = [
        { 
            icon: <Avatar src={user.profile_picture} />, 
            text: fullName,
            primary: true
        },
        { 
            icon: <PeopleIcon sx={{ color: '#1877F2' }} />, 
            text: 'Friends',
            badge: '5 new'
        },
        { 
            icon: <RestoreIcon sx={{ color: '#1877F2' }} />, 
            text: 'Memories' 
        },
        { 
            icon: <BookmarkIcon sx={{ color: '#8C939D' }} />, 
            text: 'Saved' 
        },
        { 
            icon: <GroupIcon sx={{ color: '#8C939D' }} />, 
            text: 'Groups',
            badge: '3 new'
        },
        { 
            icon: <VideoIcon sx={{ color: '#8C939D' }} />, 
            text: 'Video' 
        },
        { 
            icon: <StoreIcon sx={{ color: '#8C939D' }} />, 
            text: 'Marketplace',
            badge: '2 new'
        },
        { 
            icon: <EventIcon sx={{ color: '#8C939D' }} />, 
            text: 'Events' 
        },
        { 
            icon: <GamesIcon sx={{ color: '#8C939D' }} />, 
            text: 'Gaming' 
        },
        { 
            icon: <FlagIcon sx={{ color: '#8C939D' }} />, 
            text: 'Pages' 
        },
        { 
            icon: <SettingsIcon sx={{ color: '#8C939D' }} />, 
            text: 'Settings' 
        }
    ];

    const shortcuts = [
        { text: 'Web Development Group', icon: '/group1.jpg' },
        { text: 'React JS Developers', icon: '/group2.jpg' },
        { text: 'UI/UX Design', icon: '/group3.jpg' }
    ];

    return (
        <Box
            sx={{
                width: 320,
                height: 'calc(100vh - 56px)',
                overflowY: 'auto',
                bgcolor: '#f0f2f5',
                '&::-webkit-scrollbar': {
                    width: 8,
                    display: 'none'
                },
                '&:hover': {
                    '&::-webkit-scrollbar': {
                        display: 'block'
                    }
                }
            }}
        >
            <List sx={{ pt: 2, pb: 1 }}>
                {menuItems.map((item, index) => (
                    <ListItem 
                        button 
                        key={index}
                        sx={{
                            borderRadius: 2,
                            mx: 1,
                            mb: 0.5,
                            height: 44,
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.05)'
                            },
                            '& .MuiListItemText-root': {
                                overflow: 'hidden'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={
                                <Typography 
                                    sx={{ 
                                        fontWeight: item.primary ? 600 : 400,
                                        fontSize: 15,
                                        color: '#050505',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {item.text}
                                </Typography>
                            }
                        />
                        {item.badge && (
                            <Typography
                                sx={{
                                    color: '#1877F2',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {item.badge}
                            </Typography>
                        )}
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
                        mb: 1
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
                                height: 44,
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.05)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <Avatar 
                                    src={shortcut.icon} 
                                    variant="rounded"
                                    sx={{ width: 28, height: 28 }}
                                />
                            </ListItemIcon>
                            <ListItemText 
                                primary={
                                    <Typography 
                                        sx={{ 
                                            fontSize: 15,
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
                px: 2, 
                pb: 2,
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
                        lineHeight: 1.2,
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