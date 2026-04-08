import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import { supabase } from '../services/supabase';
import AuthLayout from '../components/AuthLayout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to manage your smart tags and lost items"
    >
      <form onSubmit={handleLogin}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
            sx={{ 
              py: 1.5, 
              borderRadius: 2,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none', 
                  fontWeight: 'bold' 
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default Login;
