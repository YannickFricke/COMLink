import { Message } from '@comlink/framework/dist/entity/Message';
import format from 'date-fns/format';
import React from 'react';
import styled from 'styled-components';

interface IChatMessageProps {
    message: Message;
}

const StyledChatMessage = styled.div`
    border: 1px solid white;
    margin-top: 1rem;
`;

const StyledChatMessageHeader = styled.div`
    padding: 1rem;
    border-bottom: 1px solid white;
`;

const StyledChatMessageBody = styled.div`
    padding: 1rem;
`;

export const ChatMessage: React.FC<IChatMessageProps> = ({
    message: { sender, recipient, timestamp, content },
}) => {
    const parsedTimestamp = new Date(timestamp);

    return (
        <StyledChatMessage>
            <StyledChatMessageHeader>
                {sender} an {recipient} am {format(parsedTimestamp, 'dd.MM.y')}{' '}
                um {format(parsedTimestamp, 'HH:mm:ss')}
            </StyledChatMessageHeader>
            <StyledChatMessageBody>{content}</StyledChatMessageBody>
        </StyledChatMessage>
    );
};
