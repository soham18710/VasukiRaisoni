import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  QrCode as QrCodeIcon, 
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await signOut();
    navigate('/login');
  };

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage && !user) return null;

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <QrCodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'text.primary',
              textDecoration: 'none',
            }}
          >
            FINDLY
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, gap: 1 }}>
            {user && (
              <>
                <Button
                  component={Link}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                  sx={{ color: location.pathname === '/dashboard' ? 'primary.main' : 'text.secondary', textTransform: 'none' }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/create-item"
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1, textTransform: 'none', borderRadius: 2, display: { xs: 'none', sm: 'flex' } }}
                >
                  Register Item
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, border: '2px solid', borderColor: 'primary.light' }}>
                    <Avatar alt={user.email} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} sx={{ width: 32, height: 32 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {user.user_metadata?.full_name || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20, color: 'error.main' }} /> 
                    <Typography color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={Link} to="/login" sx={{ textTransform: 'none' }}>Login</Button>
                <Button component={Link} to="/signup" variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }}>Sign Up</Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
