import React, { useState } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

/**
 * AuthProvider (UI-only placeholder)
 * -----------------------------------
 * This provider intentionally does NOT call Firebase or any backend API.
 * It only manages local UI state so the Login / SignUp screens and the
 * private-route guard behave correctly while you are wiring up your own
 * authentication service.
 *
 * Swap the function bodies below with real calls (Firebase, Auth0, your
 * own REST API, etc.) when you are ready to connect a backend.
 */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Simulates a signup — just stores the provided info as the "user".
    const signup = ({ name, email, photoURL }) => {
        setLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeUser = { displayName: name, email, photoURL: photoURL || null };
                setUser(fakeUser);
                setLoading(false);
                resolve(fakeUser);
            }, 500);
        });
    };

    // Simulates a login — accepts any email/password combination.
    const login = (email) => {
        setLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeUser = { displayName: email.split('@')[0], email, photoURL: null };
                setUser(fakeUser);
                setLoading(false);
                resolve(fakeUser);
            }, 500);
        });
    };

    // Simulates a Google sign-in button — no real OAuth call.
    const googleSignIn = () => {
        setLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeUser = { displayName: 'Google User', email: 'google.user@example.com', photoURL: null };
                setUser(fakeUser);
                setLoading(false);
                resolve(fakeUser);
            }, 500);
        });
    };

    const logout = () => {
        setLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                setUser(null);
                setLoading(false);
                resolve();
            }, 300);
        });
    };

    // UI-only placeholder — just resolves, no email is actually sent.
    const forgetPassword = () => Promise.resolve();

    const authInfo = {
        user,
        loading,
        setUser,
        login,
        signup,
        googleSignIn,
        logout,
        forgetPassword,
    };

    return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
