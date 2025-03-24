'use client';

import { useState, useEffect, createContext } from 'react';
import { useRouter } from 'next/navigation';
import { isWalletConnected, connectWallet, connectingWithContract } from '../utils/apiFeature';

interface ChatAppContextType {
    readMessage: (friendPubKey: string) => Promise<void>;
    createAccount: (name: string) => Promise<void>;
    addFriend: (friendPubKey: string, friendName: string) => Promise<void>;
    sendMessage: (friendPubKey: string, message: string) => Promise<void>;
    getAllUsers: () => Promise<void>;
    Account: string;
    userName: string;
    friendLists: any[];
    friendMsg: any[];
    loading: boolean;
    userLists: any[];
    error: string;
    currUserName: string;
    currUserPubKey: string;
}

export const ChatAppContext = createContext<ChatAppContextType | null>(null);

export const useChatAppProvider = () => {
    const [Account, setAccount] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [friendLists, setFriendLists] = useState<any[]>([]);
    const [friendMsg, setFriendMsg] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userLists, setUserLists] = useState<any[]>([]);
    const [error, setError] = useState<string>("");
    const [currUserName, setCurrUserName] = useState<string>("");
    const [currUserPubKey, setCurrUserPubKey] = useState<string>("");

    const router = useRouter();

    // Fetch data on page load
    const fetchData = async () => {
        try {
            const contract = await connectingWithContract();
            const connectAccount = await connectWallet();
            
            setAccount(connectAccount);
            if (contract) {
                const userName = await contract.getUser(connectAccount);
                setUserName(userName);

                const myFriendList = await contract.getMyFriends();
                setFriendLists(myFriendList);

                const allUserList = await contract.getAllUsers();
                setUserLists(allUserList);
            }
        } catch (e) {
            setError("Please install and connect your wallet");
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Read messages
    const readMessage = async (friendPubKey: string) => {
        try {
            const contract = await connectingWithContract();
            if (contract) {
                const messages = await contract.readMessage(friendPubKey);
                setFriendMsg(messages);
            }
        } catch (e) {
            setError("Error reading messages");
            console.error(e);
        }
    };

    // Create account
    const createAccount = async (name: string) => {
        try {
            if (!name) return setError("Please enter a name");

            const contract = await connectingWithContract();
            if (contract) {
                setLoading(true);
                const tx = await contract.createNewUser(name);
                await tx.wait();
                setLoading(false);
                fetchData();
            }
        } catch (e) {
            setError("Error while creating account");
            console.error(e);
        }
    };

    // Add friend
    const addFriend = async (friendPubKey: string, friendName: string) => {
        try {
            if (!friendName || !friendPubKey) return setError("Please enter friend's name and address");

            const contract = await connectingWithContract();
            if (contract) {
                setLoading(true);
                const tx = await contract.addFriend(friendPubKey, friendName);
                await tx.wait();
                setLoading(false);
                router.push("/");
                window.location.reload();
            }
        } catch (e) {
            setError("Error while adding friend");
            console.error(e);
        }
    };

    // Send message
    const sendMessage = async (friendPubKey: string, message: string) => {
        try {
            if (!friendPubKey || !message) return setError("Please enter a message");

            const contract = await connectingWithContract();
            if (contract) {
                setLoading(true);
                const tx = await contract.sendMessage(friendPubKey, message);
                await tx.wait();
                setLoading(false);
                router.push("/");
                window.location.reload();
            }
        } catch (e) {
            setError("Error while sending message");
            console.error(e);
        }
    };

    // Fetch all users
    const getAllUsers = async () => {
        try {
            const contract = await connectingWithContract();
            if (contract) {
                const allUsers = await contract.getAllUsers();
                setUserLists(allUsers);
            }
        } catch (e) {
            setError("Error fetching users");
            console.error(e);
        }
    };

    // Read user info (Fetch `currentUserName` & `currentUserAddress`)
    const readUserInfo = async (friendPubKey: string) => {
        try {
            const contract = await connectingWithContract();
            if (contract) {
                const userInfo = await contract.getUser(friendPubKey);
                setCurrUserName(userInfo);
                setCurrUserPubKey(friendPubKey);
            }
        } catch (e) {
            setError("Error fetching user info");
            console.error(e);
        }
    };

    // Check if wallet is connected
    useEffect(() => {
        const checkWalletConnection = async () => {
            try {
                const account = await isWalletConnected();
                if (account) {
                    setAccount(account);
                    readUserInfo(account); // Fetch current user's name & address
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        };
        checkWalletConnection();
    }, []);

    return {
        readMessage,
        createAccount,
        addFriend,
        sendMessage,
        getAllUsers,
        readUserInfo, // function to get current user's info
        Account,
        userName,
        friendLists,
        friendMsg,
        loading,
        userLists,
        error,
        currUserName,
        currUserPubKey,
    };
};
