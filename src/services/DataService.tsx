import { environment } from "../environment";

const BASE_URL = environment.domainUrl;

const dataService = {
    setBearerToken: () => {
        const modifyHeaders = (headers: Headers) => {
            headers.set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
        };
        return modifyHeaders;
    },
    signup: async (userData: User) => {
        try {
            const response = await fetch(BASE_URL + `db/signup`, {
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
    login: async (loginData: User) => {
        try {
            const response = await fetch(`${BASE_URL}/db/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },
    addPersonalExpenseViaLLM: async (userMessage: string) => {
        try {
            const response = await fetch(`${BASE_URL}/llm/expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestData: { sentence: userMessage } }),
            });

            if (!response.ok) {
                throw new Error('Expense conversion failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error converting expense:', error);
            throw error;
        }
    },
    createExpense: async (expenseData: Expense) => {
        try {
            const headers = new Headers();
            const modifyHeaders = dataService.setBearerToken();
            modifyHeaders(headers);
            const response = await fetch(`${BASE_URL}/db/expense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify(expenseData),
            });

            if (!response.ok) {
                throw new Error('Failed to create expense');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating expense:', error);
            throw error;
        }
    },
    getExpensesForUser: async () => {
        try {
            const response = await fetch(`${BASE_URL}/db/expenses/personal`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error making GET request:', error);
            throw error;
        }
    },
    getUserEvents: async () => {
        try {
            const response = await fetch(`${BASE_URL}/db/user/events`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    getDuesForUser: async (event_id: string) => {
        try {
            const response = await fetch(`${BASE_URL}db/user/event/${event_id}/dues`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },

};

export default dataService;
