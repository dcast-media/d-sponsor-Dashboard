'use client';
import Footer from "../components/layout/footer/footer";
// import Wallet_modal from "./modal/wallet_modal";
import BidsModal from "./modal/bidsModal";

import Header from "../containers/Header/Header";

export default function Layout({ children }) {


  return (
    <>
      <Header />
      {/*<Wallet_modal />*/}
      <BidsModal />
        {children}
      <Footer />
    </>
  );
}
