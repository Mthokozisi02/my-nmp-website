import React, { useState } from 'react';
import { Button, Typography, Box, Card, CardContent, Grid, CardMedia } from '@mui/material';

const muscleGroups = [
  'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 
  'chest', 'forearms', 'glutes', 'hamstrings', 'lats', 
  'lower_back', 'middle_back', 'neck', 'quadriceps', 'traps', 'triceps'
];

const Workout = () => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async (muscleGroup) => {
    const EXERCISE_API_KEY = 'Us5syOuxPEXCBuaq5JwjCw==aJ4lHCTCYX2dr2kz';
    const YOUTUBE_API_KEY = 'AIzaSyBU3dT1KPygJ0w53NF21i9BPi3TeHSS7WM';

    setError(null);
    setLoading(true);

    try {
      // Fetch exercises from ExerciseDB
      const response = await fetch(
        `https://api.api-ninjas.com/v1/exercises?muscle=${muscleGroup}`,
        { headers: { 'X-Api-Key': EXERCISE_API_KEY } }
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();

      if (data.length === 0) {
        setError('No exercises found for the specified muscle group.');
        setExercises([]);
      } else {
        // For each exercise, fetch a YouTube video
        const withVideos = await Promise.all(
          data.map(async (exercise) => {
            try {
              const query = encodeURIComponent(`${exercise.name} exercise`);
              const ytRes = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${YOUTUBE_API_KEY}`
              );
              const ytData = await ytRes.json();

              if (ytData.items && ytData.items.length > 0) {
                const vid = ytData.items[0];
                const videoId = vid.id.videoId;
                return {
                  ...exercise,
                  video: {
                    title: vid.snippet.title,
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnail: vid.snippet.thumbnails.medium.url,
                  },
                };
              }
            } catch (e) {
              console.warn('YouTube fetch failed for', exercise.name, e);
            }
            return exercise;
          })
        );
        setExercises(withVideos);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch exercises: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ padding: '170px', maxWidth: '1300px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Select a Muscle Group
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '100px' }}>
        {muscleGroups.map((group) => (
          <Grid item key={group}>
            <Button variant="contained" color="primary" onClick={() => handleButtonClick(group)}>
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </Button>
          </Grid>
        ))}
      </Grid>

      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}

      {loading && (
        <Typography variant="body1" align="center">
          Loading exercises...
        </Typography>
      )}

      <Grid container spacing={2}>
        {exercises.map((exercise, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>{exercise.name}</Typography>
                {exercise.equipment && (
                  <Typography variant="body2" color="textSecondary">
                    Equipment: {exercise.equipment}
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  {exercise.instructions}
                </Typography>
                {exercise.video && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Watch how to perform:
                    </Typography>
                    <a href={exercise.video.url} target="_blank" rel="noopener noreferrer">
                      <CardMedia
                        component="img"
                        height="140"
                        image={exercise.video.thumbnail}
                        alt={`${exercise.name} tutorial`}
                        sx={{ borderRadius: '8px', marginTop: '8px' }}
                      />
                      <Typography variant="subtitle2" sx={{ marginTop: '8px', textDecoration: 'underline' }}>
                        {exercise.video.title}
                      </Typography>
                    </a>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Workout;
