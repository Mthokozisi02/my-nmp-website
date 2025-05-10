import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, MenuItem, Select, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Papa from 'papaparse';
import { jsPDF } from "jspdf";
import routineData from '../assets/megaGymDataset.csv';

const GetRoutine = () => {
  const [workoutType, setWorkoutType] = useState('');
  const [level, setLevel] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [exercises, setExercises] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [bmi, setBmi] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    Papa.parse(routineData, {
      header: true,
      download: true,
      complete: (results) => {
        setExercises(results.data);
      },
    });
  }, []);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBMI = (weight / (heightInMeters ** 2)).toFixed(1);
      setBmi(calculatedBMI);
      return calculatedBMI;
    }
    return null;
  };

  const getRandomExercises = (filteredExercises) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const selectedDays = days.slice(0, daysPerWeek);

    return selectedDays.map((day) => {
      const selectedExercises = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * filteredExercises.length);
        const selectedExercise = filteredExercises[randomIndex];

        const existingExercise = selectedExercises.find(
          (exercise) => exercise.Title === selectedExercise.Title
        );

        if (existingExercise) {
          existingExercise.sets = `${parseInt(existingExercise.sets) + 1} sets`;
        } else {
          selectedExercises.push({ ...selectedExercise, sets: '1 set' });
        }
      }
      return { day, exercises: selectedExercises };
    });
  };

  const generateRoutine = () => {
    if (!workoutType || !level || !gender || !age || !height || !weight || !daysPerWeek) {
      setOpenDialog(true);
      return;
    }

    calculateBMI();
    let filteredExercises = exercises.filter(
      (exercise) => exercise.Type === workoutType && exercise.Level === level
    );

    if (bmi) {
      if (bmi < 18.5) {
        filteredExercises = filteredExercises.filter(exercise => exercise.Body_Type === 'Underweight');
      } else if (bmi < 25) {
        filteredExercises = filteredExercises.filter(exercise => exercise.Body_Type === 'Normal');
      } else if (bmi < 30) {
        filteredExercises = filteredExercises.filter(exercise => exercise.Body_Type === 'Overweight');
      } else {
        filteredExercises = filteredExercises.filter(exercise => exercise.Body_Type === 'Obese');
      }
    }

    const weeklyRoutine = getRandomExercises(filteredExercises).map((dayRoutine) => {
      const exercisesWithRepsSets = dayRoutine.exercises.map((exercise) => {
        let reps, sets;
        if (workoutType === 'Strength' || workoutType === 'Stretching') {
          reps = workoutType === 'Strength' ? '8-12 reps' : 'Hold for 30-60 sec';
          sets = level === 'Beginner' ? '2 sets' : level === 'Intermediate' ? '3 sets' : '5 sets';
        } else if (workoutType === 'Plyometrics') {
          reps = '15-20 reps';
          sets = '3 sets';
        } else if (workoutType === 'Cardio') {
          reps = '30-45 min';
          sets = '1 set';
        }
        return { ...exercise, reps, sets };
      });
      return { ...dayRoutine, exercises: exercisesWithRepsSets };
    });

    setRoutine(weeklyRoutine);
    resetInputs();
  };

  const resetInputs = () => {
    setWorkoutType('');
    setLevel('');
    setGender('');
    setAge('');
    setHeight('');
    setWeight('');
    setDaysPerWeek(3);
    setBmi(null);
  };

  const availableLevels = () => {
    if (workoutType === 'Cardio' || workoutType === 'Plyometrics') {
      return ['Beginner', 'Intermediate'];
    }
    return ['Beginner', 'Intermediate', 'Expert'];
  };

  
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Weekly Workout Routine", 14, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    routine.forEach((dayRoutine, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(dayRoutine.day, 14, 40 + (index * 40));
      doc.setFont("helvetica", "normal");
      dayRoutine.exercises.forEach((exercise, idx) => {
        const exerciseText = `- ${exercise.Title} (${exercise.Body_Type}) | ${exercise.reps} | ${exercise.sets}`;
        doc.text(exerciseText, 14, 45 + (index * 40) + (idx * 10));
      });
      doc.line(10, 50 + (index * 40), 200, 50 + (index * 40)); // Line separator
    });

    doc.save("workout_routine.pdf");
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto', position: 'relative' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Your Weekly Workout Routine
      </Typography>

      
      <FormControl fullWidth margin="normal">
        <InputLabel id="gender-select-label">Gender</InputLabel>
        <Select labelId="gender-select-label" value={gender} onChange={(e) => setGender(e.target.value)}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="age-select-label">Age</InputLabel>
        <Select labelId="age-select-label" value={age} onChange={(e) => setAge(e.target.value)}>
          {[...Array(100).keys()].map((age) => (
            <MenuItem key={age} value={age + 1}>{age + 1}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="height-select-label">Height (cm)</InputLabel>
        <Select labelId="height-select-label" value={height} onChange={(e) => setHeight(e.target.value)}>
          {[...Array(200).keys()].map((h) => (
            <MenuItem key={h} value={h + 100}>{h + 100}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="weight-select-label">Weight (kg)</InputLabel>
        <Select labelId="weight-select-label" value={weight} onChange={(e) => setWeight(e.target.value)}>
          {[...Array(150).keys()].map((w) => (
            <MenuItem key={w} value={w + 30}>{w + 30}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="workout-type-select-label">Workout Type</InputLabel>
        <Select labelId="workout-type-select-label" value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
          <MenuItem value="Strength">Strength</MenuItem>
          <MenuItem value="Plyometrics">Plyometrics</MenuItem>
          <MenuItem value="Cardio">Cardio</MenuItem>
          <MenuItem value="Stretching">Stretching</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="level-select-label">Experience Level</InputLabel>
        <Select labelId="level-select-label" value={level} onChange={(e) => setLevel(e.target.value)}>
          {availableLevels().map((lvl) => (
            <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="days-select-label">Days per Week</InputLabel>
        <Select labelId="days-select-label" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)}>
          {[...Array(6).keys()].map((day) => (
            <MenuItem key={day} value={day + 1}>{day + 1}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" fullWidth onClick={generateRoutine} sx={{ marginTop: '20px' }}>
        Generate Routine
      </Button>

      
      {routine.length > 0 && (
        <Button variant="contained" color="secondary" fullWidth onClick={downloadPDF} sx={{ marginTop: '20px' }}>
          Download PDF
        </Button>
      )}

      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Incomplete Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in all fields to generate your workout routine.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      {routine.length > 0 && (
        <Box sx={{ marginTop: '30px' }}>
          <Typography variant="h5" gutterBottom>Weekly Routine:</Typography>
          <Grid container spacing={2}>
            {routine.map((dayRoutine, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                  <Typography variant="h6" color="primary">{dayRoutine.day}</Typography>
                  {dayRoutine.exercises.map((exercise, idx) => (
                    <Typography key={idx} variant="body1">
                      - {exercise.Title} - {exercise.Body_Type}, {exercise.reps}, {exercise.sets}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          right: '20px',
          width: '250px',
          padding: '15px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="subtitle1" color="secondary">Key Note</Typography>
        <Typography variant="body2">
          When it comes to weight training, start with a weight you are comfortable with. Anytime it progressively feels lighter, add 5 pounds or 2.5kgs.
        </Typography>
      </Box>
    </Box>
  );
};

export default GetRoutine;
