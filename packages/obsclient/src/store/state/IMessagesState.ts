import { Message } from '@comlink/framework/dist/entity/Message';

export interface IMessagesState {
    messages: Message[];
    filteredIds: string[];
}
