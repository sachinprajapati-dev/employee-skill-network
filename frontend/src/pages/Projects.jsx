import { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent,
    CircularProgress, Chip, Alert
} from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { getAllProjects } from '../api/api';

const domainColors = {
    HRMS: { bg: '#EEF0FF', text: '#3638C9' },
    Healthcare: { bg: '#E6F7F0', text: '#178F63' },
    Facility: { bg: '#FCF1E0', text: '#B4740E' },
    Testing: { bg: '#F3E8FF', text: '#7C3AED' },
    General: { bg: '#F1F2F5', text: '#5C6478' },
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllProjects()
            .then(res => setProjects(res.data))
            .catch(() => setError("Couldn't load projects. Check that the server is running."))
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
                Projects <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>({projects.length})</Box>
            </Typography>

            {projects.length === 0 ? (
                <Alert severity="info">No projects recorded yet.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {projects.map((project) => {
                        const c = domainColors[project.domain] || domainColors.General;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <FolderRoundedIcon sx={{ color: c.text, fontSize: 20 }} />
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                {project.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>
                                            {project.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip label={project.domain} size="small" sx={{ backgroundColor: c.bg, color: c.text }} />
                                            <Chip label={project.status} size="small" sx={{ backgroundColor: '#E6F7F0', color: '#178F63' }} />
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

export default Projects;