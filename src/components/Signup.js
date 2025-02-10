import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    IconButton,
    Link,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdditionalInfoForm from './AdditionalInfoForm';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: '',
        gender: ''
    });
    const [error, setError] = useState('');
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [googleData, setGoogleData] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            console.log('Google response:', credentialResponse);
            
            // First, verify the Google token on your backend
            const verifyResponse = await axios.post('http://localhost:5000/api/auth/google-verify', {
                token: credentialResponse.credential
            });

            console.log('Verify response:', verifyResponse.data);

            const { isNewUser, userData, token, user } = verifyResponse.data;

            if (isNewUser) {
                // Log the data we're about to send
                console.log('About to send signup data:', userData);
                
                // Make sure we're sending the exact data structure the backend expects
                const signupData = {
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName || ' ',  // Provide a space if lastName is empty
                    profilePicture: userData.profilePicture
                };

                console.log('Sending signup data:', signupData);
                
                // Directly create user with Google data
                const signupResponse = await axios.post(
                    'http://localhost:5000/api/auth/complete-google-signup', 
                    signupData
                );

                console.log('Signup response:', signupResponse.data);

                if (signupResponse.data.success) {
                    localStorage.setItem('token', signupResponse.data.token);
                    localStorage.setItem('user', JSON.stringify(signupResponse.data.user));
                    toast.success('Successfully signed up with Google!');
                    setTimeout(() => navigate('/'), 100);
                } else {
                    throw new Error(signupResponse.data.message);
                }
            } else {
                // Existing user - log them in directly
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Successfully logged in with Google!');
                setTimeout(() => navigate('/'), 100);
            }
        } catch (error) {
            console.error('Google auth error details:', {
                error: error.response?.data || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            toast.error(error.response?.data?.message || error.message || 'Google authentication failed');
        }
    };

    const handleGoogleError = () => {
        toast.error('Google sign in was unsuccessful');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Registration successful!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    if (showAdditionalInfo) {
        return <AdditionalInfoForm googleData={googleData} />;
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', py: 4 }}>
            <Container maxWidth="sm">
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2, position: 'relative' }}>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: '#606770'
                        }}
                        onClick={() => navigate('/')}
                    >
                        <CloseIcon />
                    </IconButton>
                    
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Sign Up
                    </Typography>
                    <Typography sx={{ color: '#606770', mb: 3 }}>
                        It's quick and easy.
                    </Typography>

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 3 
                    }}>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: 300,
                                position: 'relative'
                            }}
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                size="large"
                                width="300"
                                text="signup_with"
                                shape="rectangular"
                                logo_alignment="center"
                                theme="outline"
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }}>
                        <Typography sx={{ color: '#606770', px: 2 }}>or</Typography>
                    </Divider>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: '#f5f6f7'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: '#f5f6f7'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="email"
                                    placeholder="Email address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: '#f5f6f7'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    placeholder="New password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: '#f5f6f7'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: '#606770', display: 'block', mb: 1 }}>
                                    Date of birth
                                </Typography>
                                <TextField
                                    required
                                    fullWidth
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: '#f5f6f7'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: '#606770', display: 'block', mb: 1 }}>
                                    Gender
                                </Typography>
                                <FormControl 
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: '#f5f6f7'
                                        }
                                    }}
                                >
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="">Select gender</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="custom">Custom</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Typography variant="caption" sx={{ color: '#606770', display: 'block', mt: 2, mb: 3, fontSize: '11px' }}>
                            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
                            You may receive SMS notifications from us and can opt out at any time.
                        </Typography>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: '#00a400',
                                '&:hover': {
                                    bgcolor: '#009400'
                                },
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                py: 1.5,
                                borderRadius: 2
                            }}
                        >
                            Sign Up
                        </Button>

                        {error && (
                            <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Link 
                                href="/login" 
                                sx={{ 
                                    color: '#1877f2',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Already have an account?
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup;