import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import GetRoutine from './pages/GetRoutine';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Workout from './pages/Workouts';

const App = () => {
    return (
        <Box width="720px" sx={{ width: { xl: '1280px' }}} m="auto">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/get-routine" element={<GetRoutine />} />
                <Route path="/workout" element={<Workout />} />
            </Routes>
            <Footer />
        </Box>
    );
}

export default App;
