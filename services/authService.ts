import type { User } from '../types';

const USERS_KEY = 'agroGeniusUsers';
const SESSION_KEY = 'agroGeniusSession';

// Helper to get users from localStorage
const getUsers = (): Record<string, { name: string; password: string }> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

// Helper to save users to localStorage
const saveUsers = (users: Record<string, { name: string; password: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
    signup: (name: string, email: string, password: string): { success: boolean; message?: string } => {
        const users = getUsers();
        const lowercasedEmail = email.toLowerCase();
        if (users[lowercasedEmail]) {
            return { success: false, message: 'userExists' };
        }
        users[lowercasedEmail] = { name, password }; // Note: In a real app, hash the password!
        saveUsers(users);
        return { success: true };
    },

    login: (email: string, password: string): { success: boolean; user?: User; message?: string } => {
        const users = getUsers();
        const lowercasedEmail = email.toLowerCase();
        const user = users[lowercasedEmail];
        if (user && user.password === password) {
            const sessionUser: User = { name: user.name, email: lowercasedEmail };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }
        return { success: false, message: 'invalidCredentials' };
    },

    logout: (): void => {
        localStorage.removeItem(SESSION_KEY);
    },

    getCurrentUser: (): User | null => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    isAuthenticated: (): boolean => {
        return localStorage.getItem(SESSION_KEY) !== null;
    },
};