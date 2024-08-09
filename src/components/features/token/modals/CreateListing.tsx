import React, { useState, useEffect } from "react";
import { features } from "@/data/features";
import { useAddress, useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import DatePicker from "react-datepicker";
import ModalHelper from "@/components/ui/modals/Helper";
import AdSubmission from "@/components/features/token/accordion/AdSubmission";
import { useChainContext } from "@/hooks/useChainContext";
import Input from "@/components/ui/Input";
import { TokenContract } from "@thirdweb-dev/react";
import { Address } from "thirdweb";

const CreateListing = ({
  handleListingModal,
  offerData,
  setSuccessFullListing,
  successFullListing,
  royalties,
  dsponsorNFTContract,
  dsponsorMpContract,
  tokenId,
  setListingCreated,
  fetchOffers
}) => {
  const [selectedListingType, setSelectedListingType] = useState<any[]>([]);
  const [selectedUnitPrice, setSelectedUnitPrice] = useState<number>(0);
  const [selectedStartingPrice, setSelectedStartingPrice] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("WETH");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() + 7))
  );
  const [errors, setErrors] = useState<any>({});
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [validate, setValidate] = useState<boolean>(false);

  const address = useAddress();
  const { currentChainObject } = useChainContext();

  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [customContract, setCustomContract] = useState<Address | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [symbolContract, setSymbolContract] = useState<string>("WETH");
  const [tokenContract, setTokenContract] = useState<string>("");
  const [customTokenContract, setCustomTokenContract] = useState<TokenContract | null>(null);
  const USDCCurrency = currentChainObject?.smartContracts?.USDC;
  const WETHCurrency = currentChainObject?.smartContracts?.WETH;
  //const USDTCurrency = currentChainObject?.smartContracts?.USDT;
  const NATIVECurrency = currentChainObject?.smartContracts?.NATIVE;
  const [selectedCurrencyContract, setSelectedCurrencyContract] = useState<any>(
    WETHCurrency?.address
  );
  const { contract: tokenContractAsync } = useContract(selectedCurrencyContract, "token");
  const { data: symbolContractAsync } = useContractRead(tokenContractAsync, "symbol");
  const { data: decimalsContractAsync } = useContractRead(tokenContractAsync, "decimals");
  const [approvalForAllToken, setApprovalForAllToken] = useState(false);

  const { mutateAsync: setApprovalForAll } = useContractWrite(
    dsponsorNFTContract,
    "setApprovalForAll"
  );
  const { mutateAsync: createListing } = useContractWrite(dsponsorMpContract, "createListing");

  useEffect(() => {
    setSymbolContract(symbolContractAsync);
    setTokenDecimals(decimalsContractAsync);
    setTokenContract(selectedCurrencyContract as string);
    setCustomTokenContract(tokenContractAsync as TokenContract);
  }, [
    decimalsContractAsync,
    symbolContractAsync,
    selectedCurrencyContract,
    tokenContractAsync,
    currentChainObject,
    setSymbolContract,
    setTokenDecimals,
    setTokenContract,
    setCustomTokenContract
  ]);

  useEffect(() => {
    // update start date every seconds to avoid the user to set a start date in the past
    const interval = setInterval(() => {
      if (startDate < new Date()) {
        setStartDate(new Date());
      }

      if (endDate < new Date()) {
        setEndDate(new Date());
      }

      return () => clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const handlePreviewModal = async () => {
    const isApprovedForAll = await dsponsorNFTContract.call("isApprovedForAll", [
      address,
      currentChainObject?.smartContracts?.DSPONSORMP?.address
    ]);
    setApprovalForAllToken(isApprovedForAll);
    if (successFullListing) {
      handleListingModal();
      setSuccessFullListing(false);
    }
    setShowPreviewModal(!showPreviewModal);
    validateInputs();
  };
  const handleSubmit = async () => {
    const isValid = validateInputs();
    if (isValid) {
      try {
        setIsLoadingButton(true);
        const startDateFormated = Math.floor(startDate.getTime() / 1000);
        const nowFormated = Math.floor(new Date().getTime() / 1000);
        const startTime = Math.max(startDateFormated, nowFormated);
        const endDateFormated = Math.floor(endDate.getTime() / 1000);
        const secondsUntilEndTime = endDateFormated - startTime;

        const startingPrice = ethers.utils
          .parseUnits(selectedStartingPrice.toString(), tokenDecimals)
          .toString();

        const isAuction = selectedListingType[0] === 1;
        const price = ethers.utils
          .parseUnits(selectedUnitPrice.toString(), tokenDecimals)
          .toString();
        const assetContract = offerData?.nftContract?.id;

        const args = {
          assetContract: assetContract,
          tokenId: tokenId,
          startTime: startTime,
          secondsUntilEndTime: secondsUntilEndTime,
          quantityToList: 1,
          currencyToAccept: tokenContract,
          reservePricePerToken: isAuction ? startingPrice : price,
          buyoutPricePerToken: price,
          transferType: 1,
          rentalExpirationTimestamp: startTime + secondsUntilEndTime,
          listingType: selectedListingType[0]
        };
        await createListing({ args: [args] });
        setSuccessFullListing(true);
        setListingCreated(true);

        await fetchOffers();
      } catch (error) {
        setIsLoadingButton(false);
        console.error(error);
        throw error;
      } finally {
        setIsLoadingButton(false);
      }
    }
  };
  const handleApprove = async () => {
    try {
      setIsLoadingButton(true);
      await setApprovalForAll({
        args: [currentChainObject?.smartContracts?.DSPONSORMP?.address, true]
      });
      setApprovalForAllToken(true);
    } catch (error) {
      setIsLoadingButton(false);
      console.error(error);
      setApprovalForAllToken(false);
      throw error;
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleUnitPriceChange = (e) => {
    const { value } = e.target;

    const price = value;

    setSelectedUnitPrice(value === "" ? null : price);
  };
  const handleStartingPriceChange = (e) => {
    const { value } = e.target;

    const price = value;

    setSelectedStartingPrice(value === "" ? null : price);
  };
  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
    if (event.target.value === "custom") {
      setSelectedCurrencyContract("f");
    } else {
      setSelectedCurrencyContract(selectedCurrencyContractObject[event.target.value]);
      setCustomContract(null);
    }
  };
  const handleCustomContractChange = (event) => {
    if (event.target.value === NATIVECurrency?.address) {
      setCustomContract(NATIVECurrency?.address as Address);
    } else {
      setCustomContract(event.target.value);
      setSelectedCurrencyContract(event.target.value);
      setCustomTokenContract(tokenContractAsync as TokenContract);
    }
  };
  const handleListingTypeChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedListingType([value]);
  };
  const validateInputs = () => {
    let isValid = true;
    let newErrors: any = {};
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() - 1);

    if (!startDate) {
      newErrors.startDateError = "Start date is missing.";
      isValid = false;
    } else if (new Date(startDate) < currentDate) {
      newErrors.startDateError = "Start date cannot be in the past.";
      isValid = false;
    } else if (startDate > endDate) {
      newErrors.startDateError = "Start date cannot be after the end date.";
      isValid = false;
    }

    if (!endDate) {
      newErrors.endDateError = "End date is missing.";
      isValid = false;
    } else if (new Date(endDate) < currentDate) {
      newErrors.endDateError = "End date cannot be in the past.";
      isValid = false;
    } else if (endDate < startDate) {
      newErrors.endDateError = "End date cannot be before the start date.";
      isValid = false;
    }
    if (selectedUnitPrice <= selectedStartingPrice) {
      newErrors.unitPriceError = `Unit price must be higher than the unit starting price.`;
      isValid = false;
    }
    if (
      selectedUnitPrice < 1 * 10 ** -tokenDecimals ||
      isNaN(selectedUnitPrice) ||
      selectedUnitPrice === null
    ) {
      newErrors.unitPriceError = `Unit price must be at least ${1 * 10 ** -tokenDecimals}.`;
      isValid = false;
    }

    if (
      (selectedListingType[0] === 1 && selectedStartingPrice < 1 * 10 ** -tokenDecimals) ||
      isNaN(selectedStartingPrice) ||
      selectedStartingPrice === null
    ) {
      newErrors.startingPriceError = `Unit starting price must be at least ${1 * 10 ** -tokenDecimals}.`;
      isValid = false;
    }

    if (selectedCurrency === "custom" && customTokenContract === undefined) {
      newErrors.currencyError = "Custom contract is missing or invalid.";
      isValid = false;
    }

    if (!selectedCurrency) {
      newErrors.currencyError = "Currency is missing or invalid.";
      isValid = false;
    }

    setValidate(isValid);
    setErrors(newErrors);
    return isValid;
  };
  const calculatePriceWithTaxes = (price, smartContract = false) => {
    const fees = [0.04, royalties / 100];

    const finalPrice = price - price * (fees[0] + fees[1]);

    if (smartContract) {
      return Number(finalPrice).toFixed(tokenDecimals);
    } else {
      return Number(finalPrice).toFixed(3);
    }
  };

  const selectedCurrencyContractObject = {
    USDC: USDCCurrency?.address,
    WETH: WETHCurrency?.address,
    custom: customContract
  };
  const listingType = [
    {
      title: "Direct Listing",

      picture: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill={color}>
          <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
        </svg>
      ),
      body: "This listing allows anyone to purchase the ad space at the set price. The ad space is immediately available for the buyer to use."
    },
    {
      title: "Auction Listing",

      picture: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={color}>
          <path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z" />
        </svg>
      ),
      body: "This listing allows anyone to bid on the ad space. The highest bidder at the end of the auction wins the ad space. The ad space is immediately available for the buyer to use."
    }
  ];
  const successFullListingModal = {
    body: "Your listing has been created successfully",
    subBody: "You can see your listing on the martketplace page.",
    buttonTitle: "Manage Spaces",
    hrefButton: null
  };
  const helperSartingPrice = {
    title: "Starting price",
    body: "This is the minimum price that a buyer must pay to purchase the ad space. You can set a starting price for the auction or the fixed price for the direct listing.",
    size: "small"
  };
  const helperBuyoutPrice = {
    title: "Buyout price",
    body: "This is the price that a buyer must pay to purchase the ad space immediately.",
    size: "small"
  };

  const helperFeesListing = {
    title: "Fees",
    body: `The fees are calculated on the final price. The fees are 4% for the platform and ${royalties} % royalties for the creator.  
    e.g. If you put 100 USDC, the buyer will pay 100 USDC. You will receive 100 - 4%  (protocol fees) - ${royalties}% (royalties fees) USDC.
    `,
    size: "small"
  };

  return (
    <div className="w-full">
      {/* <!-- Buy Now Modal --> */}
      <div className="modal-dialog max-w-3xl">
        <div className="modal-content !bg-secondaryBlack">
          <div className="modal-header">
            <h5 className="modal-title mr-8" id="buyNowModalLabel">
              Create a listing
            </h5>
            <button type="button" className="btn-close" onClick={handleListingModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="fill-jacarta-700 h-6 w-6 dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
              </svg>
            </button>
          </div>
          <div className="modal-body p-6 flex gap-4 items-center justify-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="mb-6 flex flex-col justify-center items-center gap-4">
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="item-description"
                    className="font-display text-jacarta-900 mb-2 block dark:text-white "
                  >
                    Type of listing for this ad space
                    <span className="text-red">*</span>
                  </label>
                  <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mb-3">
                    Select the appropriate type:
                  </p>
                  <div className="flex flex-col-reverse gap-4 justify-center items-center w-full text-jacarta-900 dark:text-white">
                    <div id="adsType" className={`grid grid-cols-1 md:grid-cols-2 gap-2`}>
                      {listingType?.map((listing: any, index: number) => (
                        <div key={index} className="relative">
                          <div
                            className={`card z-0 relative ${selectedListingType.includes(index) ? "bg-primaryPurple" : "bg-white"} open`}
                            onClick={() => {
                              document?.getElementById(`checkbox-${index}`)?.click();
                            }}
                          >
                            {selectedListingType.includes(index) && (
                              <span className="absolute border-2 border-green rounded-2xl -right-3 text-green font-bold -bottom-2 z-30 w-6 h-6 flex justify-center items-center">
                                ✓
                              </span>
                            )}
                            <Input
                              id={`checkbox-${index}`}
                              type="checkbox"
                              value={index}
                              checked={selectedListingType.includes(index)}
                              onChange={handleListingTypeChange}
                              className="hidden"
                            />
                            <div className="flex gap-3">
                              <label
                                htmlFor={`checkbox-${index}`}
                                className={`card-label  ${selectedListingType.includes(index) ? "text-white" : "text-jacarta-900"}`}
                                onClick={() => {
                                  document?.getElementById(`checkbox-${index}`)?.click();
                                }}
                              >
                                {selectedListingType[0] !== index ? (
                                  <div className="flex gap-2 justify-center items-center">
                                    <span className="w-[25px]">{listing.picture("black")}</span>
                                    <span>{listing.title}</span>
                                    <ModalHelper dark={true} {...listing} />
                                  </div>
                                ) : (
                                  <div className="flex gap-2 justify-center">
                                    <span className="w-[25px]">{listing.picture("white")}</span>
                                    <span>{listing.title}</span>
                                    <ModalHelper dark={false} {...listing} />
                                  </div>
                                )}
                              </label>
                            </div>
                            {selectedListingType?.includes(index) && (
                              <div className="mb-6 flex flex-col items-center">
                                <label
                                  htmlFor="item-description"
                                  className="font-display mt-2 text-jacarta-900 text-sm mb-2 block dark:text-white"
                                >
                                  Validity period<span className="text-red">*</span>
                                </label>
                                <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mb-3">
                                  Set the validity period for this listing.
                                </p>
                                <div className="flex flex-col gap-4 items-center text-jacarta-900 dark:text-white mb-3">
                                  <div className="flex flex-col justify-center items-center gap-1">
                                    <DatePicker
                                      minDate={new Date()}
                                      selected={startDate}
                                      onChange={(date) => {
                                        if (date < new Date()) {
                                          setStartDate(new Date());
                                        } else {
                                          setStartDate(date);
                                        }
                                      }}
                                      showMonthDropdown
                                      popperPlacement="bottom-start"
                                      showYearDropdown
                                      showTimeSelect
                                      dateFormat="MMMM d, yyyy h:mm aa"
                                      className="z-50 dark:bg-secondaryBlack border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-jacarta-800 dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                                      style={{ width: "357px" }}
                                    />
                                    <div className="flex gap-2 justify-center items-center">
                                      <span className="text-jacarta-900 dark:text-white">
                                        Start date
                                      </span>
                                      {/* <ModalHelper title={helperStartDate.title} body={helperStartDate.body} size="small" /> */}
                                    </div>
                                  </div>
                                  <div className="flex flex-col justify-center items-center gap-1">
                                    <DatePicker
                                      minDate={new Date()}
                                      selected={endDate}
                                      onChange={(date) => {
                                        if (date < new Date()) {
                                          setEndDate(new Date());
                                        } else {
                                          setEndDate(date);
                                        }
                                      }}
                                      showMonthDropdown
                                      popperPlacement="bottom-end"
                                      showYearDropdown
                                      showTimeSelect
                                      dateFormat="MMMM d, yyyy h:mm aa"
                                      className="z-50 dark:bg-secondaryBlack border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-jacarta-800 dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                                    />
                                    <div className="flex gap-2 justify-center items-center">
                                      <span className="text-jacarta-900 dark:text-white">
                                        End date
                                      </span>
                                      {/* <ModalHelper title={helperEndDate.title} body={helperEndDate.body} size="small" /> */}
                                    </div>
                                  </div>
                                </div>
                                {selectedListingType[0] === 1 && (
                                  <div className="text-center  mb-2">
                                    <div className="flex gap-2 justify-center items-center">
                                      <label
                                        htmlFor="item-description"
                                        className="font-display text-jacarta-900 text-sm mb-2 block dark:text-white"
                                      >
                                        Unit starting price <span className="text-red">*</span>
                                        <ModalHelper {...helperSartingPrice} size="small" />
                                      </label>
                                    </div>
                                    <div className="flex  flex-wrap   gap-4 items-center text-jacarta-900 dark:text-white">
                                      <Input
                                        type="number"
                                        id="numberInput"
                                        step={0.1}
                                        value={selectedStartingPrice}
                                        onChange={handleStartingPriceChange}
                                        placeholder="Unit selling price"
                                        className="flex-grow border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-jacarta-800 dark:placeholder:text-jacarta-100  rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                                      />
                                    </div>
                                    <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs ">
                                      You will receive :{" "}
                                      {calculatePriceWithTaxes(selectedStartingPrice)}{" "}
                                      {selectedCurrency}
                                    </p>
                                  </div>
                                )}
                                <div className="text-center mb-2">
                                  <div className="flex gap-2 justify-center items-center">
                                    <label
                                      htmlFor="item-description"
                                      className="font-display text-jacarta-900 mb-2 text-sm block dark:text-white"
                                    >
                                      Direct selling price <span className="text-red">*</span>
                                      <ModalHelper {...helperBuyoutPrice} size="small" />
                                    </label>
                                  </div>

                                  <div className="flex  flex-col items-center text-jacarta-900 dark:text-white">
                                    <Input
                                      type="number"
                                      id="numberInput"
                                      step={0.1}
                                      value={selectedUnitPrice}
                                      onChange={handleUnitPriceChange}
                                      placeholder="Direct selling price"
                                      className="flex-grow border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-jacarta-800 dark:placeholder:text-jacarta-100  rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                                    />
                                    <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs ">
                                      You will receive :{" "}
                                      {calculatePriceWithTaxes(selectedUnitPrice)}{" "}
                                      {selectedCurrency}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-start gap-4 mt-2">
                                  <select
                                    id="currency"
                                    value={selectedCurrency}
                                    onChange={handleCurrencyChange}
                                    className="dark:bg-secondaryBlack min-w-[110px] border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-jacarta-800 dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-5 hover:ring-2 dark:text-white"
                                  >
                                    <option value="WETH">WETH</option>
                                    {features.canAcceptUSDC && <option value="USDC">USDC</option>}
                                    {features.canAcceptUSDT && <option value="USDT">USDT</option>}
                                    {features.canAcceptCustomTokens && (
                                      <option value="custom">Custom</option>
                                    )}
                                  </select>
                                  {selectedCurrency === "custom" && (
                                    <Input
                                      type="text"
                                      value={customContract}
                                      onChange={handleCustomContractChange}
                                      placeholder="Contract address"
                                      className={`hover:ring-primaryPurple/10 ${tokenContractAsync && customContract ? "border-green" : "border-red"} focus:ring-primaryPurple  dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white`}
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              disabled={selectedListingType.length <= 0}
              className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-black  !transition-all ${selectedListingType.length <= 0 ? "btn-disabled !bg-white !text-black opacity-30 cursor-not-allowed" : "!text-white !bg-primaryPurple hover:!bg-opacity-80 !cursor-pointer"} `}
              onClick={handlePreviewModal}
            >
              Show {selectedListingType[0] === 1 ? "Auction" : "Listing"} Preview
            </button>
            {showPreviewModal && (
              <div className="modal fade show bloc">
                <AdSubmission
                  handlePreviewModal={handlePreviewModal}
                  isListing={true}
                  handleSubmit={handleSubmit}
                  startDate={startDate}
                  endDate={endDate}
                  name={true}
                  description={true}
                  link={true}
                  helperFeesListing={helperFeesListing}
                  protocolFees={4}
                  selectedUnitPrice={selectedUnitPrice}
                  selectedStartingPrice={selectedListingType[0] === 1 ? selectedStartingPrice : 0}
                  selectedRoyalties={royalties}
                  selectedCurrency={selectedCurrency}
                  validate={validate}
                  symbolContract={symbolContract}
                  errors={errors}
                  successFullUpload={successFullListing}
                  buttonTitle="Create listing 🎉 (2/2)"
                  modalTitle="Listing preview"
                  successFullUploadModal={successFullListingModal}
                  isLoadingButton={isLoadingButton}
                  approvalForAllToken={approvalForAllToken}
                  handleApprove={handleApprove}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
