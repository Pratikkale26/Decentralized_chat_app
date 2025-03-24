'use client';

import React, { useState, useEffect, ReactNode } from 'react'
import { isWalletConnected, connectWallet, connectingWithContract } from '../utils/apiFeature'
import { Contract } from 'ethers'

interface ChatAppContextType {
    title: string;
    currentAccount: string;
    connectWallet: () => Promise<void>;
    isWalletConnected: () => Promise<boolean>;
    connectingWithContract: () => Promise<Contract | undefined>;
}

const defaultContextValue: ChatAppContextType = {
    title: "Hello Hello welcome to Chat DApp",
    currentAccount: "",
    connectWallet: async () => {},
    isWalletConnected: async () => false,
    connectingWithContract: async () => undefined,
};

export const ChatAppContext = React.createContext<ChatAppContextType>(defaultContextValue);

interface ChatAppProviderProps {
    children: ReactNode;
}

export const ChatAppProvider: React.FC<ChatAppProviderProps> = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState<string>("");
    const title = "Hello Hello welcome to Chat DApp";

    const checkWalletConnection = async () => {
        try {
            const isConnected = await isWalletConnected();
            if (isConnected) {
                const account = await connectWallet();
                setCurrentAccount(account);
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        }
    };

    useEffect(() => {
        checkWalletConnection();
    }, []);

    return (
        <ChatAppContext.Provider 
            value={{
                title,
                currentAccount,
                connectWallet,
                isWalletConnected,
                connectingWithContract
            }}
        >
            {children}
        </ChatAppContext.Provider>
    );
}; 