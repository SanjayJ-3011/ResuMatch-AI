export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

const STORAGE_KEY = 'resumatch_user_session';

export const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock Admin Credentials
    if (email === 'admin@resumatch.ai' && password === 'admin') {
      const user: User = {
        id: '1',
        name: 'Alex Admin',
        email: 'admin@resumatch.ai',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Admin&background=4f46e5&color=fff'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Mock User Credentials
    if (email === 'user@resumatch.ai' && password === 'user') {
      const user: User = {
        id: '2',
        name: 'Jordan Seeker',
        email: 'user@resumatch.ai',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Jordan+Seeker&background=059669&color=fff'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid email or password');
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};