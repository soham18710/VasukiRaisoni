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
  Person as PersonIcon,
  Visibility, 
  VisibilityOff,
  PersonAdd as PersonAddIcon 
} from '@mui/icons-material';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      setError('An account with this email already exists. Please sign in.');
      setLoading(false);
      return;
    }

    // Insert new user into public.users table
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, full_name: name, password_hash: password }])
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Save to localStorage and context
    setUser({ id: newUser.id, email: newUser.email, full_name: newUser.full_name });
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <AuthLayout 
      title="Join Findly" 
      subtitle="Start protecting your valuable items today"
    >
      <form onSubmit={handleSignup}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

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
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
            sx={{ 
              py: 1.5, 
              borderRadius: 2,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none', 
                  fontWeight: 'bold' 
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default Signup;
