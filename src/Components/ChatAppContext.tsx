import React, { ReactNode } from "react";
import { ChatAppContext, useChatAppProvider } from "../Context/ChatAppContext";

export const ChatAppProvider = ({ children }: { children: ReactNode }) => {
    const chatAppContextValue = useChatAppProvider();

    if (!chatAppContextValue) {
        return <div>Loading...</div>;
    }

    return (
        <ChatAppContext.Provider value={chatAppContextValue}>
            {children}
        </ChatAppContext.Provider>
    );
};
