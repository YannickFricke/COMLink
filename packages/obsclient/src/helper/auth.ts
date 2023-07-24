import { User } from '@comlink/framework/dist/entity/User';
import { useSelector } from 'react-redux';
import { Player } from '../definitions/Player';
import { IStoreState } from '../store/reducer/RootReducer';

export const isLoggedIn = () =>
    useSelector<IStoreState, boolean>((state) => state.auth.loggedIn);

export const getEndpoint = () =>
    useSelector<IStoreState, string>((state) => state.auth.endpoint);

export const getJWTToken = () =>
    useSelector<IStoreState, string | undefined>((state) => state.auth.jwt);

export const getUser = () =>
    useSelector<IStoreState, User>((state) => state.user.user!);

export const getPlayers = () =>
    useSelector<IStoreState, Player[]>((state) => state.players.players);
