import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AuthGuard from './components/AuthGuard';
import Friends from './components/Friends';
import Profile from './components/Profile';
import VideoFeed from './components/VideoFeed';
import AdditionalInfoForm from './components/AdditionalInfoForm';

const GOOGLE_CLIENT_ID = "169092126098-8ii9ired5jh9okiqeq7h3gf3qkp2kakp.apps.googleusercontent.com"; // Replace with your actual Google Client ID

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/"
                        element={
                            <AuthGuard>
                                <Home />
                            </AuthGuard>
                        }
                    />
                    <Route 
                        path="/friends" 
                        element={
                            <AuthGuard>
                                <Friends />
                            </AuthGuard>
                        } 
                    />
                    <Route
                        path="/profile"
                        element={
                            <AuthGuard>
                                <Profile />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/videos"
                        element={
                            <AuthGuard>
                                <VideoFeed />
                            </AuthGuard>
                        }
                    />
                </Routes>
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </GoogleOAuthProvider>
    );
}

export default App;