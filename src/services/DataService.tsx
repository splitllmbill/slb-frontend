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
            const response = await fetch(BASE_URL + `/db/signup`, {
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
    getExpenseById: async (expenseId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/db/expense/${expenseId}`, {
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
    createEvent: async (eventData: EventObject) => {
        console.log(eventData)
        try {
            const response = await fetch(`${BASE_URL}/db/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify(eventData),
            });

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
            const response = await fetch(`${BASE_URL}/db/user-by-email/${emailID}`, {
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
    getAllUsers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/db/users`, {
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
    getEvent: async (event_id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/db/event/${event_id}`, {
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
    getEventExpenses: async (event_id: string) => {
        try {
            const response = await fetch(`${BASE_URL}/db/event/${event_id}/expenses`, {
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
    getUserAccount: async () => {
        try {
            const response = await fetch(`${BASE_URL}/db/useraccount`, {
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
    updateUserAccount: async (account: { upiId: string, upiNumber: string }) => {
        try {
            const response = await fetch(`${BASE_URL}/db/useraccount`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify(account)

            });

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
            const response = await fetch(`${BASE_URL}/db/user/friends`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            });

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
            const response = await fetch(`${BASE_URL}/db/user/expense/friend/${friend_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            });

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
            const response = await fetch(`${BASE_URL}/db/user/event/${event_id}/dues`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            });

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
            const response = await fetch(`${BASE_URL}//db/expense/nongroup`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching event expenses:', error);
            throw error;
        }
    },
    getEventUsers: async (id: string, type: string) => {
        try {
            const response = await fetch(`${BASE_URL}/db/${type}/${id}/users`, {
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
    deleteEvent: async (eventId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/db/event/${eventId}`, {
                method: 'DELETE',
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
    addFriend: async (friendCode: string) => {
        try {
            const response = await fetch(BASE_URL + `/db/addFriend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify({ "friendCode": friendCode }),
            });

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
            const response = await fetch(BASE_URL + `/db/deleteFriend`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify({ "friendCode": friendCode }),
            });

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
};

export default dataService;
