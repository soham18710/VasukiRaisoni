import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Inventory as InventoryIcon, 
  Description as DescriptionIcon, 
  AddPhotoAlternate as ImageIcon, 
  AutoAwesome as SparklesIcon 
} from '@mui/icons-material';
import { createItem, generateQR } from '../services/api';
import QRPreview from '../components/QRPreview';
import { useAuth } from '../hooks/useAuth';

const CreateItem: React.FC = () => {
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to create an item.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setQrImage(null);

    try {
      const itemData = {
        ...formData,
        user_id: user.id
      };

      // 1. Create item in DB
      const itemResponse = await createItem(itemData);
      
      // 2. Generate QR for the item
      const qrResponse = await generateQR({
        item_id: itemResponse.id,
        qr_id: itemResponse.qr_id
      });

      setQrImage(qrResponse.qr_image);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create item and generate QR. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" color="primary" gutterBottom>
          Register New Item
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Fill in the details to generate your unique smart QR tag.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="item_name"
                  required
                  placeholder="e.g. Blue Backpack, My Keys"
                  value={formData.item_name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InventoryIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  placeholder="Add any helpful details for the finder..."
                  value={formData.description}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', mt: 1.5, alignSelf: 'flex-start' }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Image URL (Optional)"
                  name="image_url"
                  placeholder="https://example.com/item.jpg"
                  value={formData.image_url}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SparklesIcon />}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1d4ed8 0%, #6d28d9 100%)',
                    }
                  }}
                >
                  {loading ? 'Generating...' : 'Generate Smart Tag'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <QRPreview qrImageBase64={qrImage || ''} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateItem;
