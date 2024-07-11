import * as React from 'react';
import MUIAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

function AppBar() {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <MUIAppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              BeatMe
            </Typography>
          <Button color="inherit">Login</Button>
          </Toolbar>
        </MUIAppBar>
      </Box>
    </div>
  );
}

export default AppBar;