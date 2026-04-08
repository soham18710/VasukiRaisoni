import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Message as MessageIcon, 
  Inventory as InventoryIcon, 
  CalendarMonth as DateIcon,
  Person as PersonIcon 
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { getUserMessages } from '../services/api';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getUserMessages(user!.id);
      setMessages(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }} color="primary" gutterBottom>
          Messages
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Finders who found your items will reach out to you here.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : messages.length > 0 ? (
        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <ListItem 
                  alignItems="flex-start" 
                  sx={{ 
                    p: 3, 
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' },
                    transition: 'background 0.2s'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {msg.sender_name}
                          </Typography>
                          {msg.sender_id && (
                            <Chip label="Verified User" size="small" color="success" variant="filled" sx={{ height: 20, fontSize: '10px' }} />
                          )}
                        </Box>
                        <Chip 
                          icon={<InventoryIcon sx={{ fontSize: '14px !important' }} />} 
                          label={msg.items?.item_name || 'Deleted Item'} 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ display: 'block', mb: 1 }}
                        >
                          {msg.message_text}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DateIcon sx={{ fontSize: 14 }} /> {new Date(msg.created_at).toLocaleDateString()}
                          </Typography>
                          {msg.sender_email && (
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                              Contact: {msg.sender_email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(0,0,0,0.02)', border: '1px dashed', borderColor: 'divider' }}>
          <MessageIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>No messages yet</Typography>
          <Typography variant="body1" color="text.disabled">
            When someone scans your lost item and sends a message, it will appear here.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Messages;
