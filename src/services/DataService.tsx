const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import fetchInterceptor from "./Interceptor";

const dataService = {
    signup: async (userData: User) => {
        try {
            const response = await fetch(BASE_URL + `/db/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data['message']);
            }
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
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },
    logout: async () => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/logout`, 'POST', false);
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
    changePassword: async (requestData: { password: string }) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/changePassword`, 'PUT', true, JSON.stringify(requestData));
            if (!response.ok) {
                throw new Error('Cannot change password');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during change password:', error);
            throw error;
        }
    },
    forgotPassword: async (requestData: { email: string }) => {
        try {
            const response = await fetch(`${BASE_URL}/db/forgotPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Cannot change password');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during change password:', error);
            throw error;
        }
    },
    addPersonalExpenseViaLLM: async (userMessage: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/llm/expense`, 'POST', true, JSON.stringify({ requestData: { sentence: userMessage } }));
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
            const response = await fetchInterceptor(`${BASE_URL}/db/expense`, 'POST', true, JSON.stringify(expenseData));
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
            const response = await fetchInterceptor(`${BASE_URL}/db/expenses/personal`, 'GET', false);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error making GET request:', error);
            throw error;
        }
    },
    getExpenseById: async (expenseId: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/expense/${expenseId}`, 'GET', false);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error making GET request:', error);
            throw error;
        }
    },
    getUserEvents: async () => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user/events`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    createEvent: async (eventData: EventObject) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/event`, 'POST', true, JSON.stringify(eventData));
            if (!response.ok) {
                console.log(response.json())
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    editEvent: async (eventData: EventObject) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/event`, 'PUT', true, JSON.stringify(eventData));
            if (!response.ok) {
                console.log(response.json())
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    getUserByEmail: async (emailID: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user-by-email/${emailID}`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    getAllUsers: async () => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/users`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    getEvent: async (event_id: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/event/${event_id}`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    getEventExpenses: async (event_id: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/event/${event_id}/expenses`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    getUserAccount: async () => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user/account`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    updateUserAccount: async (account: { upiId: string, name: string }) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user/account`, 'PUT', true, JSON.stringify(account));
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching event expenses:', error);
            throw error;
        }
    },
    getFriendsList: async () => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user/friends`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching event expenses:', error);
            throw error;
        }
    },
    getFriendDetails: async (friend_id: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user/expense/friend/${friend_id}`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching event expenses:', error);
            throw error;
        }
    },
    getUserSummaryForEvent: async (event_id: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user/event/${event_id}/dues`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching event expenses:', error);
            throw error;
        }
    },
    getNonGroupExpenses: async () => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/expense/nongroup`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching event expenses:', error);
            throw error;
        }
    },
    getPossibleUsersForExpense: async (id: string, type: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/${type}/${id}/users`, 'GET', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    deleteEvent: async (eventId: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/event/${eventId}`, 'DELETE', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },
    addFriend: async (friendCode: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/addFriend`, 'POST', true, JSON.stringify({ "friendCode": friendCode }));
            if (!response.ok) {
                throw new Error('Add friend failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Add friend failed:', error);
            throw error;
        }
    },
    deleteFriend: async (friendCode: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/deleteFriend`, 'DELETE', true, JSON.stringify({ "friendCode": friendCode }));
            if (!response.ok) {
                throw new Error('Add friend failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Add friend failed:', error);
            throw error;
        }
    },
    generateVerificationCode: async (type: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/verification/generate`, 'POST', true, JSON.stringify({ "type": type }));
            if (!response.ok) {
                throw new Error('Verification failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Verification failed:', error);
            throw error;
        }
    },
    validateVerificationCode: async (type: string, code: string, field: number) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/verification/validate`, 'POST', true, JSON.stringify({
                "type": type,
                "code": code,
                "field": field
            }));
            if (!response.ok) {
                throw new Error('Verification failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Verification failed:', error);
            throw error;
        }
    },
    fileUpload: async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetchInterceptor(`${BASE_URL}/llm/upload`, 'POST', false, formData);
            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    },
    deleteExpense: async (expenseId: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/expense/${expenseId}`, 'DELETE', false);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching user expenses:', error);
            throw error;
        }
    },
    generateUPIQR: async (amount: number, note: string, destination: string = 'self') => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/upi/QR`, 'POST', true, JSON.stringify({
                "destination": destination,
                "amount": amount,
                "note": note
            }));
            if (!response.ok) {
                throw new Error('Failed to generate QR');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to generate QR', error);
            throw error;
        }
    },
    generateUPILink: async (amount: number, note: string, destination: string = 'self') => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/upi/link`, 'POST', true, JSON.stringify({
                "destination": destination,
                "amount": amount,
                "note": note
            }));
            if (!response.ok) {
                throw new Error('Failed to generate UPI link');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to generate UPI link', error);
            throw error;
        }
    },
    settleUpWithFriend: async (friendId: string) => {
        try {
            const response = await fetchInterceptor(`${BASE_URL}/db/user/expense/friend/${friendId}/settleup`, 'POST', false);
            if (!response.ok) {
                throw new Error('Settle failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Settle failed:', error);
            throw error;
        }
    },
};

export default dataService;
