import { action, thunk } from 'easy-peasy';

import { fetchUserAuthenticationStatus } from '../../api/auth';

const userAuthModel = {
    isUserAuthenticated: false,
    username: null,
    nickname: null, 
  
    setUserAuthenticationStatus: action((state, authStatus) => {
        state.isUserAuthenticated = authStatus;
    }),

    setUsername: action((state, username) => {
        state.username = username;
    }),

    setNickname: action((state, nickname) => {
        state.nickname = nickname;
    }),

    resetAuthenticationState: action((state) => {
        state.isUserAuthenticated = false;
        state.username = null;
        state.nickname = null;
    }),


    //thunks
    fetchUserAuthenticationStatus: thunk( async(actions) => {
        try {
            const status = await fetchUserAuthenticationStatus();
            
            if (status && status.isUserAuthenticated) {
                console.log("User is authenticated");
                actions.setUserAuthenticationStatus(true);
                actions.setUsername(status.username);
                actions.setNickname(status.nickname);
            }
        } catch (error) {
                actions.resetAuthenticationState();
        } 
    }),
  
};

export default userAuthModel;