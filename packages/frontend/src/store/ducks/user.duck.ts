import { User } from '@comlink/framework/src/entity/User';
import { IUserState } from '../state/IUserState';

enum Actions {
    FETCHED = 'Fetched',
}

export const initialState: IUserState = {
    user: undefined,
};

export const FetchedUser = (user: User) => ({
    type: Actions.FETCHED,
    user,
});

type UserActions = ReturnType<typeof FetchedUser>;

export default function UserReducer(
    state?: IUserState,
    action?: UserActions,
): IUserState {
    if (state === undefined) {
        return initialState;
    }

    switch (action?.type) {
        case Actions.FETCHED:
            return {
                ...state,
                user: action.user,
            };
    }

    return state;
}
