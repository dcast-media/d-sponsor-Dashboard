'use client';
import {ThemeProvider} from "next-themes";
import {NextUIProvider} from "@nextui-org/react";
import UserContext from "../components/UserContext";
import {useRef} from "react";
import Header from "../containers/Header/Header";
// import Wallet_modal from "../components/modal/wallet_modal";
import BidsModal from "../components/modal/bidsModal";
import Footer from "../components/layout/footer/footer";
import ToastProvider from "../providers/ToastProvider/ToastProvider";

export default function ThemeLayout({children}) {
    const scrollRef = useRef({
        scrollPos: 0,
    });
    return (
        <NextUIProvider>
            <ThemeProvider enableSystem={true} attribute="class" defaultTheme="dark">
                <ToastProvider>
                    <UserContext.Provider value={{scrollRef: scrollRef}}>
                        <Header/>
                        {/*<Wallet_modal/>*/}
                        <BidsModal/>
                        {children}
                        <Footer/>
                    </UserContext.Provider>
                </ToastProvider>
            </ThemeProvider>
        </NextUIProvider>
    )
}
