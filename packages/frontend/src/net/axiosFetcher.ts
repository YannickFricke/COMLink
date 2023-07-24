import axios from 'axios';

export const axiosFetcher = async (url: string, jwtToken: string) => (
    (await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
        },
    })).data
);
