'use client';
import React, { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import ConfirmBid from "./BidsModal/ConfirmBid";
import {useAppContext} from "../../contexts/hooks/useAppContext";

const BidsModal = () => {
  const {isBidModalOpen, setIsBidModalOpen} = useAppContext();
  const [ETHAmount, setETHAmount] = useState(0.05);
  const address = useAddress();

  const handleEThAmount = (e) => {
    e.preventDefault();
    setETHAmount(e.target.value);
  };

  // const localAccount = privateKeyAccount({
  //   client,
  //   privateKey:
  //     "",
  // });

  const confirmBid = async () => {
    // const transaction = await prepareContractCall({
    //   contract: erc20Contract,
    //   method: resolveMethod("approve"),
    //   params: ["0x86aDf604B5B72d270654F3A0798cabeBC677C7fc", "0.05"],
    // });
    // const { transactionHash } = await sendTransaction({
    //   transaction: transaction,
    //   // client: localAccount,
    // });

    // DSponsorMarketplace bid transaction
    // const transaction = await prepareContractCall({
    //   dSponsorMpContract,
    //   method: resolveMethod("bid"),
    //   params: [listingId, _pricePerToken, _referralAdditionalInformation],
    // });
    // console.log(transaction, "Transaction Information...");

    // const { transactionHash } = await sendTransaction({
    //   transaction,
    //   localAccount,
    // });
    // console.log(transactionHash, "Transaction Hash...");

    console.log("Bidding...");
  };

  return (
    <div>
      <div
        className={isBidModalOpen ? "modal fade show block" : "modal hide"}
        id="placeBidModal"
        tabIndex="-1"
        aria-labelledby="placeBidLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content  bg-sigray-light border-sigray-border">
            <div className="modal-header">
              <h5 className="modal-title text-white" id="placeBidLabel">
                Confirm Bid
              </h5>
              <button onClick={() => setIsBidModalOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  onClick={() => setIsBidModalOpen(false)}
                  className="h-6 w-6 fill-jacarta-700 fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-jacarta-700 text-white">
                  Price
                </span>
              </div>

              <div className="dark:border-jacarta-600 border-jacarta-100 relative mb-2 flex items-center overflow-hidden rounded-lg border">
                <div className="border-jacarta-100 bg-jacarta-50 flex flex-1 items-center self-stretch border-r px-2">

                  <span className="font-display text-jacarta-700 text-sm">
                    ETH
                  </span>
                </div>

                <input
                  type="number"
                  className="focus:ring-accent h-12 w-full flex-[3] border-0 focus:ring-inse dark:text-jacarta-700"
                  placeholder="Amount"
                  value={ETHAmount}
                  onChange={(e) => handleEThAmount(e)}
                />

                <div className="flex flex-1 justify-end self-stretch border-l border-jacarta-100 bg-jacarta-50">
                  <span className="self-center px-2 text-sm">$130.82</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm text-white dark:text-jacarta-400">
                  Balance: 0.0000 WETH
                </span>
              </div>

              {/* Terms */}
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-5 w-5 self-start rounded border-jacarta-200 text-accent checked:bg-accent focus:ring-accent/20 focus:ring-offset-0 dark:border-jacarta-500 dark:bg-jacarta-600"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-white dark:text-jacarta-200"
                >
                  By checking this box, I agree to DSponsor&apos;s{" "}
                  <a href="#" className="text-accent">
                    Terms of Service
                  </a>
                </label>
              </div>
            </div>
            {/* end body */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <ConfirmBid bidFunc={confirmBid} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidsModal;
