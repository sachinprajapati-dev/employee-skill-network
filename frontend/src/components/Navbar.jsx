import { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const navItems = [
    { label: 'Home', path: '/', icon: HomeRoundedIcon },
    { label: 'Employees', path: '/employees', icon: GroupsRoundedIcon },
    { label: 'Skills', path: '/skills', icon: BoltRoundedIcon },
    { label: 'Projects', path: '/projects', icon: FolderRoundedIcon },
    { label: 'Search', path: '/search', icon: SearchRoundedIcon },
];

const Navbar = () => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const Wordmark = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <HubRoundedIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Employee Network
            </Typography>
        </Box>
    );

    return (
        <>
            <AppBar position="static" color="transparent" sx={{ backgroundColor: 'background.paper' }}>
                <Toolbar>
                    {Wordmark}

                    {isMobile ? (
                        <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">
                            <MenuRoundedIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = location.pathname === item.path;
                                return (
                                    <Button
                                        key={item.path}
                                        component={Link}
                                        to={item.path}
                                        startIcon={<Icon fontSize="small" />}
                                        sx={{
                                            color: active ? 'primary.main' : 'text.secondary',
                                            backgroundColor: active ? 'primary.contrastText' : 'transparent',
                                            fontWeight: active ? 600 : 500,
                                            px: 1.5,
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 260, pt: 2 }} role="presentation">
                    <Box sx={{ px: 2, pb: 1 }}>{Wordmark}</Box>
                    <List>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = location.pathname === item.path;
                            return (
                                <ListItemButton
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    selected={active}
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontWeight: active ? 600 : 500 }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;