import React, { useState } from 'react';
import { 
    Box, 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Divider,
    Paper,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import axios from 'axios';

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

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Verify the Google token on your backend
            const response = await axios.post('http://localhost:5000/api/auth/google-verify', {
                token: credentialResponse.credential
            });

            const { isNewUser, userData, token, user } = response.data;

            if (isNewUser) {
                // Directly create user with Google data
                const signupResponse = await axios.post('http://localhost:5000/api/auth/complete-google-signup', userData);
                localStorage.setItem('token', signupResponse.data.token);
                localStorage.setItem('user', JSON.stringify(signupResponse.data.user));
                toast.success('Successfully signed up with Google!');
                setTimeout(() => navigate('/'), 100);
            } else {
                // Existing user - log them in directly
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Successfully logged in with Google!');
                setTimeout(() => navigate('/'), 100);
            }
        } catch (error) {
            console.error('Google auth error:', error);
            toast.error('Google authentication failed. Please try again.');
        }
    };

    const handleGoogleError = () => {
        toast.error('Google sign in was unsuccessful');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const isFormValid = formData.email && formData.password;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', py: 8 }}>
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" sx={{ color: '#1877f2', fontWeight: 'bold', mb: 2 }}>
                        facebook
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1c1e21' }}>
                        Connect with friends and the world around you on Facebook.
                    </Typography>
                </Box>

                <Paper elevation={2} sx={{ p: 4, borderRadius: 2, boxShadow: '0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)' }}>
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        
                        {error && (
                            <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
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
                                '&:hover': { bgcolor: '#166fe5' },
                                py: 1.5,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                borderRadius: 2
                            }}
                        >
                            Log in
                        </Button>

                        <Divider sx={{ my: 2 }}>
                            <Typography sx={{ color: '#96999E', px: 1 }}>or</Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                size="large"
                                theme="filled_blue"
                                shape="rectangular"
                                width="300"
                                useOneTap={true}
                                cookiePolicy={'single_host_origin'}
                            />
                        </Box>

                        <Typography 
                            component={Link} 
                            href="#" 
                            sx={{ 
                                textAlign: 'center', 
                                display: 'block',
                                color: '#1877f2',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Forgotten password?
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/signup')}
                                sx={{
                                    bgcolor: '#42b72a',
                                    '&:hover': { bgcolor: '#36a420' },
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
            </Container>
        </Box>
    );
};

export default Login;