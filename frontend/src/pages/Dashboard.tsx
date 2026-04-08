import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Avatar,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  QrCode as QrCodeIcon, 
  Message as MessageIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
              color: 'white',
              borderRadius: 4
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="800" gutterBottom>
                Explorer, Welcome Back!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage your smart tags and track your belongings.
              </Typography>
              <Button 
                component={Link}
                to="/create-item"
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ 
                  mt: 3, 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: '#f1f5f9' },
                  px: 4,
                  py: 1.5,
                  borderRadius: 3
                }}
              >
                Register New Item
              </Button>
            </Box>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                border: '4px solid rgba(255,255,255,0.3)',
                mt: { xs: 3, md: 0 },
                display: { xs: 'none', sm: 'flex' }
              }}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
            />
          </Paper>
        </Grid>

        {/* Quick Stats/Actions */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="700">My Items</Typography>
            <Button size="small" sx={{ textTransform: 'none' }}>View All</Button>
          </Box>
          
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card sx={{ borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, mr: 2, color: 'white' }}>
                      <QrCodeIcon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">Keyring #{i}</Typography>
                      <Typography variant="body2" color="text.secondary">Last seen: 2 days ago</Typography>
                    </Box>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sidebar/Activity */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 2 }}>Quick Actions</Typography>
          <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<MessageIcon />} 
                sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
              >
                Messages (0)
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<NotificationsIcon />} 
                sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
              >
                Notifications
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<SearchIcon />} 
                sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
              >
                Search Shared Database
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>Support Findly</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upgrade to Premium for real-time GPS tracking and advanced security features.
            </Typography>
            <Button fullWidth variant="contained" color="secondary" sx={{ borderRadius: 2 }}>
              Upgrade Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
