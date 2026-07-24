import { createContext } from 'react';

// Holds the shape: { user, loading, login, signup, googleSignIn, logout, forgetPassword }
export const AuthContext = createContext(null);
