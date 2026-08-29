import { createTheme } from '@mui/material/styles';

// Palette is built around the product's real subject: a graph. Each entity
// type (Employee / Skill / Project) gets its own accent so the same colors
// used in the Home "network" hero carry through chips, rings, and badges
// everywhere else in the app — the color IS the entity type.
const colors = {
    canvas: '#F5F6FA',
    surface: '#FFFFFF',
    ink: '#12162B',
    inkMuted: '#5C6478',
    border: '#E3E5EE',

    edge: '#4B4FFC',       // Employees / primary actions — "connection" indigo
    edgeTint: '#EEF0FF',
    edgeDark: '#3638C9',

    node: '#1FAA75',        // Skills — growth green
    nodeTint: '#E6F7F0',
    nodeDark: '#178F63',

    amber: '#D98A1F',        // Projects — amber
    amberTint: '#FCF1E0',
};

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: colors.canvas,
            paper: colors.surface,
        },
        primary: {
            main: colors.edge,
            dark: colors.edgeDark,
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: colors.node,
            dark: colors.nodeDark,
            contrastText: '#FFFFFF',
        },
        text: {
            primary: colors.ink,
            secondary: colors.inkMuted,
        },
        divider: colors.border,
    },
    custom: colors,
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h1: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
        h4: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
        h5: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
        body1: { lineHeight: 1.6 },
        body2: { lineHeight: 1.55 },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 10, paddingTop: 9, paddingBottom: 9 },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 500, borderRadius: 8 },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'medium',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: { borderRadius: 10 },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: { boxShadow: 'none', borderBottom: `1px solid ${colors.border}` },
            },
        },
    },
});

export default theme;