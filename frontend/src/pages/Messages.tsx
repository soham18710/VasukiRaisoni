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
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Message as MessageIcon, 
  Inventory as InventoryIcon, 
  CalendarMonth as DateIcon,
  Person as PersonIcon,
  DeleteSweep as SpamIcon,
  CheckCircle as ValidIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { getUserMessages } from '../services/api';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

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

  const activeMessages = messages.filter(msg => msg.items?.is_lost === true);
  const spamMessages = messages.filter(msg => msg.items?.is_lost !== true);

  const currentMessages = tabValue === 0 ? activeMessages : spamMessages;

  const renderMessageList = (msgList: any[]) => {
    if (msgList.length === 0) {
      return (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(0,0,0,0.01)', border: '1px dashed', borderColor: 'divider' }}>
          {tabValue === 0 ? <MessageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} /> : <SpamIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />}
          <Typography variant="h6" color="text.secondary">
            {tabValue === 0 ? "No active messages" : "No messages in spam"}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {tabValue === 0 ? "When someone finds a lost item, their messages appear here." : "Messages for items marked as 'Safe' are moved here automatically."}
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {msgList.map((msg, index) => (
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
                  <Avatar sx={{ bgcolor: tabValue === 0 ? 'primary.main' : 'text.disabled' }}>
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
                        color={tabValue === 0 ? "primary" : "default"}
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
              {index < msgList.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }} color="primary" gutterBottom>
          Inbox
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your communications with finders.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} aria-label="message tabs">
          <Tab 
            icon={<ValidIcon />} 
            iconPosition="start" 
            label={`Lost Items (${activeMessages.length})`} 
            sx={{ fontWeight: 700 }}
          />
          <Tab 
            icon={<SpamIcon />} 
            iconPosition="start" 
            label={`Spam / Safe Items (${spamMessages.length})`} 
            sx={{ fontWeight: 700 }}
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : renderMessageList(currentMessages)}
    </Container>
  );
};

export default Messages;
