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
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 2,
    color: '#f0f6fc',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(63,128,255,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#3f80ff', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': { color: '#8b949e' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3f80ff' },
  '& .MuiInputAdornment-root svg': { color: '#8b949e', fontSize: 20 },
};

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {error && (
            <Alert
              severity="error"
              sx={{
                bgcolor: 'rgba(211,47,47,0.12)',
                color: '#ff6b6b',
                border: '1px solid rgba(211,47,47,0.3)',
                borderRadius: 2,
                '& .MuiAlert-icon': { color: '#ff6b6b' },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
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
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
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
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#8b949e', '&:hover': { color: '#f0f6fc' } }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
            endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #3f80ff 0%, #7c4dff 100%)',
              boxShadow: '0 4px 20px rgba(63,128,255,0.35)',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(63,128,255,0.5)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': { opacity: 0.6 },
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', my: 0.5 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#8b949e' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#3f80ff',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                Sign In →
              </Link>
            </Typography>
          </Box>

        </Box>
      </form>
    </AuthLayout>
  );
};

export default Signup;
