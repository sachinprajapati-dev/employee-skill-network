import { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent,
    CircularProgress, Alert, Chip
} from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { getAllSkills } from '../api/api';

const categoryColors = {
    Backend: { bg: '#EEF0FF', text: '#3638C9' },
    Frontend: { bg: '#F3E8FF', text: '#7C3AED' },
    Mobile: { bg: '#E6F7F0', text: '#178F63' },
    Database: { bg: '#FCF1E0', text: '#B4740E' },
    DevOps: { bg: '#FDE8EE', text: '#C22A56' },
    General: { bg: '#F1F2F5', text: '#5C6478' },
};

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllSkills()
            .then(res => setSkills(res.data))
            .catch(() => setError("Couldn't load skills. Check that the server is running."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
            <Alert severity="error">{error}</Alert>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Skills <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>({skills.length})</Box>
            </Typography>

            {skills.length === 0 ? (
                <Alert severity="info">No skills recorded yet.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {skills.map((skill) => {
                        const c = categoryColors[skill.category] || categoryColors.General;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={skill.id}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <BoltRoundedIcon sx={{ color: c.text, fontSize: 20 }} />
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {skill.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip
                                                label={skill.category}
                                                size="small"
                                                sx={{ backgroundColor: c.bg, color: c.text }}
                                            />
                                            <Chip label={skill.level} size="small" variant="outlined" />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default Skills;