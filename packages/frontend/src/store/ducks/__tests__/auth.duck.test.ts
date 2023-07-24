import { IAuthState } from '../../state/IAuthState';
import AuthReducer, {
    initialState,
    SetEndpoint,
    SetJWTToken,
    SetLoggedIn,
    SetLoggedOut,
} from '../auth.duck';

describe('Auth duck', () => {
    const testEndpoint = 'http://example.com';
    const testJWTToken = 'test-jwt';

    describe('state', () => {
        it('should return the initial state when no state was given', () => {
            const state = AuthReducer(undefined, undefined);

            expect(state).toBe(initialState);
        });

        it('should return the current state when the action is undefined', () => {
            const state = AuthReducer(initialState, undefined);

            expect(state).toBe(initialState);
        });
    });

    describe('Actions', () => {
        describe('login', () => {
            let state: IAuthState;

            beforeEach(() => {
                state = AuthReducer(
                    {
                        ...initialState,
                        loggedIn: false,
                        jwt: '',
                    },
                    SetLoggedIn(testJWTToken) as any,
                );
            });

            it('should set the logged in status', () => {
                expect(state.loggedIn).toBe(true);
            });

            it('should set the jwt token', () => {
                expect(state.jwt).toBe(testJWTToken);
            });
        });

        describe('logout', () => {
            let state: IAuthState;

            beforeEach(() => {
                state = AuthReducer(
                    {
                        ...initialState,
                        loggedIn: true,
                        jwt: testJWTToken,
                    },
                    SetLoggedOut() as any,
                );
            });

            it('should set the logged out status', () => {
                expect(state.loggedIn).toBe(false);
            });

            it('should reset the jwt token', () => {
                expect(state.jwt).toBe('');
            });
        });

        it('should set the endpoint', () => {
            const state = AuthReducer(
                initialState,
                SetEndpoint(testEndpoint) as any,
            );

            expect(state.endpoint).toBe(testEndpoint);
        });

        it('should set the jwt token', () => {
            const state = AuthReducer(
                initialState,
                SetJWTToken(testJWTToken) as any,
            );

            expect(state.jwt).toBe(testJWTToken);
        });
    });
});
