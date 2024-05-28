'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {useAddress, useChainId} from "@thirdweb-dev/react";
import ChainContext from "../../contexts/ChainContext";
import ethereumSepolia from "./configs/chains/ethereum-sepolia";
import getCurrencyByAddress from "./methods/getCurrencyByAddress";
import getCurrencyAddress from "./methods/getCurrencyAddress";
import getChainName from "./methods/getChainName";

const configs = {
    sepolia: ethereumSepolia
};


const ChainProvider = ({ children }) => {
    const chainId = useChainId();
    const connectedAddress = useAddress();

    const [currentChainId, setCurrentChainId] = useState(11155111);
    const [currentChainName, setCurrentChainName] = useState('sepolia');

    useEffect(() => {
        setCurrentChainId(chainId);
        setCurrentChainName(getChainName(chainId));
    }, [chainId]);


    const value = useMemo(() => {
        return {
            chainId: currentChainId,
            connectedAddress: connectedAddress,
            chainName: currentChainName,
            getChainName: (chainId) => {
                return getChainName(chainId);
            },
            getCurrencyAddress: (currency) => {
                return getCurrencyAddress(currentChainName, currency);
            },
            getCurrencyByAddress: (address) => {
               return getCurrencyByAddress(currentChainName, address);
            },
            getChainExplorerPath: () => {
                return configs[currentChainName].explorer;
            }
        };
    });

    return (
        <ChainContext.Provider value={value}>
            {children}
        </ChainContext.Provider>
    );
};

export default ChainProvider;
