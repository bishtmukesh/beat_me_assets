import { useCallback, useState } from 'react';
import { useStoreActions } from 'easy-peasy';

import { requestJwtToken } from '../../api/auth';

const useLogin = () => {
    
    const setUserAuthenticationStatus = useStoreActions(actions => actions.userAuth.setUserAuthenticationStatus);
    const setUsername = useStoreActions(actions => actions.userAuth.setUsername);
    const setNickname = useStoreActions(actions => actions.userAuth.setNickname);
    const resetAuthenticationState = useStoreActions(actions => actions.userAuth.resetAuthenticationState);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = useCallback( async() => {
        if (email && password) {
            try {
                setLoading(true);
                const response = await requestJwtToken(email, password);

                if (response && response.isUserAuthenticated) {
                    setUserAuthenticationStatus(true);
                    setUsername(response.username);
                    setNickname(response.nickname);
                } else {
                    resetAuthenticationState();
                }

            } catch (error) {
                console.log("Caught error while logging in - " + error);
            } finally {
                setLoading(false);
            }
        }
    }, [email, password, setUserAuthenticationStatus, setUsername, setNickname, resetAuthenticationState]);

    return {
        email,
        handleEmailChange,
        password,
        handlePasswordChange,
        handleLogin,
        loading,
    };
}

// useLogin.propTypes = {
//     
// };

export default useLogin;