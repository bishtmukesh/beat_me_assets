import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
//import PropTypes from 'prop-types';

import Loader from '../../components/Loader';
import useLogin from './useLogin';

const Login = () => {

    const navigate = useNavigate();
    const isUserAuthenticated = useStoreState(state => state.userAuth.isUserAuthenticated);

    useEffect(() => {
        if (isUserAuthenticated) {
          navigate('/account');
        }
    }, [isUserAuthenticated, navigate]);

    const {
        email,
        handleEmailChange,
        password,
        handlePasswordChange,
        handleLogin,
        loading,
    } = useLogin();

    return (
        <>
            <Loader 
                loading={loading}
            />

            <Container 
                sx={{
                    marginTop: '20px',
                    maxWidth: '1500px',
                    padding: '30px',
                    backgroundColor: '#cfe8fc',
                }}
            >

                <Box  
                    sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                    >
                    
                    <Typography variant="h4" component="h1" gutterBottom>
                        Sign In for a Personalized Experience
                    </Typography>

                    <TextField 
                        id="filled-basic" 
                        label="Email" 
                        variant="filled" 
                        value={email}
                        onChange={handleEmailChange}
                    />

                    <TextField 
                        id="filled-basic" 
                        label="Password" 
                        variant="filled" 
                        type='password'
                        value={password}
                        onChange={handlePasswordChange}
                    />

                    <Button 
                        variant="contained"
                        onClick={handleLogin}
                        >
                        Login
                    </Button>
                </Box>

            </Container>
        </>
    );
}

// Room.propTypes = {
    
    // };

export default Login;
