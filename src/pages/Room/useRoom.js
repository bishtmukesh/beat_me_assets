import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import PropTypes from 'prop-types';
import { useStoreActions } from 'easy-peasy';

import { SERVER_BASE_URL, STOMP_ENDPONT, SERVER_CHAT_ENDPOINT, ROOM_SUBSCRIPTION_PRIFIX, SERVER_SUB_CONFIRMATION_ENDPOINT } from '../../constant/url';
import { MESSAGE_TYPES } from '../../constant/room';
 
const useRoom = ( { roomCode, userName, selectedIconNumber } ) => {
    
    const addChat = useStoreActions(actions => actions.roomChat.addChat);
    const clearChats = useStoreActions(actions => actions.roomChat.clearChats);

    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const [players, setPlayers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [hostUserId, setHostUserId] = useState(null);

    const isHost = useMemo(() => {
        return userId !== null && hostUserId !== null && userId === hostUserId;
    }, [userId, hostUserId]);

    const socketRef = useRef(null);
    const gameUpdateHandler = useRef(null);
    const roomUpdateHandler = useRef(null);

    const onSocketConnect = (frame) => {
        setConnected(true);
        
        const socketURL = socketRef.current._transport.url;
        const sessionId = /\/([^/]+)\/websocket/.exec(socketURL)[1];
        
        setUserId(sessionId);    
        console.log("The userId is - " + sessionId);    
    };

    const onConnectionError = (error) => {
        console.error("Error connecting to stomp endpoint - ", error);
        setUserId(null);
        setConnected(false);
    };

    const handleDisconnection = () => {
        console.log('Socket connection closed.');
        setUserId(null);
        setConnected(false);
    };

    const handleGameUpdateMessage  = useCallback((message) => {
        if (gameUpdateHandler.current) {
            gameUpdateHandler.current(message);
        }
    }, [gameUpdateHandler]); 

    const setGameUpdateHandler = (handler) => {
        gameUpdateHandler.current = handler;
    };

    const handleRoomUpdateMessage  = useCallback((message) => {
        if (roomUpdateHandler.current) {
            roomUpdateHandler.current(message);
        }
    }, [roomUpdateHandler]); 

    const setRoomUpdateHandler = (handler) => {
        roomUpdateHandler.current = handler;
    };

    const handleMessageReceived  = useCallback((messageOutput, subscriptionEndpoint) => {
        const message = JSON.parse(messageOutput.body);
        console.log("Message received from room - " + subscriptionEndpoint + " -> " + JSON.stringify(message, null, 2));

        if (message.messageType && message.messageType === MESSAGE_TYPES.CHAT) {
            addChat(message);
        } else if (message.messageType && message.messageType === MESSAGE_TYPES.PLAYER_LIST) {
            if (Array.isArray(message.playersList)) {
                setPlayers(message.playersList);
            } else {
                setPlayers([]);
            }

            setHostUserId(message.hostUserId);
        } else if (message.messageType && message.messageType === MESSAGE_TYPES.GAME_UPDATE) {
            if (message.senderUserId !== userId) {
                console.log("Got a game update, update type is -> " + message.updateType + ". Message is -> " + JSON.stringify(message, null, 2));
                handleGameUpdateMessage(message);
            }
        } else if (message.messageType && message.messageType === MESSAGE_TYPES.ROOM_UPDATE) {
            if (message.senderUserId !== userId) {
                console.log("Got a room update, update type is -> " + message.updateType);
                handleRoomUpdateMessage(message);
            }
        }
    }, [addChat, userId, handleGameUpdateMessage]);

    const handleSubscriptionError = useCallback ((error, subscriptionEndpoint) => {
        console.error('Error while trying to subscribe to room - ' + subscriptionEndpoint + " -> ", error);
        setSubscribed(false);
    }, []);

    const sendSubscriptionConfirmation =  useCallback(() => {
        if (stompClient && stompClient.connected && subscribed) {
            stompClient.send(SERVER_SUB_CONFIRMATION_ENDPOINT, {}, JSON.stringify({ from: userName, roomCode }));
        }
    }, [roomCode, stompClient, subscribed, userName]);

    const subscribeToRoom = useCallback((client, roomCode) => {
            const subscriptionEndpoint = ROOM_SUBSCRIPTION_PRIFIX.concat('/', roomCode);

            const subscription = client.subscribe(subscriptionEndpoint, messageOutput => {
                handleMessageReceived(messageOutput, subscriptionEndpoint);
            }, handleSubscriptionError);

            if (subscription) {
                setSubscribed(true);
                sendSubscriptionConfirmation();
            }
    }, [handleMessageReceived, sendSubscriptionConfirmation, handleSubscriptionError]);

    useEffect(() => {
        clearChats();

        const socket = new SockJS(SERVER_BASE_URL + STOMP_ENDPONT);
        socketRef.current = socket;

        const client = Stomp.over(socket);
        setStompClient(client);

        client.connect({ userName, selectedIconNumber }, onSocketConnect, onConnectionError);
        socket.onclose = handleDisconnection;

        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log("Disconnected");
                    setConnected(false);
                });
            }
        };
    }, [userName, selectedIconNumber, clearChats]);

    useEffect(() => {
        if (stompClient && connected && !subscribed) {
            subscribeToRoom(stompClient, roomCode);
        }
    }, [stompClient, connected, roomCode, subscribed, subscribeToRoom]);

    useEffect(() => {
        if (subscribed) {
            sendSubscriptionConfirmation();
        }
    }, [subscribed, sendSubscriptionConfirmation]);

    const sendMessage = useCallback((message) => {
        if (stompClient && stompClient.connected) {
            stompClient.send(SERVER_CHAT_ENDPOINT, {}, JSON.stringify({ from: userName, text: message, roomCode }));
        }
    }, [userName, roomCode, stompClient]);

    return {
        connected,
        subscribed,
        userId,
        hostUserId,
        isHost,
        sendMessage,
        players,
        stompClient,
        setGameUpdateHandler,
        setRoomUpdateHandler,
    };
}

useRoom.propTypes = {
    roomCode: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    selectedIconNumber: PropTypes.number.isRequired,
};

export default useRoom;