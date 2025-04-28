import React, { useMemo, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CssBaseline,
  createTheme,
  ThemeProvider
} from '@mui/material';
import PointCloudViewer from './components/PointCloudViewer';
import { useWebSocketData } from './hooks/useWebSocketData';

function App() {
  const { points, image1, image2, frame, socket } = useWebSocketData('ws://localhost:8000/ws');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && socket?.readyState === WebSocket.OPEN) {
        socket.send('toggle_pause');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [socket]);

  const [mode, setMode] = React.useState('light');

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === 'light' ? '#fafafa' : '#121212',
            paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
          },
          primary: {
            main: '#1976d2',
          },
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            width: '80%',
            height: '85%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {/* HEADER */}
          <Container maxWidth="xl" sx={{ flexGrow: 0, px: 0, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1" fontWeight="bold">
                Railways Viz
              </Typography>
              <Button variant="contained" onClick={toggleTheme}>
                Tema: {mode === 'light' ? 'Chiaro' : 'Scuro'}
              </Button>
            </Box>

            <Typography variant="subtitle2" align="center" color="text.secondary" mt={1}>
              Frame corrente: {frame}
            </Typography>
          </Container>

          {/* CONTENUTO PRINCIPALE */}
          <Paper
            elevation={4}
            sx={{
              flexGrow: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2,
              bgcolor: 'background.paper',
              border: '2px solid #1976d2',  // Bordo visibile e colorato (usa il colore primario)
              borderRadius: 4,  // Angoli arrotondati
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',  // Ombra più marcata per il risalto
            }}
          >
            {/* COLONNA SINISTRA: IMMAGINI */}
            <Box
              sx={{
                width: '65%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflowY: 'auto',
                pr: 1,
              }}
            >
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {image1 ? (
                  <Box display="flex" justifyContent="center" sx={{ flexGrow: 1, alignItems: 'center' }}>
                    <img
                      src={`data:image/png;base64,${image1}`}
                      alt="Immagine 1"
                      style={{
                        width: 'auto',
                        height: '100%',
                        objectFit: 'contain', // Rende l'immagine scalabile mantenendo le proporzioni
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                ) : (
                  <Typography align="center" color="text.secondary">
                    Caricamento immagine 1...
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="h6" align="center">
                    Immagine 1
                  </Typography>
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {image2 ? (
                  <Box display="flex" justifyContent="center" sx={{ flexGrow: 1, alignItems: 'center' }}>
                    <img
                      src={`data:image/png;base64,${image2}`}
                      alt="Immagine 2"
                      style={{
                        width: 'auto',
                        height: '100%',
                        objectFit: 'contain', // Rende l'immagine scalabile mantenendo le proporzioni
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                ) : (
                  <Typography align="center" color="text.secondary">
                    Caricamento immagine 2...
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="h6" align="center">
                    Immagine 2
                  </Typography>
                </Box>
              </Paper>
            </Box>



            {/* COLONNA DESTRA: NUVOLA DI PUNTI */}
            <Box
              sx={{
                width: '35%',
                height: '100%',
                pl: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  flexGrow: 1,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  bgcolor: 'background.default',
                  borderRadius: 3,
                }}
              >
                <Typography variant="h6" align="center" mb={2}>
                  Nuvola di punti
                </Typography>

                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <PointCloudViewer frame={frame} points={points} />
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
