import React, { useState } from 'react';
import { 
    Box, 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Divider,
    Paper,
    Grid
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Log the request data
            console.log('Attempting login with:', formData);

            const response = await login(formData);
            
            // Log the response
            console.log('Login response:', response);

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                
                // Make sure user data exists before storing
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify({
                        first_name: response.data.user.first_name || '',
                        last_name: response.data.user.last_name || '',
                        profile_picture: response.data.user.profile_picture || '',
                        email: response.data.user.email || ''
                    }));
                }

                toast.success('Login successful!');
                navigate('/');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            
            // More specific error messages
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (err.response.status === 401) {
                    setError('Invalid email or password');
                    toast.error('Invalid email or password');
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                    toast.error(err.response.data.message);
                } else {
                    setError('Login failed. Please try again.');
                    toast.error('Login failed. Please try again.');
                }
            } else if (err.request) {
                // The request was made but no response was received
                setError('Network error. Please check your connection.');
                toast.error('Network error. Please check your connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('An error occurred. Please try again.');
                toast.error('An error occurred. Please try again.');
            }
        }
    };

    const isFormValid = formData.email && formData.password;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f0f2f5',
                py: 8,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ pr: { md: 8 }, mb: { xs: 4, md: 0 } }}>
                            <Typography
                                component="h1"
                                variant="h3"
                                sx={{ 
                                    color: '#1877f2',
                                    fontWeight: 'bold',
                                    mb: 2
                                }}
                            >
                                facebook
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{ 
                                    color: '#1c1e21',
                                    pr: { md: 8 }
                                }}
                            >
                                Facebook helps you connect and share with the people in your life.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 4, 
                                borderRadius: 2,
                                boxShadow: '0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)'
                            }}
                        >
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    placeholder="Email address or phone number"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                                {error && (
                                    <Typography 
                                        color="error" 
                                        sx={{ 
                                            mt: 1,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {error}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={!isFormValid}
                                    sx={{ 
                                        mt: 3, 
                                        mb: 2,
                                        bgcolor: '#1877f2',
                                        '&:hover': {
                                            bgcolor: '#166fe5'
                                        },
                                        py: 1.5,
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        '&.Mui-disabled': {
                                            bgcolor: '#e4e6eb',
                                            color: '#bcc0c4'
                                        }
                                    }}
                                >
                                    Log in
                                </Button>
                                <Typography 
                                    component={Link} 
                                    to="#" 
                                    sx={{ 
                                        textAlign: 'center', 
                                        display: 'block',
                                        color: '#1877f2',
                                        textDecoration: 'none',
                                        mb: 2,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Forgotten password?
                                </Typography>
                                <Divider sx={{ my: 3 }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Button
                                        component={Link}
                                        to="/signup"
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#42b72a',
                                            '&:hover': {
                                                bgcolor: '#36a420'
                                            },
                                            py: 1.5,
                                            px: 3,
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            borderRadius: 2
                                        }}
                                    >
                                        Create new account
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                        <Typography 
                            sx={{ 
                                mt: 2, 
                                textAlign: 'center',
                                fontSize: '0.9rem'
                            }}
                        >
                            <Link 
                                to="#" 
                                style={{ 
                                    color: '#1c1e21',
                                    textDecoration: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                Create a Page
                            </Link>
                            {' for a celebrity, brand or business.'}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Login;