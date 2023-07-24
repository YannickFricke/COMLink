import React from 'react';

interface IChatHeaderProps {
    chatterName: string;
}

export const ChatHeader: React.FC<IChatHeaderProps> = (props) => {
    return <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        paddingLeft: '1rem',
        fontSize: 20,
        borderBottom: '1px solid #ddd',
        width: '80vw',
        height: '3rem',
        top: 0,
    }}>
        {props.chatterName}
    </div>;
};
