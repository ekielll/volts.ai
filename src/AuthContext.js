// src/AuthContext.js

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    // REMOVED: The 'loading' state is no longer needed in this component.

    const fetchProfile = useCallback(async (userId) => {
        try {
            const { data: userProfile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
    
            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
                throw error;
            }
            setProfile(userProfile ?? null);
        } catch (error) {
            console.error("AuthContext Error: Failed to fetch profile.", error);
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                try {
                    const currentUser = session?.user;
                    if (currentUser?.id !== user?.id) {
                        setUser(currentUser ?? null);
                        if (currentUser) {
                            await fetchProfile(currentUser.id);
                        } else {
                            setProfile(null);
                        }
                    }
                } catch (e) {
                    console.error("An error occurred during auth state change.", e);
                }
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, [user?.id, fetchProfile]);

    const value = useMemo(() => ({
        user,
        profile,
        signOut: () => supabase.auth.signOut(),
        refreshProfile: () => {
            if (user) {
                fetchProfile(user.id);
            }
        },
    }), [user, profile, fetchProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};