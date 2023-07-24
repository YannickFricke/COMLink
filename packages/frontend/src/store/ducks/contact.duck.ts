import { Contact } from '@comlink/framework/dist/entity/Contact';
import { IContactsState } from '../../store/state/IContactsState';

enum Actions {
    Add = 'Contacts.Add',
    Edit = 'Contacts.Edit',
    Delete = 'Contacts.Delete',
    Fetched = 'Contacts.Fetched',
}

export const initialState: IContactsState = {
    contacts: [],
};

export const FetchedContacts = (contacts: Contact[]) => ({
    type: Actions.Fetched,
    contacts,
});

export const AddContact = (contact: Contact) => ({
    type: Actions.Add,
    contact,
});

export const EditContact = (contact: Contact) => ({
    type: Actions.Edit,
    contact,
});

export const DeleteContact = (contactId: string) => ({
    type: Actions.Add,
    contactId,
});

type ContactActions = ReturnType<typeof FetchedContacts> &
    ReturnType<typeof AddContact> &
    ReturnType<typeof EditContact> &
    ReturnType<typeof DeleteContact>;

export default function ContactReducer(
    state?: IContactsState,
    action?: ContactActions,
): IContactsState {
    if (state === undefined) {
        return initialState;
    }

    switch (action?.type) {
        case Actions.Fetched:
            return {
                contacts: action.contacts,
            };
        case Actions.Add:
            return {
                contacts: state.contacts.concat(action.contact),
            };
        case Actions.Edit:
            const { contact } = action;

            return {
                contacts: state.contacts.map((storedContact) => {
                    if (storedContact.id !== contact.id) {
                        return storedContact;
                    }

                    return contact;
                }),
            };
        case Actions.Delete:
            return {
                contacts: state.contacts.filter(
                    (contact) => contact.id !== action.contactId,
                ),
            };
    }

    return state;
}
