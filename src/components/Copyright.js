import { Typography, Link } from '@material-ui/core';

export default function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Developed by © '}
        <Link color="inherit" href="http://www.gauravchinavle.dev">
          gauravchinavle.dev
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }