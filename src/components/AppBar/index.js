import React, { useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

import { BRAND_NAME } from '../../constant/app';
import { HOME_PAGE_URL, LOGIN_PAGE_URL } from '../../constant/url';

export default function ButtonAppBar() {

    const navigate = useNavigate();

    const handleLoginRedirect = useCallback(() => {
        navigate(LOGIN_PAGE_URL);
    }, [navigate]);

    const handleHomeRedirect = useCallback(() => {
        navigate(HOME_PAGE_URL);
    }, [navigate]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="success">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <HomeIcon
                        onClick={handleHomeRedirect}
                        sx={{
                            cursor: 'pointer',
                        }}
                    />

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {BRAND_NAME}
                    </Typography>

                    <AccountCircle
                        onClick={handleLoginRedirect}
                        sx={{
                            cursor: 'pointer',
                        }}
                    />

                </Toolbar>
            </AppBar>
        </Box>
  );
}
