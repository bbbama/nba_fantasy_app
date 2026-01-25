import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#002D62', // Deeper, NBA-inspired blue
    },
    secondary: {
      main: '#C8102E', // Strong, NBA-inspired red accent
    },
    background: {
      default: '#0F172A', // Corresponds to slate-900 for the body/default background
      paper: '#1E293B',   // Corresponds to slate-800 for card/paper backgrounds
    },
  },
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        h4: {
          fontWeight: 700, // Bolder for page main titles
        },
        h5: {
          fontWeight: 700, // Bolder for section titles
        },
        h6: {
          fontWeight: 700, // Make h6 bolder
        },
        body1: {
          lineHeight: 1.6, // Improved readability for general text
        },
        body2: {
          lineHeight: 1.6, // Improved readability for secondary text
        },
      },  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Możesz dodać tutaj niestandardowe style dla AppBar,
          // ale na razie polegamy na 'primary.main'
        },
      },
    },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8, // Slightly more rounded corners
                '&:hover': {
                  opacity: 0.9, // Subtle hover effect
                },
              },
            },
          },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': { color: 'white' }, // Ensure label is white
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, // Ensure border is white
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#002D62' }, // Use primary.main for focus border
          '& .MuiInputBase-input': { color: 'white' }, // Input text color
          '& .MuiSvgIcon-root': { color: 'white' }, // Icon color inside TextField
        },
      },
    },
    // Możesz dodać więcej komponentów do stylizacji
  },
});

export default theme;
