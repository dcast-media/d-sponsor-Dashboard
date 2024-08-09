import React, { useEffect, useState } from "react";
import { Web3Button } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChainContext } from "@/hooks/useChainContext";
import { Spinner } from "@nextui-org/spinner";
import TextArea from "@/components/ui/TextArea";

const RejectAd = ({
  selectedItems,
  successFullModalObject,
  closeRefuseModal,
  handleCommentChange,
  handleItemSubmit,
  successFullRefuseModal,
  setIsRejecting,
  isRejecting
}: {
  selectedItems: any;
  successFullModalObject: any;
  closeRefuseModal: () => void;
  // eslint-disable-next-line no-unused-vars
  handleCommentChange: (tokenId: any, value: any) => void;
  // eslint-disable-next-line no-unused-vars
  handleItemSubmit: (b: boolean) => Promise<unknown> | (() => Promise<unknown>);
  successFullRefuseModal: boolean;
  setIsRejecting: React.Dispatch<React.SetStateAction<boolean>>;
  isRejecting: boolean;
}) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [allCommentsOk, setAllCommentsOk] = useState(false);
  const { currentChainObject } = useChainContext();

  useEffect(() => {
    for (const item of selectedItems) {
      if (item?.reason?.length < 3) {
        setAllCommentsOk(false);
      } else {
        setAllCommentsOk(true);
      }
    }
  }, [selectedItems]);

  useEffect(() => {
    const itemsMap = new Map();

    const uniqueItems = selectedItems?.filter((item) => {
      const alreadyExists = itemsMap?.has(item?.tokenId);
      if (!alreadyExists) {
        itemsMap.set(item?.tokenId, true);
        return true;
      }
      return false;
    });

    setFilteredItems(uniqueItems);
  }, [selectedItems]);

  return (
    <div className="modal-dialog  w-full sm:max-w-[450px]">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="placeBidLabel">
            {successFullRefuseModal ? successFullModalObject.title : "Comments"}
          </h5>
          <button type="button" className="btn-close" onClick={() => closeRefuseModal()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="fill-jacarta-700 h-6 w-6 dark:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
            </svg>
          </button>
        </div>
        <div className="modal-body max-h-[400px] overflow-auto p-6 flex gap-4 flex-col items-center ">
          {!successFullRefuseModal ? (
            <>
              {filteredItems?.map((item: any) => {
                const tokenId = item?.tokenId;

                return (
                  <div key={item?.id} className="mb-6 w-full ">
                    <div className="flex justify-between">
                      <div>
                        <label
                          htmlFor="item-description"
                          className="font-display text-jacarta-900 mb-2 block dark:text-white"
                        >
                          Comments
                          <span className="text-red">*</span>
                        </label>
                      </div>
                      <div className="font-display text-jacarta-900 mb-2 block dark:text-white">
                        Space # <span className="text-primaryPurple">{tokenId}</span>
                      </div>
                    </div>
                    <TextArea
                      id={tokenId}
                      className="w-full"
                      rows={4}
                      required
                      value={item?.reason}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleCommentChange(tokenId, e.target.value)
                      }
                      placeholder="Provide a comment of your refuse. min characters 3"
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex gap-2">
              <p>{successFullModalObject.body}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center gap-4">
              {!successFullRefuseModal ? (
                <Web3Button
                  contractAddress={currentChainObject?.smartContracts?.DSPONSORADMIN?.address ?? ""}
                  action={async () => {
                    setIsRejecting(true);
                    await toast
                      .promise(handleItemSubmit(false), {
                        pending: "Waiting for confirmation 🕒",
                        success: "Transaction confirmed 👌",
                        error: "Transaction rejected 🤯"
                      })
                      .finally(() => {
                        setIsRejecting(false);
                      });
                  }}
                  className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!allCommentsOk || isRejecting ? "!btn-disabled !cursor-not-allowed !opacity-30" : "!bg-red !cursor-pointer"} `}
                  isDisabled={!allCommentsOk || isRejecting}
                >
                  {isRejecting ? <Spinner size="sm" color="default" /> : "Refuse Ad Proposal"}
                </Web3Button>
              ) : (
                <button
                  onClick={() => closeRefuseModal()}
                  className="!rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-primaryPurple !cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectAd;
