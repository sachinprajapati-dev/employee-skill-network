import { useState } from 'react';
import {
    Box, Typography, TextField, Button, Grid,
    Card, CardContent, Alert, CircularProgress
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { findBySkill, findByDepartment, findByProject } from '../api/api';
import EmployeeCard from '../components/EmployeeCard';

const SEARCH_CARDS = [
    { type: 'skill', title: 'Search by skill', placeholder: 'e.g. Java, React Native', icon: BoltRoundedIcon, color: '#1FAA75' },
    { type: 'department', title: 'Search by department', placeholder: 'e.g. Engineering, Backend', icon: ApartmentRoundedIcon, color: '#4B4FFC' },
    { type: 'project', title: 'Search by project', placeholder: 'e.g. PAYDAY, CertReadyHealth', icon: FolderRoundedIcon, color: '#D98A1F' },
];

const Search = () => {
    const [values, setValues] = useState({ skill: '', department: '', project: '' });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (type) => {
        const value = values[type];
        if (!value.trim()) return;
        try {
            setLoading(true);
            let res;
            if (type === 'skill') res = await findBySkill(value);
            else if (type === 'department') res = await findByDepartment(value);
            else if (type === 'project') res = await findByProject(value);
            setResults(res.data);
            setSearched(true);
        } catch (err) {
            setResults([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Search employees
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {SEARCH_CARDS.map(({ type, title, placeholder, icon: Icon, color }) => (
                    <Grid item xs={12} md={4} key={type}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Icon sx={{ color }} />
                                    <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder={placeholder}
                                    value={values[type]}
                                    onChange={(e) => setValues((v) => ({ ...v, [type]: e.target.value }))}
                                    sx={{ mb: 2 }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(type)}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handleSearch(type)}
                                    startIcon={<SearchRoundedIcon />}
                                    sx={{ backgroundColor: color, '&:hover': { backgroundColor: color, filter: 'brightness(0.92)' } }}
                                >
                                    Search
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {searched && !loading && (
                <>
                    <Box sx={{ borderTop: '2px dashed', borderColor: 'divider', mb: 3 }} />
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {results.length} employee{results.length !== 1 ? 's' : ''} found
                    </Typography>
                    {results.length === 0 ? (
                        <Alert severity="info">No employees matched that search.</Alert>
                    ) : (
                        <Grid container spacing={3}>
                            {results.map((employee) => (
                                <Grid item xs={12} sm={6} md={4} key={employee.id}>
                                    <EmployeeCard employee={employee} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}
        </Box>
    );
};

export default Search;