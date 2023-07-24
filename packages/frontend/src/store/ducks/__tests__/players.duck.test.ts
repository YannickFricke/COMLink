import { Player } from '../../../definitions/Player';
import PlayersReducer, {
    FetchedPlayers,
    initialState,
    ResetPlayers,
} from '../players.duck';

describe('player duck', () => {
    const testPlayer: Player = {
        id: 'test-id',
        username: 'test player',
    };

    describe('state', () => {
        it('should return the initial state when no state was given', () => {
            const state = PlayersReducer(undefined, undefined);

            expect(state).toBe(initialState);
        });

        it('should return the current state when no action was given', () => {
            const state = PlayersReducer(initialState, undefined);

            expect(state).toBe(initialState);
        });
    });

    describe('actions', () => {
        it('should set the fetched players', () => {
            const state = PlayersReducer(
                initialState,
                FetchedPlayers([testPlayer]),
            );

            expect(state.players).toHaveLength(1);
            expect(state.players).toContain(testPlayer);
        });

        it('should reset the players', () => {
            const state = PlayersReducer(
                {
                    players: [testPlayer],
                },
                ResetPlayers() as any,
            );

            expect(state.players).toHaveLength(0);
        });
    });
});
