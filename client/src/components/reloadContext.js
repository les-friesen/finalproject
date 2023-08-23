import { createContext, useState } from "react";

export const ReloadContext = createContext(null);

export const ReloadProvider = ({ children }) => {

    const [reload, setReload] = useState(); 

    const [isLoading, setIsLoading] = useState(); 

    return (
        <ReloadContext.Provider value={{reload, setReload, isLoading, setIsLoading}}>
            {children}
        </ReloadContext.Provider>
    )
};