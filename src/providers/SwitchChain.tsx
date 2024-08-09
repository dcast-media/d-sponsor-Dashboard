import React, { createContext, useState, useMemo, ReactNode } from "react";
import config from "@/config/config";

interface SwitchChainContextType {
  selectedChain: string;
  setSelectedChain: React.Dispatch<React.SetStateAction<string>>;
}

const SwitchChainContext = createContext<SwitchChainContextType | undefined>(undefined);

interface SwitchChainProviderProps {
  children: ReactNode;
}

const SwitchChainProvider: React.FC<SwitchChainProviderProps> = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState<string>(Object.values(config)[0]?.network);

  const contextValue = useMemo(() => {
    return {
      selectedChain,
      setSelectedChain
    };
  }, [selectedChain, setSelectedChain]);

  return <SwitchChainContext.Provider value={contextValue}>{children}</SwitchChainContext.Provider>;
};

export { SwitchChainProvider, SwitchChainContext };
