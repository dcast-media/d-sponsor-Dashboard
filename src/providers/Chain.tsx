import React, { useState, useEffect, useMemo, ReactNode } from "react";
import { useChainId, useAddress } from "@thirdweb-dev/react";
import ChainContext from "@/contexts/chain";
import config from "@/config/config";
import type { ChainObject } from "@/types/chain";
import { Address } from "thirdweb";

interface ChainProviderProps {
  children: ReactNode;
}

interface ChainContextValue {
  currentChainObject: ChainObject | null;
  connectedAddress: Address | null;
}

const ChainProvider = ({ children }: ChainProviderProps) => {
  const chainId = useChainId();
  const connectedAddress = useAddress();
  const [currentChainObject, setCurrentChainObject] = useState<ChainObject | null>(null);

  useEffect(() => {
    if (config[chainId as number]) {
      setCurrentChainObject(config[chainId as number] as ChainObject);
    } else {
      const [firstChainId, firstChainConfig] = Object.entries(config)[0];
      console.warn(`Unknown chainId: ${chainId} - Using default chainId: ${firstChainId}`);
      setCurrentChainObject(firstChainConfig);
    }
  }, [chainId]);

  const value = useMemo<ChainContextValue>(
    () => ({
      currentChainObject,
      connectedAddress: connectedAddress as Address | null
    }),
    [currentChainObject, connectedAddress]
  );

  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
};

export default ChainProvider;
