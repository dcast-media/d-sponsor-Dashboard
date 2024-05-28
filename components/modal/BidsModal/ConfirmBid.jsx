import {useAddress} from "@thirdweb-dev/react";
import React from "react";

const ConfirmBid = ({ bidFunc }) => {
    // const { status, connect, account, chainId, ethereum } = useMetaMask();


    const address = useAddress();
    const status = (address !== null) ? "connected" : "notConnected";
    if (status === "initializing")
        return (
            <button
                type="button"
                className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
            >
                initializing
            </button>
        );

    if (status === "unavailable")
        return (
            <button
                type="button"
                className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
            >
                unavailable
            </button>
        );

    if (status === "notConnected")
        return (
            <button
                type="button"
                className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                onClick={connect}
            >
                Confirm Bid
            </button>
        );

    if (status === "connecting")
        return (
            <button
                type="button"
                className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
            >
                connecting
            </button>
        );

    if (status === "connected")
        return (
            <button
                type="button"
                className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                onClick={bidFunc}
            >
                Confirm Checkout
            </button>
        );
};

export default ConfirmBid;
