import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
//import PropTypes from 'prop-types';

const Account = () => {

    const navigate = useNavigate();

    const isUserAuthenticated = useStoreState(state => state.userAuth.isUserAuthenticated);
    const username = useStoreState(state => state.userAuth.username);
    const nickname = useStoreState(state => state.userAuth.nickname);

    useEffect(() => {
        if (!isUserAuthenticated) {
          navigate('/login');
        }
    }, [isUserAuthenticated, navigate]);

    return (
        <>
            <Container 
                sx={{
                    marginTop: '20px',
                    maxWidth: '1500px',
                    padding: '30px',
                    backgroundColor: '#cfe8fc',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Hello {username} with the nickname {nickname}
                </Typography>      
            </Container>
        </>
    );
}

// Account.propTypes = {
    
    // };

export default Account;
