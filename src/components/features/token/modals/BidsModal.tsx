import React, { useEffect, useRef, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Web3Button, useContractWrite, useBalance, useAddress } from "@thirdweb-dev/react";
import { Spinner } from "@nextui-org/spinner";
import { toast } from "react-toastify";
import Link from "next/link";
import config from "@/config/config";
import { computeBidAmounts } from "@/utils/bids/computeBidAmounts";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import formatAndRoundPrice from "@/utils/prices/formatAndRound";
import { getCookie } from "cookies-next";
import BidWithCrossmintButton from "@/components/ui/buttons/BidWithCrossmintButton/BidWithCrossmintButton";
import Tippy from "@tippyjs/react";
import { ClipboardIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import handleCopy from "@/utils/misc/handleCopy";
import "tippy.js/dist/tippy.css";
import ResponsiveTooltip from "@/components/ui/ResponsiveTooltip";
import Input from "@/components/ui/Input";
import { ngrokURL } from "@/data/ngrok";

const BidsModal = ({
  setAmountToApprove,
  bidsAmount,
  setBidsAmount,
  address,
  chainId,
  successFullBid,
  setSuccessFullBid,
  dsponsorMpContract,
  toggleBidsModal,
  marketplaceListings,
  currencySymbol,
  checkUserBalance,
  tokenBalance,
  allowanceTrue,
  currencyTokenDecimals,
  handleApprove: handleParentApprove,
  checkAllowance,
  isLoadingButton,
  setIsLoadingButton,
  currencyContract,
  token,
  user,
  offer,
  referrer,
  showBidsModal,
  tokenEtherPrice,
  amountInEthWithSlippage,
  displayedPrice,
  setDisplayedPrice,
  fetchOffers
}: {
  setAmountToApprove: any;
  bidsAmount: string;
  setBidsAmount: any;
  address: string;
  chainId: number;
  successFullBid: boolean;
  setSuccessFullBid: any;
  dsponsorMpContract: any;
  toggleBidsModal: any;
  marketplaceListings: any;
  currencySymbol: string;
  checkUserBalance: any;
  tokenBalance: any;
  allowanceTrue: any;
  currencyTokenDecimals: number;
  handleApprove: any;
  checkAllowance: any;
  isLoadingButton: boolean;
  setIsLoadingButton: any;
  currencyContract: any;
  token: any;
  user: any;
  offer: any;
  referrer: any;
  showBidsModal: boolean;
  tokenEtherPrice: string;
  amountInEthWithSlippage: any;
  displayedPrice: string;
  setDisplayedPrice: any;
  fetchOffers: any;
}) => {
  const [initialIntPrice, setInitialIntPrice] = useState<string | null>(null);
  const [isLoadingApproveButton, setIsLoadingApproveButton] = useState(false);
  const [isLoadingBuyButton, setIsLoadingBuyButton] = useState(false);
  const [isPriceGood, setIsPriceGood] = useState(true);
  const { mutateAsync: auctionBids } = useContractWrite(dsponsorMpContract, "bid");
  const [checkTerms, setCheckTerms] = useState(false);
  const [refundedPrice, setRefundedPrice] = useState<string | null>(null);
  const [, setEndDate] = useState<string | null>(null);
  const [, setMinBid] = useState<string | null>(null);
  const [, setEndDateHour] = useState<string | null>(null);
  const [buyoutPriceReached, setBuyoutPriceReached] = useState(false);
  const [protocolFeeAmount, setProtocolFeeAmount] = useState<string>("0");
  const [mount, setMount] = useState(false);
  const [insufficentBalance, setInsufficentBalance] = useState(false);
  const [canPayWithNativeToken, setCanPayWithNativeToken] = useState(false);
  const [notEnoughFunds, setNotEnoughFunds] = useState(false);
  const [copied, setCopied] = useState(false);
  const [parsedBidsAmount, setParsedBidsAmount] = useState<BigNumber | null>(null);
  const [buyoutPrice, setBuyoutPrice] = useState<string | null>(null);
  const [tooHighPriceForCrossmint, setTooHighPriceForCrossmint] = useState(false);

  const chainConfig = config[chainId];
  const chainWETH = chainConfig?.smartContracts.WETH.address.toLowerCase();

  let frontURL;
  if (typeof window !== "undefined") {
    frontURL = window.location.origin;
  }

  const isWETH = currencyContract?.toLowerCase() === chainWETH;
  const canPayWithCrossmint = isWETH && chainConfig?.features?.crossmint?.enabled;
  const modalRef: any = useRef();

  const userAddr = useAddress();

  const { data: nativeTokenBalance } = useBalance();
  const { data: currencyBalance } = useBalance(currencyContract);

  useEffect(() => {
    if (!amountInEthWithSlippage || amountInEthWithSlippage.lte(BigNumber.from(0))) return;

    if (!parsedBidsAmount || parsedBidsAmount.lte(BigNumber.from(0))) return;

    const hasInsufficientBalance: boolean =
      !!currencyBalance &&
      (currencyBalance?.value.lt(amountInEthWithSlippage) ||
        parsedBidsAmount?.gt(currencyBalance?.value));

    setInsufficentBalance(hasInsufficientBalance);

    if (nativeTokenBalance?.value?.lt(amountInEthWithSlippage)) {
      setCanPayWithNativeToken(false);
    } else {
      setCanPayWithNativeToken(true);
    }
  }, [
    marketplaceListings,
    chainId,
    parsedBidsAmount,
    nativeTokenBalance,
    currencyBalance,
    currencyTokenDecimals,
    amountInEthWithSlippage
  ]);

  useEffect(() => {
    if (insufficentBalance && !canPayWithNativeToken) {
      setNotEnoughFunds(true);
    } else {
      setNotEnoughFunds(false);
    }
  }, [insufficentBalance, canPayWithNativeToken]);

  useEffect(() => {
    if (
      marketplaceListings?.[0] &&
      parsedBidsAmount &&
      BigNumber.from(parsedBidsAmount).gt(BigNumber.from(0)) &&
      !successFullBid
    ) {
      const minimalBuyoutPerToken = BigNumber.from(
        marketplaceListings[0]?.bidPriceStructure?.minimalBuyoutPerToken
      );
      const buyoutPrice = BigNumber.from(marketplaceListings[0]?.buyoutPricePerToken);

      const isMinimalBuyout = BigNumber.from(parsedBidsAmount).gte(minimalBuyoutPerToken);
      const isBuyout = BigNumber.from(parsedBidsAmount).gte(buyoutPrice);

      if (isBuyout && isMinimalBuyout) {
        setBuyoutPriceReached(true);
      } else {
        setBuyoutPriceReached(false);
      }
    }
  }, [marketplaceListings, currencyTokenDecimals, parsedBidsAmount, successFullBid]);

  useEffect(() => {
    if (marketplaceListings?.[0]) {
      setBuyoutPrice(marketplaceListings[0]?.bidPriceStructure?.minimalBuyoutPerToken);
    }
  }, [marketplaceListings]);

  useEffect(() => {
    if (
      marketplaceListings[0] &&
      parsedBidsAmount &&
      parsedBidsAmount.gt(BigNumber.from(0)) &&
      currencyTokenDecimals
    ) {
      const newBidPerToken = parsedBidsAmount;
      const reservePricePerToken = marketplaceListings[0]?.reservePricePerToken;
      const buyoutPricePerToken = marketplaceListings[0]?.buyoutPricePerToken;
      const previousPricePerToken =
        marketplaceListings[0]?.bidPriceStructure?.previousPricePerToken;
      const minimalAuctionBps = marketplaceListings[0]?.minimalBidBps;
      const bonusRefundBps = marketplaceListings[0]?.previousBidAmountBps;
      const royaltyBps = 0;
      const protocolFeeBps = marketplaceListings[0]?.protocolFeeBps;

      const {
        // newRefundBonusAmount,
        nextReservePricePerToken,
        protocolFeeAmount,
        newProfitAmount
      } = computeBidAmounts(
        newBidPerToken,
        BigNumber.from(1),
        reservePricePerToken,
        buyoutPricePerToken,
        previousPricePerToken,
        minimalAuctionBps,
        bonusRefundBps,
        royaltyBps,
        protocolFeeBps
      );

      const newProfitAmountFormatted = formatUnits(newProfitAmount, currencyTokenDecimals);

      const nextReservePricePerTokenFormatted = formatUnits(
        nextReservePricePerToken,
        currencyTokenDecimals
      );

      const protocolFeeAmountFormatted = formatUnits(protocolFeeAmount.toString(), 13);

      setProtocolFeeAmount(protocolFeeAmountFormatted);
      setRefundedPrice(newProfitAmountFormatted);
      setMinBid(nextReservePricePerTokenFormatted);
    } else {
      setMinBid("0");
      setRefundedPrice("0");
    }
  }, [parsedBidsAmount, marketplaceListings, currencyTokenDecimals]);

  useEffect(() => {
    const endTime = marketplaceListings[0]?.endTime;
    const endTimeDate = new Date(endTime * 1000); // we convert the timestamp to milliseconds
    setEndDate(endTimeDate.toLocaleDateString());
    setEndDateHour(endTimeDate.toLocaleTimeString());
  }, [marketplaceListings]);

  useEffect(() => {
    const minimalBidPerToken = marketplaceListings[0]?.bidPriceStructure?.minimalBidPerToken;
    if (minimalBidPerToken && !mount) {
      const minimalBid = ethers.utils.formatUnits(minimalBidPerToken, currencyTokenDecimals);
      setInitialIntPrice(minimalBid);
      setMount(true);
    }
  }, [marketplaceListings, currencyTokenDecimals, mount]);

  useEffect(() => {
    if (bidsAmount && parseFloat(bidsAmount) >= parseFloat(initialIntPrice as string)) {
      setIsPriceGood(true);
    } else {
      setIsPriceGood(false);
    }
  }, [bidsAmount, initialIntPrice]);

  const handleBidsAmount = async (e) => {
    let value = String(e.target.value).trim();

    if (value === "") {
      setBidsAmount("");
      setParsedBidsAmount(null);
      setAmountToApprove(null);
      return;
    }

    const decimalSeparator = value.includes(".") ? "." : ",";
    const parts = value.split(decimalSeparator);

    if (parts.length > 2) {
      console.error("Invalid input format: multiple decimal separators");
      return;
    }

    if (parts.length === 2 && parts[1].length > currencyTokenDecimals) {
      console.error("Too many decimals for token precision");
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      console.error("Invalid input format: must be numeric");
      return;
    }

    try {
      const parsedValue = ethers.utils.parseUnits(value.replace(",", "."), currencyTokenDecimals);
      setBidsAmount(value);
      setParsedBidsAmount(parsedValue);
      setAmountToApprove(parsedValue);
      await checkAllowance(parsedValue);
    } catch (error) {
      console.error("Invalid input for bids amount:", error);
      setParsedBidsAmount(null);
      setBidsAmount("");
      setAmountToApprove(null);
    }
  };

  const handleApprove = async () => {
    try {
      setIsLoadingButton(true);
      await handleParentApprove();

      setSuccessFullBid(false);
    } catch (error) {
      setIsLoadingButton(false);
      throw new Error(error);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleSubmitWithNative = async () => {
    const hasEnoughBalance = checkUserBalance(tokenBalance, bidsAmount, currencyTokenDecimals);

    if (!hasEnoughBalance && !canPayWithNativeToken) {
      console.error("Not enough balance to confirm checkout");
      throw new Error("Not enough balance to confirm checkout");
    }

    const hasEnoughBalanceForNative = checkUserBalance(nativeTokenBalance, tokenEtherPrice, 18);

    if (!hasEnoughBalanceForNative) {
      console.error("Not enough balance to confirm checkout");
      throw new Error("Not enough balance to confirm checkout");
    }

    try {
      setIsLoadingButton(true);
      const parsedBidsAmount = ethers.utils.parseUnits(bidsAmount, currencyTokenDecimals);

      const referralAddress = getCookie("_rid") ?? "";

      await auctionBids({
        args: [marketplaceListings[0].id, parsedBidsAmount, address, referralAddress],
        overrides: { value: amountInEthWithSlippage }
      });

      setSuccessFullBid(true);
      await fetchOffers();
    } catch (error) {
      setIsLoadingButton(false);
      console.error(error);
      throw new Error(error);
    } finally {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    if (bidsAmount && currencyTokenDecimals && chainId && chainConfig) {
      const parsedBidsAmount = parseUnits(bidsAmount?.toString(), Number(currencyTokenDecimals));
      const parsedPriceLimit = parseUnits(
        chainConfig?.features?.crossmint?.config?.priceLimit?.toString(),
        Number(currencyTokenDecimals)
      );

      const tooHighPrice = parsedPriceLimit ? parsedBidsAmount?.gte(parsedPriceLimit) : true;

      if (tooHighPrice) {
        setTooHighPriceForCrossmint(true);
      } else {
        setTooHighPriceForCrossmint(false);
      }
    }
  }, [bidsAmount, chainConfig, chainId, currencyTokenDecimals]);

  const handleSubmit = async () => {
    const hasEnoughBalance = checkUserBalance(tokenBalance, bidsAmount, currencyTokenDecimals);
    if (!hasEnoughBalance) {
      console.error("Not enough balance for approval.");
      throw new Error("Not enough balance for approval.");
    }
    try {
      setIsLoadingButton(true);
      const precision = bidsAmount.split(".")[1]?.length ?? 0;

      const bidsBigInt = ethers.utils.parseUnits(
        parseFloat(bidsAmount).toFixed(Math.min(Number(currencyTokenDecimals), precision)),
        Number(currencyTokenDecimals)
      );

      const referralAddress = getCookie("_rid") ?? "";

      await auctionBids({
        args: [marketplaceListings[0].id, bidsBigInt, address, referralAddress]
      });
      setSuccessFullBid(true);
      await fetchOffers();
    } catch (error) {
      setIsLoadingButton(false);
      console.error(error);
      throw new Error(error);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleTermService = (e) => {
    setCheckTerms(e.target.checked);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleBidsModal();
        // We would love the button to not spin after closing the modal
        setIsLoadingButton(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsLoadingButton, toggleBidsModal]);

  // Ref instead of state to avoid re-renders
  const isProcessingRef = useRef(false);
  const onProcessingBid = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    toast.info("Processing mint.");
  };

  useEffect(() => {
    const resetRewardsAndAmount = () => {
      setBidsAmount(null);
      setParsedBidsAmount(null);
      setRefundedPrice(null);
      setAmountToApprove(null);
      setDisplayedPrice(null);
    };

    if (!showBidsModal) {
      resetRewardsAndAmount();
    }
  }, [
    setBidsAmount,
    setParsedBidsAmount,
    setRefundedPrice,
    setAmountToApprove,
    setDisplayedPrice,
    successFullBid,
    showBidsModal
  ]);

  return (
    <div>
      <div className="modal fade show block">
        <div className="modal-dialog max-w-4xl mx-4">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                {!successFullBid ? "Place a bid" : "Bid submitted"}
              </h5>
              <button type="button" className="btn-close" onClick={toggleBidsModal}>
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

            {/* <!-- Body --> */}
            {!successFullBid ? (
              <div className="modal-body p-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display flex items-center gap-4 text-jacarta-900 text-sm font-semibold dark:text-white">
                      Price
                    </span>
                  </div>
                  <div>
                    <span className="dark:text-jacarta-100 text-sm">
                      Balance: {formatAndRoundPrice(tokenBalance?.displayValue) ?? 0}{" "}
                      {currencySymbol}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center relative w-full overflow-hidden -pr-4">
                    <Input
                      type="number"
                      className="pr-20 relative w-full flex-[3] rounded-xl text-2xl py-2 font-semibold text-white"
                      placeholder={`${initialIntPrice} or higher`}
                      value={bidsAmount ?? ""}
                      onChange={(e) => handleBidsAmount(e)}
                      maxLength={currencyTokenDecimals}
                    />
                    <span className="text-white font-semibold absolute right-0 px-4">
                      {currencySymbol?.substring(0, 6)}
                    </span>
                  </div>

                  <div className="bg-jacarta-800 w-1/4 border border-jacarta-900 border-opacity-10 rounded-xl flex flex-1 justify-center self-stretch border-l">
                    <span className="self-center px-4 text-xl text-center text-white font-semibold">
                      ${displayedPrice ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center text-left md:flex-row items-center md:justify-between mb-8 mt-2 gap-2 md:gap-4">
                  {(initialIntPrice || (buyoutPriceReached && buyoutPrice)) && (
                    <div className="flex flex-col gap-1">
                      {parseFloat(bidsAmount) < parseFloat(initialIntPrice as string) && (
                        <button
                          className="text-sm text-left md:text-base whitespace-nowrap  text-green hover:text-opacity-80"
                          onClick={() => {
                            setBidsAmount(initialIntPrice);

                            const parsedInitialIntPrice = ethers.utils.parseUnits(
                              initialIntPrice as string,
                              currencyTokenDecimals
                            );
                            setParsedBidsAmount(parsedInitialIntPrice);
                          }}
                        >
                          Set minimal bid amount {initialIntPrice} {currencySymbol}
                        </button>
                      )}

                      {!buyoutPriceReached && (
                        <button
                          className="text-sm text-left md:text-base whitespace-nowrap  text-green hover:text-opacity-80"
                          onClick={() => {
                            const formattedBuyoutPrice = ethers.utils.formatUnits(
                              parseFloat(buyoutPrice as string),
                              currencyTokenDecimals
                            );
                            setBidsAmount(formattedBuyoutPrice);

                            const parsedBuyoutPrice = BigNumber.from(buyoutPrice);
                            setParsedBidsAmount(parsedBuyoutPrice);
                          }}
                        >
                          Set buyout price{" "}
                          {ethers.utils.formatUnits(buyoutPrice as string, currencyTokenDecimals)}{" "}
                          {currencySymbol}
                        </button>
                      )}
                    </div>
                  )}

                  <span
                    className={`text-left text-sm md:text-base break-words dark:text-warning ${!isPriceGood ? "" : "opacity-0"}`}
                  >
                    {!isPriceGood && (
                      <>
                        ⚠️ Bid Price must be higher than {initialIntPrice} {currencySymbol}{" "}
                      </>
                    )}
                  </span>
                </div>

                <div className="flex flex-col gap-8 py-4 items-center justify-center">
                  {buyoutPriceReached ? (
                    <div className="flex items-center justify-center text-center">
                      Your bid is higher than the buyout price. You&apos;ll own the ad space
                      immediately once the transaction is confirmed.
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2 items-center text-center">
                        <span className="font-semibold text-white">What&apos;s next?</span>
                        <span className="text-white text-sm">
                          If someone outbids you, you will receive your bid amount back plus an
                          additional rewards. However, if no one outbids you, you will get the ad
                          space.
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-7 items-center gap-4 mx-auto w-full min-w-max">
                          <div className="bg-jacarta-800 col-span-3 duration-400 shadow p-4 rounded-xl font-semibold text-xs md:text-base text-white text-center min-w-[125px] max-w-[125px] md:min-w-[200px] md:max-w-[200px]">
                            Ad space NFT in your wallet
                          </div>

                          <div className="text-center flex justify-center items-center min-w-max">
                            <span className="text-white mx-auto text-center flex items-center justify-center font-semibold text-sm min-w-[25px] max-w-[25px] md:min-w-[50px] md:max-w-[50px]">
                              OR
                            </span>
                          </div>

                          <div className="bg-jacarta-800 col-span-3 duration-400 shadow p-4 rounded-xl font-semibold text-xs md:text-base text-white text-center min-w-[125px] max-w-[125px] md:min-w-[200px] md:max-w-[200px]">
                            Your bid back +{" "}
                            {parseFloat(bidsAmount) >= parseFloat(initialIntPrice as string)
                              ? formatAndRoundPrice(refundedPrice)
                              : 0}{" "}
                            {currencySymbol} Reward
                          </div>
                        </div>
                        <div className="hidden md:grid grid-cols-7 items-start gap-4 mx-auto w-full">
                          <div className="hidden w-full col-span-3 text-base text-white md:flex justify-center items-center text-center min-w-[200px] max-w-[200px]">
                            If you are still the highest bidder when the auction closes
                          </div>

                          <div />

                          <div className="hidden w-full col-span-3 text-base text-white md:flex justify-center items-center text-center min-w-[200px] max-w-[200px]">
                            If someone outbids
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* <!-- Terms --> */}
                <div className="mt-8 flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="buyNowTerms"
                    onClick={handleTermService}
                    className="h-5 !w-5 mr-3 rounded border-jacarta-200 !text-primaryPurple checked:bg-primaryPurple focus:ring-primaryPurple/20 focus:ring-offset-0 dark:border-jacarta-500"
                  />
                  <label htmlFor="buyNowTerms" className="dark:text-jacarta-200 text-sm">
                    By checking this box, I agree to {"SiBorg Ads's"}{" "}
                    <Link
                      href="https://docs.google.com/document/d/15um5c6mMoKc8V1rVyRJ7tcIxFDmtE8xe75mx-CdB84w"
                      target="_blank"
                      className="text-primaryPurple"
                    >
                      Terms of Service
                    </Link>
                  </label>
                </div>
              </div>
            ) : !buyoutPriceReached ? (
              <div className="modal-body p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    <p>Congratulations your bid has been submit ! 🎉 </p>
                  </div>
                  <div className="flex items-center">
                    <span>You can check the bid status at anytime in your profile page.</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center my-8">
                  {currencySymbol === "WETH" && (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg text-primaryPink font-semibold text-center">
                        You will earn {Math.floor(parseFloat(protocolFeeAmount)) ?? 0} boxes if you
                        win the auction !
                      </span>
                      <span className="text-lg text-white font-semibold text-center">
                        Want to earn more?
                      </span>

                      <div className="flex items-center gap-4 mt-8">
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(
                              `Participate in @siborgapp's "bid to earn" auction to secure ad space NFT on @siborgapp search results!\n\nEarn perks with boxes and get rewarded when outbid! 💰\n\n#Web3Monetization #DigitalRWA #SiBorgAds\n ${frontURL}/?_rid=${userAddr}`
                            );
                            const url = `https://twitter.com/intent/tweet?text=${text}`;
                            window.open(url, "_blank");
                          }}
                          className={`bg-primaryPurple hover:bg-opacity-80 rounded-2lg text-white p-2 flex items-center justify-center text-center gap-2`}
                        >
                          <span className="flex items-center justify-center gap-2 w-full text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              viewBox="0 0 50 50"
                              className="text-white w-5 h-5 fill-white"
                            >
                              <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                            </svg>
                            Share on X
                          </span>
                        </button>

                        <Tippy
                          content={copied ? "Copied!" : "Copy"}
                          placement="top"
                          trigger="click"
                        >
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator
                                  .share({
                                    title: "My referral code",
                                    text: `You can now use my referral code on SiBorg Ads.\n ${frontURL}/?_rid=${userAddr}`,
                                    url: `${frontURL}/?_rid=${userAddr}`
                                  })
                                  .catch((error) => console.error("Error sharing", error));
                              } else {
                                handleCopy(`${frontURL}/?_rid=${userAddr}`, setCopied);
                                console.error("Web Share API is not supported in this browser");
                              }
                            }}
                            className={`bg-primaryPurple hover:bg-opacity-80 rounded-2lg text-center flex items-center justify-center text-white p-2`}
                          >
                            <span className="flex items-center justify-center gap-2 w-full text-center">
                              <ClipboardIcon className="w-5 h-5" />
                              Copy
                            </span>
                          </button>
                        </Tippy>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="modal-body p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    <p>Congratulations ! 🎉 </p>
                    <div
                      className="dark:border-jacarta-800 bg-green   flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                      data-tippy-content="Verified Collection"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-[.875rem] w-[.875rem] fill-white"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center my-8">
                  {currencySymbol === "WETH" && (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg text-white font-semibold text-center">
                        Congratulations, you have increased your number of boxes by{" "}
                        {Math.floor(parseFloat(protocolFeeAmount)) ?? 0}. Check your profile page
                        and referral link to earn more.
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center">
                  <span>You can check the bid status at anytime in your profile page.</span>
                </div>
              </div>
            )}
            {/* <!-- end body --> */}
            {!successFullBid && (
              <div className="modal-footer flex items-center justify-center gap-4 p-6">
                <div className="flex flex-col gap-6 md:gap-2 w-full justify-center items-center">
                  <div className="grid grid-cols-1 mx-auto md:grid-cols-2 gap-6 md:w-7/12">
                    {!insufficentBalance ? (
                      <>
                        <Web3Button
                          contractAddress={config[chainId]?.smartContracts?.DSPONSORMP?.address}
                          action={async () => {
                            setIsLoadingApproveButton(true);

                            await toast
                              .promise(handleApprove, {
                                pending: "Waiting for confirmation 🕒",
                                success: "Approval confirmed 👌",
                                error: "Approval rejected 🤯"
                              })
                              .finally(() => {
                                setIsLoadingApproveButton(false);
                              });
                          }}
                          className={` !rounded-full !py-3 !px-8 !w-full !text-center !font-semibold !text-black !transition-all ${
                            !isPriceGood ||
                            !checkTerms ||
                            !bidsAmount ||
                            !allowanceTrue ||
                            isLoadingApproveButton
                              ? "!btn-disabled !cursor-not-allowed !text-black !opacity-30"
                              : "!text-white !bg-primaryPurple !cursor-pointer"
                          } `}
                          isDisabled={
                            !isPriceGood ||
                            !checkTerms ||
                            !bidsAmount ||
                            !allowanceTrue ||
                            isLoadingApproveButton
                          }
                        >
                          {isLoadingApproveButton ? (
                            <Spinner size="sm" color="default" />
                          ) : notEnoughFunds ? (
                            <span className="text-black">Not enough funds</span>
                          ) : (
                            "Approve 🔓 (1/2)"
                          )}
                        </Web3Button>

                        {/* Added next button */}
                        <Web3Button
                          contractAddress={config[chainId]?.smartContracts?.DSPONSORMP?.address}
                          action={async () => {
                            setIsLoadingBuyButton(true);

                            await toast
                              .promise(handleSubmit, {
                                pending: "Waiting for confirmation 🕒",
                                success: buyoutPriceReached
                                  ? "Buy confirmed 👌"
                                  : "Bid confirmed 👌",
                                error: buyoutPriceReached ? "Buy rejected 🤯" : "Bid rejected 🤯"
                              })
                              .finally(() => {
                                setIsLoadingBuyButton(false);
                              });
                          }}
                          className={`!rounded-full !w-full !py-3 !px-8 !text-center !font-semibold !text-black !transition-all ${
                            !isPriceGood || !checkTerms || allowanceTrue || isLoadingBuyButton
                              ? "!btn-disabled !cursor-not-allowed !text-black !opacity-30"
                              : "!text-white !bg-primaryPurple !cursor-pointer"
                          } `}
                          isDisabled={
                            !isPriceGood || !checkTerms || allowanceTrue || isLoadingBuyButton
                          }
                        >
                          {isLoadingBuyButton ? (
                            <Spinner size="sm" color="default" />
                          ) : buyoutPriceReached ? (
                            notEnoughFunds ? (
                              <span className="text-black">Not enough funds</span>
                            ) : (
                              "Buy Now 💸 (2/2)"
                            )
                          ) : notEnoughFunds ? (
                            <span className="text-black">Not enough funds</span>
                          ) : (
                            "Place Bid 💸 (2/2)"
                          )}
                        </Web3Button>
                      </>
                    ) : (
                      <Web3Button
                        contractAddress={config[chainId]?.smartContracts?.DSPONSORMP?.address}
                        action={async () => {
                          setIsLoadingBuyButton(true);

                          await toast
                            .promise(handleSubmitWithNative, {
                              pending: "Waiting for confirmation 🕒",
                              success: buyoutPriceReached ? "Buy confirmed 👌" : "Bid confirmed 👌",
                              error: buyoutPriceReached ? "Buy rejected 🤯" : "Bid rejected 🤯"
                            })
                            .finally(() => {
                              setIsLoadingBuyButton(false);
                            });
                        }}
                        className={`!rounded-full !col-span-2 !py-3 !px-8 !text-center !font-semibold !text-black !transition-all ${
                          !isPriceGood ||
                          !checkTerms ||
                          !canPayWithNativeToken ||
                          isLoadingBuyButton
                            ? "!btn-disabled !cursor-not-allowed !text-black !opacity-30"
                            : "!text-white !bg-primaryPurple !cursor-pointer"
                        } `}
                        isDisabled={
                          !isPriceGood ||
                          !checkTerms ||
                          !canPayWithNativeToken ||
                          isLoadingBuyButton
                        }
                      >
                        {isLoadingBuyButton ? (
                          <Spinner size="sm" color="default" />
                        ) : buyoutPriceReached ? (
                          notEnoughFunds ? (
                            <span className="text-black">Not enough funds</span>
                          ) : (
                            "Buy Now with ETH 💸"
                          )
                        ) : notEnoughFunds ? (
                          <span className="text-black">Not enough funds</span>
                        ) : (
                          "Place Bid with ETH 💸"
                        )}
                      </Web3Button>
                    )}
                  </div>
                  <ResponsiveTooltip
                    text={`You need to approve the marketplace contract to spend your ${currencySymbol} on this transaction.`}
                  >
                    <span className="text-xs text-center text-jacarta-100 inline-flex items-center gap-1">
                      <InformationCircleIcon className="w-4 h-4 text-jacarta-100" />
                      Why do I have to approve ?
                    </span>
                  </ResponsiveTooltip>
                </div>

                {canPayWithCrossmint && (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="mx-4 text-gray-500">or</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <BidWithCrossmintButton
                        offer={offer}
                        token={token}
                        user={user}
                        isBid={!buyoutPriceReached}
                        referrer={referrer}
                        config={chainConfig?.features.crossmint.config}
                        actions={{
                          processing: onProcessingBid,
                          success: () => {
                            toast.success("Buying successful");
                          },
                          error: (error) => {
                            toast.error(`Buying failed: ${error.message}`);
                          }
                        }}
                        perPriceToken={parseUnits(
                          !!bidsAmount && bidsAmount !== "" ? bidsAmount : "0",
                          Number(currencyTokenDecimals)
                        )}
                        totalPriceFormatted={formatUnits(
                          amountInEthWithSlippage ?? "0",
                          Number(currencyTokenDecimals)
                        )}
                        isDisabled={
                          !checkTerms || isLoadingButton || !isPriceGood || tooHighPriceForCrossmint
                        }
                        isLoading={isLoadingButton}
                        isLoadingRender={() => <Spinner size="sm" color="default" />}
                        successCallbackURL={window.location.href.replace(
                          "http://localhost:3000",
                          ngrokURL
                        )}
                        failureCallbackURL={window.location.href.replace(
                          "http://localhost:3000",
                          ngrokURL
                        )}
                      />

                      {tooHighPriceForCrossmint && (
                        <span className="text-xs text-center text-red inline-flex items-center gap-1">
                          <InformationCircleIcon className="w-4 h-4 text-white" />
                          Amount is too high to {buyoutPriceReached ? "buy" : "bid"} with credit
                          card.
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidsModal;
