import React, { useState, useMemo } from 'react';
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

function App() {
  const [frame, setFrame] = useState(0);
  const [mode, setMode] = useState('light');

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

  const handleNext = () => setFrame(prev => prev + 1);
  const handlePrev = () => setFrame(prev => (prev > 0 ? prev - 1 : 0));

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
              <img
                src="https://placehold.co/1000x128"
                alt="Immagine 1"
                style={{ width: '100%', borderRadius: 8 }}
              />
              <Typography variant="h6" align="center" mt={2}>
                Immagine 1: Una descrizione
              </Typography>
            </Paper>
          </Box>

          <Box my={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <img
                src="https://placehold.co/1000x128"
                alt="Immagine 2"
                style={{ width: '100%', borderRadius: 8 }}
              />
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
            <PointCloudViewer />
          </Paper>

          </Box>

          <Box display="flex" justifyContent="center" gap={2} mt={4}>
            <Button onClick={handlePrev} variant="contained" color="primary">
              Indietro
            </Button>
            <Button onClick={handleNext} variant="contained" color="primary">
              Avanti
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
