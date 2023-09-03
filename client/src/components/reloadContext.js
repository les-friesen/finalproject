import { createContext, useState } from "react";

// State for prompting re-renders on the app after any changes are made. 
// Also used to handle some specific loading states. 
// I put it in a Context provider to avoid too much prop drilling.  

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