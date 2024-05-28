import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Divider } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";

const BuyModal = ({
  formatTokenId,
  allowanceTrue,
  handleApprove,
  finalPrice,
  successFullUpload,
  feesAmount,
  successFullBuyModal,
  price,
  tokenId,
  selectedCurrency,
  name,
  image,
  handleSubmit,
  handleBuyModal,
  tokenData,
  isLoadingButton,
}) => {
  const [validate, setValidate] = useState(false);

  const handleTermService = (e) => {
    console.log(validate);
    setValidate(e.target.checked);
  };
  return (
    <div>
      {/* <!-- Buy Now Modal --> */}
      <div className="modal-dialog max-w-2xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="buyNowModalLabel">
              Complete checkout
            </h5>
            <button type="button" className="btn-close" onClick={handleBuyModal}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-jacarta-700 h-6 w-6 dark:fill-white">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
              </svg>
            </button>
          </div>

          {/* <!-- Body --> */}
          <div className="modal-body p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">Item</span>
              <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">Subtotal</span>
            </div>

              <div className="dark:border-jacarta-600 border-jacarta-100 relative justify-between flex min-h-[75px] border-t border-b py-4">
                <figure className="mr-5 self-start">
                  <Image width={150} height={150} src={image} alt="logo" className="rounded-2lg" loading="lazy" />
                </figure>
                <div className="overflow-hidden  justify-end flex flex-col  text-ellipsis whitespace-nowrap min-w-[200px]  ">
                  <div className="overflow-hidden flex flex-col text-ellipsis whitespace-nowrap   ">
                    <div className="flex gap-6  items-center justify-between">
                      <h3 className="font-display overflow-hidden text-ellipsis whitespace-nowrap text-jacarta-700 text-base font-semibold dark:text-white">{name}</h3>
                      <span className="dark:text-jacarta-100 text-sm font-medium tracking-tight overflow-auto min-w-[60px] flex justify-end">
                        {price} {selectedCurrency}
                      </span>
                    </div>
                    <div className="flex gap-6  items-center justify-between">
                      <span className="dark:text-jacarta-300 text-jacarta-500 mr-1 block text-sm">Protocol fees: 4%</span>
                      <span className="dark:text-jacarta-300 text-sm  tracking-tight overflow-auto min-w-[60px] flex justify-end">
                        {feesAmount} {selectedCurrency}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Divider className="mt-4 w-16 " />
                    </div>
                  </div>
                </div>

              <div>
                <a href="collection.html" className="text-accent text-sm">
                  0X0000000
                </a>
                <h3 className="font-display text-jacarta-700 mb-1 text-base font-semibold dark:text-white">{name}</h3>
                <div className="flex flex-wrap items-center">
                  <span className="dark:text-jacarta-300 text-jacarta-500 mr-1 block text-sm">Protocol fees: 4 %</span>
                  <span data-tippy-content="The creator of this collection will receive 5% of the sale total from future sales of this item.">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="dark:fill-jacarta-300 fill-jacarta-700 h-4 w-4">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="ml-auto">
                <span className="mb-1 flex items-center whitespace-nowrap">
                  <span data-tippy-content="ETH">
                    <svg className="h-4 w-4">
                      <use xlinkHref="/icons.svg#icon-ETH"></use>
                    </svg>
                  </span>
                  <span className="dark:text-jacarta-100 text-sm font-medium tracking-tight">
                    {price} {selectedCurrency}
                  </span>
                </span>
                {/* <div className="dark:text-jacarta-300 text-right text-sm">$130.82</div> */}
              </div>
            </div>

            {/* <!-- Total --> */}
            <div className="dark:border-jacarta-600 border-jacarta-100 mb-2 flex items-center justify-between border-b py-2.5">
              <span className="font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">Total</span>
              <div className="ml-auto">
                <span className="flex items-center whitespace-nowrap">
                  <span data-tippy-content="ETH">
                    <svg className="h-4 w-4">
                      <use xlinkHref="/icons.svg#icon-ETH"></use>
                    </svg>
                  </span>
                  <span className="text-green font-medium tracking-tight">
                    {finalPrice} {selectedCurrency}
                  </span>
                </span>
                {/* <div className="dark:text-jacarta-300 text-right">$130.82</div> */}
              </div>
            </div>

            {/* <!-- Terms --> */}
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="buyNowTerms"
                className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
                onClick={handleTermService}
              />
              <label htmlFor="buyNowTerms" className="dark:text-jacarta-200 text-sm">
                By checking this box, I agree to {"DSponsor's"}{" "}
                <Link href="#" className="text-accent">
                  Terms of Service
                </Link>
              </label>
            </div>
          </div>
          {/* <!-- end body --> */}

          <div className="modal-footer">
            <div className="flex items-center justify-center space-x-4">
              {allowanceTrue && !successFullUpload ? (
                <Web3Button
                  contractAddress="0xE442802706F3603d58F34418Eac50C78C7B4E8b3"
                  action={() => {
                    toast.promise(handleApprove, {
                      pending: "Waiting for approval",
                      success: "Approval confirmed 👌",
                      error: "Approval rejected 🤯",
                    });
                  }}
                  className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!validate ? "btn-disabled" : "!bg-accent !cursor-pointer"} `}
                  isDisabled={!validate || isLoadingButton}
                >
                  {isLoadingButton ? <Spinner size="sm" color="default" /> : "Approve"}
                </Web3Button>
              ) : !successFullUpload ? (
                <Web3Button
                  contractAddress="0xE442802706F3603d58F34418Eac50C78C7B4E8b3"
                  action={() => {
                    toast.promise(handleSubmit, {
                      pending: "Waiting transaction confirmation",
                      success: "Transaction confirmed 👌",
                      error: "Transaction rejected 🤯",
                    });
                  }}
                  className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!validate ? "btn-disabled" : "!bg-accent !cursor-pointer"} `}
                  isDisabled={!validate || isLoadingButton}
                >
                  {isLoadingButton ? <Spinner size="sm" color="default" /> : "Confirm checkout"}
                </Web3Button>
              ) : (
                <Link href={successFullBuyModal.hrefButton}>
                  <button className="!rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-accent !cursor-pointer">{successFullBuyModal.buttonTitle}</button>
                </Link>
              )}

              {/* {!successFullUpload ? (
                <Web3Button
                  contractAddress="0xE442802706F3603d58F34418Eac50C78C7B4E8b3"
                  action={() => {
                    toast.promise(handleSubmit, {
                      pending: "Waiting transaction confirmation",
                      success: "Transaction confirmed 👌",
                      error: "Transaction rejected 🤯",
                    });
                  }}
                  className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!validate || !userBalance ? "btn-disabled" : "!bg-accent !cursor-pointer"} `}
                  disabled={!validate}
                >
                  Confirm checkout
                </Web3Button>
              ) : (
                <Link href={successFullBuyModal.hrefButton}>
                  <button className="!rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-accent !cursor-pointer">{successFullBuyModal.buttonTitle}</button>
                </Link>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
