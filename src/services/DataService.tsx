import { environment } from "../environment";

const BASE_URL = environment.domainUrl;

const dataService = {
    signup: async (userData: User) => {
        try {
            const response = await fetch(BASE_URL+`db/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during signup:', error);
            throw error;
        }
    },
};

export default dataService;
