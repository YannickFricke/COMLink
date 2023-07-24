import { Message } from '@comlink/framework/dist/entity/Message';
import { IMessagesState } from '../state/IMessagesState';

enum Actions {
    Add            = 'Message.Add',
    Edit           = 'Message.Edit',
    Delete         = 'Message.Delete',
    Fetched        = 'Message.Fetched',
    SetFilteredIds = 'Message.Filter.SetIds',
}

export const initialState: IMessagesState = {
    messages: [],
    filteredIds: [],
};

export const FetchedMessages = (messages: Message[]) => ({
    type: Actions.Fetched,
    messages,
});

export const AddMessage = (message: Message) => ({
    type: Actions.Add,
    message,
});

export const EditMessage = (message: Message) => ({
    type: Actions.Edit,
    message,
});

export const DeleteMessage = (messageId: string) => ({
    type: Actions.Delete,
    messageId,
});

export const SetFilteredIds = (filteredIds: string[]) => ({
    type: Actions.SetFilteredIds,
    filteredIds,
});

type MessageActions = ReturnType<typeof FetchedMessages> &
    ReturnType<typeof AddMessage> &
    ReturnType<typeof EditMessage> &
    ReturnType<typeof DeleteMessage> &
    ReturnType<typeof SetFilteredIds>;

export const MessagesReducer = (
    state?: IMessagesState,
    action?: MessageActions,
): IMessagesState => {
    if (state === undefined) {
        return initialState;
    }

    switch (action?.type) {
        case Actions.Fetched:
            return {
                ...state,
                messages: action.messages,
            };

        case Actions.Add:
            return {
                ...state,
                messages: [...state.messages, action.message],
            };

        case Actions.Edit:
            const editedMessage: Message = action.message;

            return {
                ...state,
                messages: state.messages.map((message) => {
                    if (message.id !== editedMessage.id) {
                        return message;
                    }

                    return editedMessage;
                }),
            };

        case Actions.Delete:
            return {
                ...state,
                messages: state.messages.filter(
                    (message) => message.id !== action.messageId,
                ),
            };

        case Actions.SetFilteredIds:
            return {
                ...state,
                filteredIds: action.filteredIds,
            };
    }

    return state;
};
