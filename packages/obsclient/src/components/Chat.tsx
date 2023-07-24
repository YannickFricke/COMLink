import { Message } from '@comlink/framework/dist/entity/Message';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useScroll } from '../hooks/useScroll';
import { ChatMessage } from './ChatMessage';

interface IChatProps {
    messages: Message[];
}

const StyledChat = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

export const Chat: React.FC<IChatProps> = ({ messages }) => {
    const { ref, scrollToLastItem } = useScroll({
        threshold: 100,
    });

    useEffect(() => {
        scrollToLastItem();
    }, [messages]);

    return (
        <StyledChat ref={ref}>
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}
        </StyledChat>
    );
};
