import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  IconButton, 
  CircularProgress
} from '@mui/material';
import { 
  Send as SendIcon, 
  ArrowBack as BackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMessageThread, sendMessage, markMessagesRead } from '../services/api';

const Chat: React.FC = () => {
  const { userId, itemId } = useParams<{ userId: string, itemId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (user && userId && itemId) {
      fetchThread();
      const interval = setInterval(fetchThread, 5000); // Poll every 5s for hackathon
      return () => clearInterval(interval);
    }
  }, [user, userId, itemId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThread = async () => {
    try {
      const data = await getMessageThread(user!.id, userId!, itemId!);
      setMessages(data);
      
      // If no messages yet, pre-fill with item info
      if (data.length === 0 && !newMessage) {
        setNewMessage(`Hey, I found your item [${itemId}]. Let's coordinate the return!`);
      }

      // Mark incoming messages as read
      const hasUnread = data.some((m: any) => m.receiver_id === user!.id && !m.is_read);
      if (hasUnread) {
        await markMessagesRead(user!.id, userId!, itemId!);
      }
    } catch (error) {
      console.error('Error fetching thread:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage({
        item_id: itemId!,
        sender_id: user!.id,
        sender_name: user?.user_metadata?.full_name || user?.email || 'Me',
        message_text: newMessage,
        receiver_id: userId!
      });
      setNewMessage('');
      fetchThread();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}>
        <IconButton onClick={() => navigate('/messages')}>
          <BackIcon />
        </IconButton>
        <Avatar />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Chat regarding Item
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Secure One-to-One Channel
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ 
        flexGrow: 1, 
        mb: 2, 
        p: 2, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1,
        borderRadius: 4,
        bgcolor: 'rgba(0,0,0,0.01)'
      }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <Box 
              key={msg.id}
              sx={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                gap: 1,
                flexDirection: isMe ? 'row-reverse' : 'row'
              }}
            >
              <Avatar sx={{ width: 24, height: 24, mt: 1, display: { xs: 'none', sm: 'flex' } }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box>
                <Paper sx={{ 
                  p: 1.5, 
                  px: 2,
                  bgcolor: isMe ? 'primary.main' : 'white',
                  color: isMe ? 'white' : 'text.primary',
                  borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="body2">{msg.message_text}</Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: isMe ? 'right' : 'left', px: 1 }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Paper>

      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              sx: { borderRadius: 3 }
            }
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={!newMessage.trim() || sending}
          sx={{ borderRadius: 3, minWidth: '48px', px: 2 }}
        >
          {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        </Button>
      </Box>
    </Container>
  );
};

export default Chat;
