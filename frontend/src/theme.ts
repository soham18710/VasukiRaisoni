import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f80ff', // Vibrant blue
      light: '#6699ff',
      dark: '#0052cc',
    },
    secondary: {
      main: '#7c4dff', // Deep purple
    },
    background: {
      default: '#0a0c10', // Near black
      paper: '#161b22',   // Github-like dark gray
    },
    text: {
      primary: '#f0f6fc',
      secondary: '#8b949e',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: any }) => ({
          borderRadius: 10,
          padding: '10px 20px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          },
          ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
            background: 'linear-gradient(135deg, #3f80ff 0%, #7c4dff 100%)',
            boxShadow: '0 4px 14px 0 rgba(63, 128, 255, 0.39)',
            border: 'none',
          }),
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161b22',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0a0c10', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
      },
    },
  },
});

export default theme;
