import React, { useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

import { BRAND_NAME } from '../../constant/app';
import { LOGIN_PAGE_URL } from '../../constant/url';

export default function ButtonAppBar() {

    const navigate = useNavigate();

    const handleRedirect = useCallback(() => {
        navigate(LOGIN_PAGE_URL);
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
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {BRAND_NAME}
                    </Typography>

                    <AccountCircle
                        onClick={handleRedirect}
                        sx={{
                            cursor: 'pointer',
                        }}
                    />
                </Toolbar>
            </AppBar>
        </Box>
  );
}
