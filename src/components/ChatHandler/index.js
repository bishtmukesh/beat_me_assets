import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useStoreState } from 'easy-peasy';

import bgImage from '../../assets/images/chatBackground/bg1.png';
import UserIcon from '../UserIcon';

const MessagesArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
});

const MessageBubble = styled(Box)(({ theme, self }) => ({
  display: 'flex',
  justifyContent: self ? 'flex-end' : 'flex-start',
  marginBottom: '10px',
}));

const MessageContent = styled(Paper)(({ theme, self }) => ({
  padding: '10px 15px',
  borderRadius: '20px',
  maxWidth: '70%',
  backgroundColor: self ? theme.palette.primary.main : theme.palette.grey[300],
  color: self ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

const InputArea = styled(Box)({
  display: 'flex',
  padding: '20px'
});

const StyledTextField = styled(TextField)({
  flex: 1,
  marginRight: '10px',
});

const ChatHandler = ( { sendMessage, userId } ) => {

  const chats = useStoreState(state => state.roomChat.chats);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <Paper 
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '20px',
            backgroundColor: 'white',
            border: '1px solid black',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
        }}
    >
        <MessagesArea>
            {chats.map((chat, index) => (
                <MessageBubble key={index} self={chat.senderUserId === userId}>
                    <UserIcon
                        selectedIconNumber={1}
                        setSelectedIconNumber={null}
                        width={35}
                        height={35} 
                        allowSelection={false}
                    />
                    <Box>
                        <MessageContent self={chat.senderUserId === userId}>
                            <Typography variant="body1">{chat.text}</Typography>
                        </MessageContent>
                        <Typography variant="caption" color="textSecondary">
                            {chat.time}
                        </Typography>
                    </Box>
                </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
        </MessagesArea>
        <InputArea>
            <StyledTextField
                variant="outlined"
                placeholder="Type a message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
            >
                Send
            </Button>
        </InputArea>
    </Paper>
  );
};

ChatHandler.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
};

export default ChatHandler;
