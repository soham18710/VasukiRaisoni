import React, { useEffect, useState } from 'react';
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
  IconButton, 
  Chip, 
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  QrCode as QrCodeIcon, 
  Message as MessageIcon, 
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  CheckCircle as SafeIcon,
  Error as LostIcon,
  FileDownload as DownloadIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { getUserItems, updateItemStatus, deleteItem } from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getUserItems(user!.id);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleToggleStatus = async () => {
    if (!selectedItem) return;
    try {
      const newStatus = !selectedItem.is_lost;
      await updateItemStatus(selectedItem.id, newStatus);
      handleMenuClose();
      fetchItems(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    if (window.confirm(`Are you sure you want to delete "${selectedItem.item_name}"?`)) {
      try {
        await deleteItem(selectedItem.id);
        handleMenuClose();
        fetchItems(); // Refresh list
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Welcome Section */}
        <Grid size={{ xs: 12 }}>
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
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Explorer, Welcome Back!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage your {items.length} smart tags and track your belongings.
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
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>My Items</Typography>
            <Button size="small" sx={{ textTransform: 'none' }} onClick={fetchItems}>Refresh</Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : items.length > 0 ? (
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                  <Card sx={{ borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2, mr: 2, color: 'white' }}>
                          <QrCodeIcon />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>{item.item_name}</Typography>
                          <Typography variant="caption" color="text.secondary">ID: {item.qr_id}</Typography>
                        </Box>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, item)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          size="small" 
                          label={item.is_lost ? "Status: Lost" : "Status: Safe"} 
                          color={item.is_lost ? "error" : "success"}
                          variant="outlined"
                        />
                        <Chip 
                          size="small" 
                          label="History" 
                          icon={<LocationIcon sx={{ fontSize: '14px !important' }} />}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(0,0,0,0.02)', border: '1px dashed', borderColor: 'divider' }}>
              <QrCodeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No items registered yet.</Typography>
              <Button component={Link} to="/create-item" sx={{ mt: 2 }}>Register your first item</Button>
            </Paper>
          )}
        </Grid>

        {/* Sidebar/Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
          <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<MessageIcon />} 
                onClick={() => navigate('/messages')}
                sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
              >
                Messages Inbox
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<LocationIcon />} 
                sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
              >
                Recent Activity
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Support Findly</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upgrade to Premium for real-time GPS tracking and advanced security features.
            </Typography>
            <Button fullWidth variant="contained" color="secondary" sx={{ borderRadius: 2 }}>
              Upgrade Now
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Item Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: { borderRadius: 3, width: 200, mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
          }
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {selectedItem?.is_lost ? <SafeIcon fontSize="small" color="success" /> : <LostIcon fontSize="small" color="error" />}
          </ListItemIcon>
          <ListItemText>{selectedItem?.is_lost ? 'Mark as Safe' : 'Mark as Lost'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); alert('Download feature coming soon!'); }}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Download QR</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteItem} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete Item</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
