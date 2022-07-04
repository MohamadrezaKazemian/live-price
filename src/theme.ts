import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: [
      "iransans",
    ].join(","),
    fontSize: 13,
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#000000',

    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
