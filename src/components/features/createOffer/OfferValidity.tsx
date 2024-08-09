import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { features } from "@/data/features";
import ModalHelper from "@/components/ui/modals/Helper";
import config from "@/config/config";
import Input from "@/components/ui/Input";

const ConditionalRender = ({ condition, children }) => (condition ? <div>{children}</div> : null);

const OfferValidity = ({
  chainId,
  stepsRef,
  styles,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedUnitPrice,
  handleUnitPriceChange,
  selectedCurrency,
  setSelectedCurrency,
  customContract,
  selectedRoyalties,
  setTokenDecimals,
  handleRoyaltiesChange,
  setSymbolContract,
  symbolContract,
  setCustomContract,
  setTokenContract,
  setCustomTokenContract,
  numSteps,
  currentSlide
}) => {
  const { USDC, NATIVE, WETH, USDT } = config[chainId]?.smartContracts || {};

  const currencyOptions = useMemo(
    () => ({
      WETH: WETH?.address,
      USDC: USDC?.address,
      USDT: USDT?.address,
      custom: customContract
    }),
    [WETH, USDC, USDT, customContract]
  );

  const [selectedCurrencyContract, setSelectedCurrencyContract] = useState(WETH?.address);

  const { contract: tokenContractAsync } = useContract(selectedCurrencyContract, "token");
  const { data: symbolContractAsync } = useContractRead(tokenContractAsync, "symbol");
  const { data: decimalsContractAsync } = useContractRead(tokenContractAsync, "decimals");

  useEffect(() => {
    setSymbolContract(symbolContractAsync);
    setTokenDecimals(decimalsContractAsync);
    setTokenContract(selectedCurrencyContract);
    setCustomTokenContract(tokenContractAsync);
  }, [
    symbolContractAsync,
    decimalsContractAsync,
    selectedCurrencyContract,
    tokenContractAsync,
    setSymbolContract,
    setTokenDecimals,
    setTokenContract,
    setCustomTokenContract
  ]);

  const handleCurrencyChange = (event) => {
    const currency = event.target.value;
    setSelectedCurrency(currency);

    if (currency === "NATIVE") {
      setTokenDecimals(NATIVE.decimals);
      setSymbolContract(NATIVE.symbol);
      setTokenContract(NATIVE.address);
    } else if (currency === "custom") {
      setSelectedCurrencyContract("");
      setCustomContract(null);
    } else {
      setSelectedCurrencyContract(currencyOptions[currency]);
      setCustomContract(null);
    }
  };

  const handleCustomContractChange = (event) => {
    const contractAddress = event.target.value;
    setCustomContract(contractAddress);
    setSelectedCurrencyContract(contractAddress);
  };

  const renderDatePicker = (date, setDate, label, helper) => (
    <div className="flex flex-col justify-center items-center gap-1">
      <DatePicker
        minDate={new Date()}
        selected={date}
        onChange={setDate}
        showMonthDropdown
        popperPlacement="bottom-end"
        showYearDropdown
        className="bg-jacarta-800 border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-primaryPurple dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
      />
      <div className="flex gap-2 justify-center items-center">
        <span className="text-jacarta-900 dark:text-white">{label}</span>
        <ModalHelper title={helper.title} body={helper.body} size="small" />
      </div>
    </div>
  );

  return (
    <>
      {currentSlide === 3 && (
        <div
          ref={(el) => {
            stepsRef.current[3] = el;
          }}
          className={styles.form__step}
        >
          <div className="pr-6 pl-2 relative flex flex-col gap-8 items-center">
            <div className="absolute top-0 right-0">
              {currentSlide + 1}/{numSteps}
            </div>
            <div className="flex flex-col w-full items-center border-b-1 border-primaryPurple shadow-2xl pb-2 ">
              <h3 className="mb-2 text-jacarta-100">Validity & Financials</h3>
              <p className="text-center pt-2 dark:text-white">
                Set offer&apos;s validity period, currency, and royalties.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor="item-description"
                className="font-display text-jacarta-900 mb-2 block dark:text-white"
              >
                Validity period<span className="text-red">*</span>
              </label>
              <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mb-3">
                Set the validity period for this listing associated with your offer. During this
                period, the acquired NFT grants the right to display an advertisement in the
                reserved space on your platform. The length of this validity period may influence
                the resale value of these NFTs on the secondary market.
              </p>
              <div className="flex gap-4 items-center text-jacarta-900 dark:text-white mb-3">
                {renderDatePicker(startDate, setStartDate, "Start date", {
                  title: "Start date",
                  body: "You are free to choose the start date for the offer's validity. By default, it will be today's date."
                })}
                {renderDatePicker(endDate, setEndDate, "End date", {
                  title: "End date",
                  body: "If you do not wish to set a time limit, choose a distant end date."
                })}
              </div>
            </div>
            <div className="mb-6 flex flex-col items-center">
              <label
                htmlFor="unit-price"
                className="font-display text-jacarta-900 mb-2 block dark:text-white"
              >
                Unit selling price <span className="text-red">*</span>
              </label>
              <ConditionalRender condition={["USDT", "USDC"].includes(selectedCurrency)}>
                <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mb-3">
                  USD payment means you&apos;ll receive USD tokens (1 USDC = 1$). You&apos;ll be
                  able to cash out via wire transfer with a service like MtPelerin. You can change
                  the pricing later.
                </p>
              </ConditionalRender>
              <div className="flex flex-wrap gap-4 items-center text-jacarta-900 dark:text-white">
                <Input
                  id="unit-price"
                  type="number"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step={0.1}
                  value={selectedUnitPrice}
                  onChange={handleUnitPriceChange}
                  placeholder="Unit selling price"
                  className="flex-grow border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-primaryPurple dark:placeholder:text-jacarta-100 rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                />
                <ConditionalRender condition={features.canHaveMultipleCurrencies}>
                  <div className="flex gap-4">
                    <select
                      id="currency"
                      value={selectedCurrency}
                      onChange={handleCurrencyChange}
                      className="bg-jacarta-800 min-w-[110px] border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-primaryPurple dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-5 hover:ring-2 dark:text-white"
                    >
                      <option value="WETH">WETH</option>
                      {features.canAcceptUSDC && <option value="USDC">USDC</option>}
                      {features.canAcceptNativeTokens && (
                        <option value="NATIVE">{NATIVE?.symbol}</option>
                      )}
                      {features.canAcceptUSDT && <option value="USDT">USDT</option>}
                      {features.canAcceptCustomTokens && <option value="custom">Custom</option>}
                    </select>
                    {selectedCurrency === "custom" && (
                      <Input
                        type="text"
                        value={customContract}
                        onChange={handleCustomContractChange}
                        placeholder="Contract address"
                        className={`dark:bg-secondaryBlack hover:ring-primaryPurple/10 ${
                          tokenContractAsync && customContract ? "border-green" : "border-red"
                        } focus:ring-primaryPurple dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white`}
                      />
                    )}
                  </div>
                </ConditionalRender>
              </div>
              <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mt-3">
                You&apos;ll earn up to {selectedUnitPrice} {symbolContract ?? selectedCurrency}. As
                DSponsor charges a fee of 4%, sponsors will pay{" "}
                {(parseFloat(selectedUnitPrice) * 1.04).toFixed(2)}{" "}
                {symbolContract ?? selectedCurrency}.
              </p>
            </div>
            <div className="mb-6 flex flex-col items-center">
              <label
                htmlFor="royalties"
                className="font-display text-jacarta-900 mb-2 block dark:text-white"
              >
                Royalties <span className="text-red">*</span>
              </label>
              <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mb-3">
                Sponsors can sell an ad space ownership on the marketplace. Define the fee you want
                to get from secondary sales. Sponsors might refuse to buy an ad space if your
                royalty fee is too high. You can change this value later.
              </p>
              <div className="flex gap-4 items-center text-jacarta-900 dark:text-white">
                <Input
                  id="royalties"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  step={0.01}
                  max={100}
                  pattern="^\d+(?:[.,]\d+)?$"
                  value={selectedRoyalties}
                  onChange={handleRoyaltiesChange}
                  placeholder="Royalties"
                  className="border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-primaryPurple dark:placeholder:text-jacarta-100 rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfferValidity;
