'use client'
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [info, setInfo] = useState({
        name: '',
        idd: ''
    });
    const [userList,setUserList] = useState([])

    const setUser = (name, idd) => {
        setInfo({ name, idd });
    };

    const addUser = (user) => {
        setUserList([...userList,user])
    }

    const clearUser = () => {
        setInfo({ name: '', idd: '' });
    };

    const removeUser = (userId) => {
        setUserList(userList.filter(user=>user.idd !== userId))
    }

    const value = {
        info,
        setUser,
        userList,
        addUser,
        removeUser,
        clearUser,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
