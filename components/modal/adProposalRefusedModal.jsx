import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Web3Button } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
const AddProposalRefusedModal = ({ id, selectedItems, closeRefuseModal, handleCommentChange, handleItemSubmit, setRefusedAdModal, successFullRefuseModal }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [allCommentsOk, setAllCommentsOk] = useState(false);

  useEffect(() => {
     for (const item of selectedItems) {

       if (item.reason.length < 3) {
         setAllCommentsOk(false);
       } else {
         setAllCommentsOk(true);
       }
     }
  }, [selectedItems]);
  useEffect(() => {
    const itemsMap = new Map();

    const uniqueItems = selectedItems.filter((item) => {
      const alreadyExists = itemsMap.has(item.tokenId);
      if (!alreadyExists) {
        itemsMap.set(item.tokenId, true);
        return true;
      }
      return false;
    });

    setFilteredItems(uniqueItems);
  }, [selectedItems]);

  return (
    <>
      <div className="modal-dialog  w-full sm:max-w-[450px]">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="placeBidLabel">
              Comments
            </h5>
            <button type="button" className="btn-close" onClick={() => closeRefuseModal()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-jacarta-700 h-6 w-6 dark:fill-white">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
              </svg>
            </button>
          </div>
          <div className="modal-body max-h-[400px] overflow-auto p-6 flex gap-4 flex-col items-center ">
            {filteredItems.map((item) => {
              const { tokenId, offerId, recordsProposalId } = item;
              return !successFullRefuseModal ? (
                <div className="mb-6 w-full ">
                  <div className="flex justify-between">
                    <div>
                      <label htmlFor="item-description" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                        Comments
                        <span className="text-red">*</span>
                      </label>
                    </div>
                    <div className="font-display text-jacarta-700 mb-2 block dark:text-white">
                      Space # <span className="text-accent">{tokenId}</span>
                    </div>
                  </div>
                  <textarea
                    id={tokenId}
                    className="dark:bg-jacarta-700  border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                    rows="4"
                    required
                    onChange={(e) => handleCommentChange(tokenId, e.target.value)}
                    placeholder="Provide a comment of your refuse. min characters 3"
                  ></textarea>
                </div>
              ) : (
                <div className="flex gap-2">
                  <p>Proposal ad successfully refused </p>
                  <div className="dark:border-jacarta-600 bg-green   flex h-6 w-6 items-center justify-center rounded-full border-2 border-white" data-tippy-content="Verified Collection">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-[.875rem] w-[.875rem] fill-white">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="modal-footer">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center gap-4">
                {!successFullRefuseModal ? (
                  <Web3Button
                    contractAddress="0xE442802706F3603d58F34418Eac50C78C7B4E8b3"
                    action={() =>
                      toast.promise(handleItemSubmit(false), {
                        pending: "Waiting transaction confirmation",
                        success: "Transaction confirmed 👌",
                        error: "Transaction rejected 🤯",
                      })
                    }
                    className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!allCommentsOk ? "btn-disabled" : "!bg-red !cursor-pointer"} `}
                    disabled={!allCommentsOk}
                  >
                    Refuse Ad Proposal
                  </Web3Button>
                ) : (
                  <button onClick={() => closeRefuseModal()} className="!rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-accent !cursor-pointer">
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProposalRefusedModal;
