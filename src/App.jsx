import React, { useMemo } from 'react';
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
  const { points, image1, image2, frame } = useWebSocketData('ws://localhost:8000/ws');
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
          px: 2,
        }}
      >
        <Container maxWidth="md" sx={{ mx: 'auto'}}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
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

          <Box my={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              {image1 ? (
                <img
                  src={`data:image/png;base64,${image1}`}
                  alt="Immagine 1"
                  style={{ width: '100%', borderRadius: 8 }}
                />
              ) : (
                <Typography align="center">Caricamento immagine 1...</Typography>
              )}
              <Typography variant="h6" align="center" mt={2}>
                Immagine 1: Una descrizione
              </Typography>
            </Paper>
          </Box>

          <Box my={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              {image2 ? (
                <img
                  src={`data:image/png;base64,${image2}`}
                  alt="Immagine 2"
                  style={{ width: '100%', borderRadius: 8 }}
                />
              ) : (
                <Typography align="center">Caricamento immagine 2...</Typography>
              )}
              <Typography variant="h6" align="center" mt={2}>
                Immagine 2: Un'altra descrizione
              </Typography>
            </Paper>
          </Box>

          <Box my={4}>
            <Paper elevation={3} sx={{ p: 2, overflow: 'hidden' }}>
              <Typography variant="h6" align="center" gutterBottom>
                Nuvola di punti (demo)
              </Typography>
              <PointCloudViewer frame={frame} points={points} />
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;