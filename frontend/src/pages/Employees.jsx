import { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, CircularProgress,
    Alert, TextField, InputAdornment
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { getAllEmployees } from '../api/api';
import EmployeeCard from '../components/EmployeeCard';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (search) {
            const q = search.toLowerCase();
            setFiltered(employees.filter(e =>
                e.name.toLowerCase().includes(q) ||
                e.department?.toLowerCase().includes(q) ||
                e.designation?.toLowerCase().includes(q)
            ));
        } else {
            setFiltered(employees);
        }
    }, [search, employees]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getAllEmployees();
            setEmployees(res.data);
            setFiltered(res.data);
        } catch (err) {
            setError("Couldn't load employees. Check that the server is running and try again.");
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
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Employees <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>({filtered.length})</Box>
            </Typography>

            <TextField
                fullWidth
                placeholder="Search by name, department, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                }}
            />

            {filtered.length === 0 ? (
                <Alert severity="info">No employees match that search.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {filtered.map((employee) => (
                        <Grid item xs={12} sm={6} md={4} key={employee.id}>
                            <EmployeeCard employee={employee} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Employees;