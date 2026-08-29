import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Chip, Card, CardContent,
    CircularProgress, Alert, Button, Grid, Avatar, List, ListItemButton, ListItemText
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import { getEmployeeById, findColleagues, findManagerChain } from '../api/api';

const initials = (name = '') =>
    name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

// A dashed rule that echoes the graph "edge" motif used on the Home page,
// instead of a plain MUI Divider.
const SectionRule = () => (
    <Box sx={{ borderTop: '2px dashed', borderColor: 'divider', my: 2.5 }} />
);

const EmployeeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [colleagues, setColleagues] = useState([]);
    const [managerChain, setManagerChain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const empRes = await getEmployeeById(id);
            setEmployee(empRes.data);

            const [colleaguesRes, managerRes] = await Promise.all([
                findColleagues(empRes.data.name),
                findManagerChain(empRes.data.name),
            ]);
            setColleagues(colleaguesRes.data);
            setManagerChain(managerRes.data);
        } catch (err) {
            setError("Couldn't load this employee. They may not exist, or the server is unreachable.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
            <Alert severity="error">{error}</Alert>
            <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/employees')} sx={{ mt: 2 }}>
                Back to Employees
            </Button>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1100, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() => navigate('/employees')}
                sx={{ mb: 2, color: 'text.secondary' }}
            >
                Back to Employees
            </Button>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 700 }}>
                                    {initials(employee.name)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5">{employee.name}</Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {employee.designation}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                <PlaceRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="body2">{employee.department}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                <EmailRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="body2">{employee.email}</Typography>
                            </Box>
                            {employee.managerName && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SupervisorAccountRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    <Typography variant="body2">Reports to {employee.managerName}</Typography>
                                </Box>
                            )}

                            <SectionRule />

                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                                Skills
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {employee.skills?.length ? employee.skills.map((skill) => (
                                    <Chip key={skill} label={skill} sx={{ backgroundColor: '#EEF0FF', color: '#3638C9' }} />
                                )) : (
                                    <Typography variant="body2" color="text.secondary">No skills recorded yet.</Typography>
                                )}
                            </Box>

                            <SectionRule />

                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                                Projects
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {employee.projects?.length ? employee.projects.map((project) => (
                                    <Chip key={project} label={project} sx={{ backgroundColor: '#E6F7F0', color: '#178F63' }} />
                                )) : (
                                    <Typography variant="body2" color="text.secondary">Not assigned to any project yet.</Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <GroupsRoundedIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Colleagues (share a project)
                                </Typography>
                            </Box>
                            {colleagues.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No shared-project colleagues found yet.
                                </Typography>
                            ) : (
                                <List dense disablePadding>
                                    {colleagues.map((c) => (
                                        <ListItemButton
                                            key={c.id}
                                            onClick={() => navigate(`/employees/${c.id}`)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <ListItemText primary={c.name} secondary={c.designation} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <AccountTreeRoundedIcon sx={{ color: '#D98A1F' }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Manager chain (up to 2 hops)
                                </Typography>
                            </Box>
                            {managerChain.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No one above this person in the chain.
                                </Typography>
                            ) : (
                                <List dense disablePadding>
                                    {managerChain.map((m) => (
                                        <ListItemButton
                                            key={m.id}
                                            onClick={() => navigate(`/employees/${m.id}`)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <ListItemText primary={m.name} secondary={m.designation} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeDetail;