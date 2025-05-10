// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import Logo from '../assets/images/logo.png';

const Navbar = () => {
  return (
    <Stack 
      direction="row" 
      justifyContent="space-around" 
      sx={{ gap: { sm: '122px', xs: '480px' }, mt: { sm: '32px', xs: '20px' } }}
    >
      {/* Logo Link */}
      <Link to="/">
        <img 
          src={Logo} 
          alt="Logo" 
          style={{ width: '50px', height: '50px', marginRight: '20px' }} 
        />
      </Link>

      {/* Home Link */}
      <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', '&:hover': { color: 'brown' } }}>
          Home
        </Typography>
      </Link>

      {/* Get Routine Link */}
      <Link to="/get-routine" style={{ textDecoration: 'none', color: 'black' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', '&:hover': { color: 'brown' } }}>
        Get a Personalized Workout Routine
        </Typography>
      </Link>

      {/* Workout Link */}
      <Link to="/workout" style={{ textDecoration: 'none', color: 'black' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', '&:hover': { color: 'brown' } }}>
         Learn a New Exercise
        </Typography>
      </Link>
    </Stack>
  );
};

export default Navbar;
