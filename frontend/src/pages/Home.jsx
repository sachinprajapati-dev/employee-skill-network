import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Stack } from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import DeviceHubRoundedIcon from '@mui/icons-material/DeviceHubRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import { getAllEmployees, getAllSkills, getAllProjects } from '../api/api';

const GraphNode = ({ icon: Icon, value, label, color, tint }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box
            sx={{
                width: 116,
                height: 116,
                borderRadius: '50%',
                border: `2.5px solid ${color}`,
                backgroundColor: tint,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
            }}
        >
            <Icon sx={{ color, fontSize: 26 }} />
            <Typography variant="h5" sx={{ color, lineHeight: 1.1, mt: 0.25 }}>
                {value}
            </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {label}
        </Typography>
    </Box>
);

// The connecting "edge" — a dashed line, exactly the kind an actual graph
// diagram draws between nodes. Rotates to vertical on small screens.
const GraphEdge = () => (
    <Box
        sx={{
            flex: 1,
            minWidth: { xs: 0, sm: 48 },
            height: { xs: 32, sm: 2 },
            width: { xs: 2, sm: 'auto' },
            alignSelf: 'center',
            borderTop: { sm: '2px dashed', xs: 'none' },
            borderLeft: { xs: '2px dashed', sm: 'none' },
            borderColor: 'divider',
        }}
    />
);

const Home = () => {
    const [stats, setStats] = useState({ employees: 0, skills: 0, projects: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [empRes, skillRes, projRes] = await Promise.all([
                    getAllEmployees(),
                    getAllSkills(),
                    getAllProjects(),
                ]);
                setStats({
                    employees: empRes.data.length,
                    skills: skillRes.data.length,
                    projects: projRes.data.length,
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 4, sm: 6 }, maxWidth: 1100, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 5, sm: 7 } }}>
                <Typography
                    variant="h3"
                    sx={{ fontSize: { xs: '1.9rem', sm: '2.6rem' }, color: 'text.primary' }}
                >
                    Employee Skill Network
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mt: 1.5 }}>
                    Explore how people, skills, and projects connect across the org
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 0, sm: 1 },
                        mb: { xs: 6, sm: 8 },
                    }}
                >
                    <GraphNode
                        icon={GroupsRoundedIcon}
                        value={stats.employees}
                        label="Employees"
                        color="#4B4FFC"
                        tint="#EEF0FF"
                    />
                    <GraphEdge />
                    <GraphNode
                        icon={BoltRoundedIcon}
                        value={stats.skills}
                        label="Skills"
                        color="#1FAA75"
                        tint="#E6F7F0"
                    />
                    <GraphEdge />
                    <GraphNode
                        icon={FolderRoundedIcon}
                        value={stats.projects}
                        label="Projects"
                        color="#D98A1F"
                        tint="#FCF1E0"
                    />
                </Box>
            )}

            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Typography variant="h5" sx={{ mb: 2.5 }}>
                        Why a graph database?
                    </Typography>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <LinkRoundedIcon sx={{ color: 'primary.main', mt: 0.3 }} />
                            <Typography variant="body1" color="text.secondary">
                                Relational databases struggle with questions like "who shares a
                                project with this person" or "who's two levels up the management
                                chain" — those need multiple joins that get slower and messier as
                                the org grows.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <DeviceHubRoundedIcon sx={{ color: 'secondary.main', mt: 0.3 }} />
                            <Typography variant="body1" color="text.secondary">
                                CognoDB stores relationships as first-class data, so multi-hop
                                traversals — colleagues, manager chains, shared skills — are
                                single, natural Cypher queries instead of chained joins.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <RocketLaunchRoundedIcon sx={{ color: '#D98A1F', mt: 0.3 }} />
                            <Typography variant="body1" color="text.secondary">
                                Finding colleagues who work on the same project takes one
                                pattern-matching query here, versus several joined subqueries
                                in SQL.
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Home;