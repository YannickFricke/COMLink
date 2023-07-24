import { IAuthState } from '../state/IAuthState';

/**
 * Defines all auth action names
 *
 * @enum {string}
 */
enum Actions {
    LOGGED_IN     = 'Auth.LoggedIn',
    LOGGED_OUT    = 'Auth.LoggedOut',
    SET_ENDPOINT  = 'Auth.SetEndpoint',
    SET_JWT_TOKEN = 'Auth.SetJWTToken',
}

export const SetLoggedIn = (jwtToken: string) => ({
    type: Actions.LOGGED_IN,
    jwtToken,
});

export const SetLoggedOut = () => ({
    type: Actions.LOGGED_OUT,
});

export const SetEndpoint = (endpoint: string) => ({
    type: Actions.SET_ENDPOINT,
    endpoint,
});

export const SetJWTToken = (jwtToken: string) => ({
    type: Actions.SET_JWT_TOKEN,
    jwtToken,
});

type AuthActions = ReturnType<typeof SetLoggedIn> &
    ReturnType<typeof SetLoggedOut> &
    ReturnType<typeof SetEndpoint> &
    ReturnType<typeof SetJWTToken>;

export const initialState: IAuthState = {
    // TODO: Set correct endpoint
    // endpoint: `${window.location.protocol}//${window.location.host}`,
    endpoint: 'http://localhost:3000',
    // jwt: '',
    // TODO: Remove JWT token
    jwt:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZjZDU5ZWNkLTk2ODItNGVmYS1hMmYxLWJkNjRmZDY2ODhlMyIsInVzZXJuYW1lIjoiYWRtaW4iLCJpc0dhbWVNYXN0ZXIiOnRydWUsImNvbnRhY3RzIjpbeyJpZCI6IjgyOWU1OTAwLWQyM2EtNDgzYi05ODU3LWExZmRmMzBiNDEwMSIsIm5hbWUiOiJCaW5hcnkiLCJvd25lciI6eyJpZCI6ImZjZDU5ZWNkLTk2ODItNGVmYS1hMmYxLWJkNjRmZDY2ODhlMyIsInVzZXJuYW1lIjoiYWRtaW4iLCJpc0dhbWVNYXN0ZXIiOnRydWV9fSx7ImlkIjoiNGUwMWU0ZmItODI4NS00Zjk2LTllMDUtYmNhYjYxYjYwMThlIiwibmFtZSI6IkRhcmt1cyIsIm93bmVyIjp7ImlkIjoiZmNkNTllY2QtOTY4Mi00ZWZhLWEyZjEtYmQ2NGZkNjY4OGUzIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzR2FtZU1hc3RlciI6dHJ1ZX19XSwiaWF0IjoxNjAxNjQzMzMwLCJleHAiOjE2MDE2ODY1MzB9.fSeJGqroasSKA3rAE7CDQC-EotZqWoEFGXW5RzB3pJen1S9f_YCqs0mqQS3BaIOgY0sszwHw7BxG18qVfrCuxA',
    // loggedIn: false,
    loggedIn: true,
};

/**
 * The reducer for backend related things.
 * It manages the following things:
 * - the endpoint (for the socket.io and http connection)
 * - the jwt token (for the user permissions)
 * - the logged in status (for setting up new routes for the user)
 *
 * @export
 * @param {(IAuthState | undefined)} state The current state or undefined when initializing
 * @param {AuthActions} action The action which was dispatched
 * @returns {IAuthState} The initial state when the current state is undefined.
 *                       The new state when the reducer matched the action.
 *                       The current state when no action was performed.
 */
export default function AuthReducer(
    state: IAuthState | undefined,
    action: AuthActions | undefined,
) {
    if (state === undefined) {
        return initialState;
    }

    switch (action?.type) {
        case Actions.LOGGED_IN:
            return {
                ...state,
                loggedIn: true,
                jwt: action.jwtToken,
            };
        case Actions.LOGGED_OUT:
            return {
                ...state,
                loggedIn: false,
                jwt: '',
            };
        case Actions.SET_ENDPOINT:
            return {
                ...state,
                endpoint: action.endpoint,
            };
        case Actions.SET_JWT_TOKEN:
            return {
                ...state,
                jwt: action.jwtToken,
            };
    }

    return state;
}
