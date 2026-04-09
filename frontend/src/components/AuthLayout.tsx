import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { QrCode as QrCodeIcon } from '@mui/icons-material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(63,128,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,77,255,0.1) 0%, transparent 60%), #0a0c10',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blurred orbs */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(63,128,255,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,77,255,0.12) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 3,
            textDecoration: 'none',
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #3f80ff 0%, #7c4dff 100%)',
              p: 1, borderRadius: 2, display: 'flex',
              boxShadow: '0 4px 20px rgba(63,128,255,0.4)',
            }}>
              <QrCodeIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography sx={{
              fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-0.02em',
              color: '#f0f6fc',
            }}>
              FINDLY
            </Typography>
          </Box>
        </Box>

        {/* Card */}
        <Box
          sx={{
            background: 'rgba(22, 27, 34, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #f0f6fc 0%, #8b949e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: '#8b949e' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
