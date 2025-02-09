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
    Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { toast } from 'react-toastify';
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(formData);
            localStorage.setItem('token', response.data.token);
            toast.success('Registration successful!');  // Add this line
            navigate('/home');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');  // Add this line
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const isFormValid = Object.values(formData).every(value => value !== '');

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f0f2f5',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper 
                    elevation={2} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 2,
                        position: 'relative'
                    }}
                >
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
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 1,
                            fontWeight: 'bold'
                        }}
                    >
                        Sign Up
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: '#606770',
                            mb: 3
                        }}
                    >
                        It's quick and easy.
                    </Typography>
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
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: '#606770',
                                        display: 'block',
                                        mb: 1
                                    }}
                                >
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
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: '#606770',
                                        display: 'block',
                                        mb: 1
                                    }}
                                >
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
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: '#606770',
                                display: 'block',
                                mt: 2,
                                mb: 3,
                                fontSize: '11px'
                            }}
                        >
                            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
                            You may receive SMS notifications from us and can opt out at any time.
                        </Typography>
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
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isFormValid}
                                sx={{
                                    mt: 2,
                                    mb: 2,
                                    bgcolor: '#42b72a',
                                    '&:hover': {
                                        bgcolor: '#36a420'
                                    },
                                    py: 1.5,
                                    px: 6,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    '&.Mui-disabled': {
                                        bgcolor: '#e4e6eb',
                                        color: '#bcc0c4'
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
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