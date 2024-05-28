'use client';
import {Sepolia} from "@thirdweb-dev/chains";
import {
    coinbaseWallet,
    embeddedWallet,
    localWallet,
    metamaskWallet,
    ThirdwebProvider,
    walletConnect
} from "@thirdweb-dev/react";
import ChainProvider from "./ChainProvider/ChainProvider";
import ApplicationProvider from "./ApplicationProvider/ApplicationProvider";

function Providers({children}) {
    return (
        <ThirdwebProvider
            activeChain={Sepolia}
            clientId="6f375d41f2a33f1f08f6042a65d49ec9"
            authConfig={{
                domain: "dsponsor.com",
            }}
            switchToActiveChain={true}
            supportedWallets={[
                metamaskWallet(),
                coinbaseWallet({recommended: true}),
                walletConnect(),
                localWallet(),
                embeddedWallet({
                    auth: {
                        options: ["email", "google", "apple", "facebook"],
                    },
                }),
            ]}
        >
            <ApplicationProvider>
                <ChainProvider>
                    {children}
                </ChainProvider>
            </ApplicationProvider>
        </ThirdwebProvider>
    );
}

export default Providers;
