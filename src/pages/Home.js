import React from 'react';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import backgroundVideo from '../assets/video/background.mp4'; 

const Home = () => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
     
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          padding: theme.spacing(3),
          color: 'white', 
          textAlign: 'center',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          
          <Grid item xs={12} md={6} sx={{ padding: '20px' }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
           Welcome to Your Fitness Journey
        </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.25rem', color: 'white', lineHeight: 1.6, mt: 2 }}>
        Discover routines and personalized plans tailored to help you meet your fitness goals, whether it’s losing weight, building muscle, or improving flexibility. Start today and transform your health!
        </Typography>
         </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
