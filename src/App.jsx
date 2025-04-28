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
          primary: {
            main: '#1976d2',
          },
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
          alignItems: 'center', // <-- centra orizzontalmente
          p: 2,
          boxSizing: 'border-box'
        }}
      >
        <Box
          sx={{
            width: '70%', // <-- solo il 70% della larghezza
            height: '70%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HEADER */}
          <Container maxWidth="xl" sx={{ flexGrow: 0, px: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" component="h1">
                Railways Viz
              </Typography>
              <Button variant="outlined" onClick={toggleTheme}>
                Tema: {mode === 'light' ? 'Chiaro' : 'Scuro'}
              </Button>
            </Box>

            <Typography variant="subtitle1" align="center" gutterBottom>
              Frame corrente: {frame}
            </Typography>
          </Container>

          {/* CONTENUTO PRINCIPALE */}
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', mt: 2 }}>
            {/* COLONNA SINISTRA: IMMAGINI */}
            <Box
              sx={{
                width: '65%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflowY: 'auto',
                pr: 1,
              }}
            >
              <Paper elevation={3} sx={{ p: 2 }}>
                {image1 ? (
                  <img
                    src={`data:image/png;base64,${image1}`}
                    alt="Immagine 1"
                    style={{ width: '70%', height: 'auto', borderRadius: 8 }}
                  />
                ) : (
                  <Typography align="center">Caricamento immagine 1...</Typography>
                )}
                <Typography variant="h6" align="center" mt={2}>
                  Immagine 1: Una descrizione
                </Typography>
              </Paper>

              <Paper elevation={3} sx={{ p: 2 }}>
                {image2 ? (
                  <img
                    src={`data:image/png;base64,${image2}`}
                    alt="Immagine 2"
                    style={{ width: '70%', height: 'auto', borderRadius: 8 }}
                  />
                ) : (
                  <Typography align="center">Caricamento immagine 2...</Typography>
                )}
                <Typography variant="h6" align="center" mt={2}>
                  Immagine 2: Un'altra descrizione
                </Typography>
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
                elevation={3}
                sx={{
                  flexGrow: 1,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <Typography variant="h6" align="center" gutterBottom>
                  Nuvola di punti (demo)
                </Typography>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  {/* PointCloudViewer occupa tutto */}
                  <PointCloudViewer frame={frame} points={points} />
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
 