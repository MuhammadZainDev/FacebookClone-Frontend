import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    IconButton, 
    InputBase, 
    Box, 
    Badge,
    Avatar,
    Tooltip,
    Tabs,
    Tab,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Paper
} from '@mui/material';
import { 
    Search as SearchIcon,
    Home as HomeIcon,
    OndemandVideo as VideoIcon,
    Storefront as MarketIcon,
    Groups as GroupsIcon,
    Menu as MenuIcon,
    Chat as ChatIcon,
    Notifications as NotificationsIcon,
    Apps as AppsIcon,
    Settings as SettingsIcon,
    HelpOutline as HelpIcon,
    DarkMode as DarkModeIcon,
    Feedback as FeedbackIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Facebook as FacebookIcon } from '@mui/icons-material';
import { getProfilePictureUrl } from '../utils/helpers';

const StyledSearch = styled('div')({
    position: 'relative',
    borderRadius: 50,
    backgroundColor: '#F0F2F5',
    '&:hover': {
        backgroundColor: '#E4E6E9'
    },
    marginLeft: 12,
    width: 240
});

const SearchIconWrapper = styled('div')({
    padding: '0 16px',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    color: '#65676B'
});

const StyledInputBase = styled(InputBase)({
    width: '100%',
    '& .MuiInputBase-input': {
        padding: '8px 8px 8px 40px',
        fontSize: 15,
        width: '100%',
        '&::placeholder': {
            color: '#65676B',
            opacity: 1,
        }
    },
});

const NavButton = styled(IconButton)(({ active }) => ({
    borderRadius: 8,
    padding: '0 44px',
    height: '100%',
    color: active ? '#1B74E4' : '#65676B',
    position: 'relative',
    '&:hover': {
        backgroundColor: '#F2F2F2'
    },
    '&::after': active ? {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#1B74E4',
        borderRadius: '3px 3px 0 0'
    } : {}
}));

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem('user')) || {});
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Set initial tab based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setActiveTab(0);
        else if (path === '/friends') setActiveTab(3);
    }, [location.pathname]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        if (newValue === 0) navigate('/');
        else if (newValue === 3) navigate('/friends');
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                bgcolor: 'white', 
                boxShadow: 'none',
                borderBottom: '1px solid #E4E6EB',
                height: 56,
                zIndex: 1200,
                overflow: 'hidden'
            }}
        >
            <Toolbar 
                disableGutters
                sx={{ 
                    px: '16px',
                    gap: 1,
                    height: '100%',
                    '&.MuiToolbar-root': {
                        minHeight: 'unset'
                    }
                }}
            >
                {/* Left */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: 320 }}>
                    <FacebookIcon sx={{ fontSize: 40, color: '#1877f2' }} />
                    <StyledSearch>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search Facebook"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </StyledSearch>
                </Box>

                {/* Center */}
                <Box sx={{ 
                    flex: 1,
                    display: 'flex', 
                    justifyContent: 'center',
                    height: '100%'
                }}>
                    <Tabs 
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                minWidth: 100,
                                height: 56,
                                color: '#65676B',
                                '&.Mui-selected': {
                                    color: '#1B74E4',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#1B74E4',
                                height: 3
                            }
                        }}
                    >
                        <Tab 
                            icon={<HomeIcon sx={{ fontSize: 28 }} />}
                            sx={{
                                '&.Mui-selected': {
                                    color: '#1B74E4',
                                }
                            }}
                        />
                        <Tab 
                            icon={<VideoIcon sx={{ fontSize: 28 }} />}
                        />
                        <Tab 
                            icon={<MarketIcon sx={{ fontSize: 28 }} />}
                        />
                        <Tab 
                            icon={<GroupsIcon sx={{ fontSize: 28 }} />}
                        />
                    </Tabs>
                </Box>

                {/* Right */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 320, justifyContent: 'flex-end' }}>
                    <Tooltip title="Menu">
                        <IconButton 
                            sx={{ 
                                bgcolor: '#E4E6E9',
                                '&:hover': { bgcolor: '#D8DADF' },
                                width: 40,
                                height: 40
                            }}
                        >
                            <AppsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Messenger">
                        <IconButton 
                            sx={{ 
                                bgcolor: '#E4E6E9',
                                '&:hover': { bgcolor: '#D8DADF' },
                                width: 40,
                                height: 40
                            }}
                        >
                            <Badge badgeContent={4} color="error">
                                <ChatIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Notifications">
                        <IconButton 
                            sx={{ 
                                bgcolor: '#E4E6E9',
                                '&:hover': { bgcolor: '#D8DADF' },
                                width: 40,
                                height: 40
                            }}
                        >
                            <Badge badgeContent={2} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Account">
                        <IconButton onClick={handleProfileClick}>
                            <Avatar 
                                src={getProfilePictureUrl(user.profile_picture)}
                                sx={{ 
                                    width: 40, 
                                    height: 40,
                                    '&:hover': { opacity: 0.9 }
                                }} 
                            />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        sx: {
                            mt: 1.5,
                            width: 360,
                            borderRadius: 3,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
                        }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => navigate('/profile')} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar 
                                src={getProfilePictureUrl(user.profile_picture)}
                                sx={{ width: 60, height: 60, mr: 2 }}
                            />
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {user.first_name} {user.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    See your profile
                                </Typography>
                            </Box>
                        </Box>
                    </MenuItem>
                    
                    <Divider />
                    
                    <MenuItem sx={{ p: 1.5 }}>
                        <SettingsIcon sx={{ mr: 2 }} />
                        <Typography>Settings & privacy</Typography>
                    </MenuItem>
                    
                    <MenuItem sx={{ p: 1.5 }}>
                        <HelpIcon sx={{ mr: 2 }} />
                        <Typography>Help & support</Typography>
                    </MenuItem>
                    
                    <MenuItem sx={{ p: 1.5 }}>
                        <DarkModeIcon sx={{ mr: 2 }} />
                        <Typography>Display & accessibility</Typography>
                    </MenuItem>
                    
                    <MenuItem sx={{ p: 1.5 }}>
                        <FeedbackIcon sx={{ mr: 2 }} />
                        <Typography>Give feedback</Typography>
                    </MenuItem>
                    
                    <MenuItem onClick={handleLogout} sx={{ p: 1.5 }}>
                        <LogoutIcon sx={{ mr: 2 }} />
                        <Typography>Log Out</Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;