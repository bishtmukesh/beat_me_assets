import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { BRAND_NAME } from '../../constant/app';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                textAlign: 'center',
                backgroundColor: 'primary.main',
                color: 'white',
                mt: '100px'
            }}
        >
            <Typography variant="body2">
                &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;