import { combineReducers } from 'redux';
import AuthReducer from '../ducks/auth.duck';
import ContactReducer from '../ducks/contact.duck';
import { MessagesReducer } from '../ducks/message.duck';
import PlayersReducer from '../ducks/players.duck';
import UserReducer from '../ducks/user.duck';
import { IAuthState } from '../state/IAuthState';
import { IContactsState } from '../state/IContactsState';
import { IMessagesState } from '../state/IMessagesState';
import { IPlayersState } from '../state/IPlayersState';
import { IUserState } from '../state/IUserState';

export interface IStoreState {
    auth: IAuthState;
    contacts: IContactsState;
    user: IUserState;
    messages: IMessagesState;
    players: IPlayersState;
}

export const rootReducer = combineReducers({
    auth: AuthReducer,
    contacts: ContactReducer,
    user: UserReducer,
    messages: MessagesReducer,
    players: PlayersReducer,
});
