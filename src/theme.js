import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    },
  },
  typography: {
    fontFamily: [
      'Chilanka',
    ].join(','),
  }
});

export default theme;
