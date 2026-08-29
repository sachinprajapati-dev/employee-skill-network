import {
    Card, CardContent, Typography, Chip, Box, Avatar, CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';

// Deterministic color per department so the same department always renders
// the same ring/avatar color across the whole app — a lightweight visual
// grouping cue without needing a legend.
const DEPT_COLORS = [
    '#4B4FFC', '#1FAA75', '#D98A1F', '#DB4C77', '#0EA5A5',
];
const colorForDepartment = (department = '') => {
    let hash = 0;
    for (let i = 0; i < department.length; i++) {
        hash = department.charCodeAt(i) + ((hash << 5) - hash);
    }
    return DEPT_COLORS[Math.abs(hash) % DEPT_COLORS.length];
};

const initials = (name = '') =>
    name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const EmployeeCard = ({ employee }) => {
    const navigate = useNavigate();
    const color = colorForDepartment(employee.department);

    return (
        <Card sx={{ borderRadius: 3, transition: 'border-color 0.15s, transform 0.15s', '&:hover': { borderColor: color, transform: 'translateY(-2px)' } }}>
            <CardActionArea onClick={() => navigate(`/employees/${employee.id}`)}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Avatar sx={{ bgcolor: color, mr: 1.5, fontWeight: 700 }}>
                            {initials(employee.name)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={700} noWrap>
                                {employee.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {employee.designation}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <PlaceRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {employee.department}
                        </Typography>
                    </Box>

                    {employee.managerName && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                            <SupervisorAccountRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {employee.managerName}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {employee.skills?.slice(0, 3).map((skill) => (
                            <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                sx={{ backgroundColor: '#EEF0FF', color: '#3638C9' }}
                            />
                        ))}
                        {employee.skills?.length > 3 && (
                            <Chip
                                label={`+${employee.skills.length - 3}`}
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default EmployeeCard;