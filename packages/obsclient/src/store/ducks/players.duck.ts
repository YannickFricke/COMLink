import { Player } from '../../definitions/Player';
import { IPlayersState } from '../state/IPlayersState';

enum Actions {
    FETCHED = 'Players.Fetched',
    RESET = 'Players.Reset',
}

export const initialState: IPlayersState = {
    players: [],
};

export const FetchedPlayers = (players: Player[]) => ({
    type: Actions.FETCHED,
    players,
});

export const ResetPlayers = () => ({
    type: Actions.RESET,
});

type PlayerActions = ReturnType<typeof FetchedPlayers> &
    ReturnType<typeof ResetPlayers>;

export default function PlayersReducer(
    state?: IPlayersState,
    action?: PlayerActions,
): IPlayersState {
    if (state === undefined) {
        return initialState;
    }

    switch (action?.type) {
        case Actions.FETCHED:
            return {
                ...state,
                players: action.players,
            };
        case Actions.RESET:
            return {
                ...state,
                players: [],
            };
    }

    return state;
}
