import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAddress, useSwitchChain, useContract, useContractWrite, Web3Button, useContractRead, useStorageUpload, useTokenDecimals, CheckoutWithCard, CheckoutWithEth } from "@thirdweb-dev/react";
import { FileUploader } from "react-drag-drop-files";
import  ModalHelper  from "../../Helper/modalHelper";
import {useChainContext} from "../../../contexts/hooks/useChainContext";

const Step_4_Create = ({
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
  tokenDecimals,
  handleRoyaltiesChange,
  setSymbolContract,
  symbolContract,
  setCustomContract,
  setTokenContract,
  setCustomTokenContract,
}) => {

  const { getCurrencyAddress } = useChainContext();

  const USDCCurrency = getCurrencyAddress("USDC");
  const ETHCurrency = getCurrencyAddress("ETH");
  const WETHCurrency = getCurrencyAddress("WETH");
  const USDTCurrency = getCurrencyAddress("USDT");
  const [selectedCurrencyContract, setSelectedCurrencyContract] = useState(USDCCurrency.contract);
  const { contract: tokenContractAsync } = useContract(selectedCurrencyContract, "token");
  const { data: symbolContractAsync } = useContractRead(tokenContractAsync, "symbol");
  const { data: decimalsContractAsync } = useContractRead(tokenContractAsync, "decimals");

  useEffect(() => {
    setSymbolContract(symbolContractAsync);
    setTokenDecimals(decimalsContractAsync);
    setTokenContract(selectedCurrencyContract);
    setCustomTokenContract(tokenContractAsync);
  }, [decimalsContractAsync, symbolContractAsync, setTokenDecimals, setSymbolContract, setTokenContract, selectedCurrencyContract, tokenContractAsync, setCustomTokenContract]);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
    if (event.target.value === "ETH") {
      setTokenDecimals(ETHCurrency.decimals);
      setSymbolContract(ETHCurrency.symbol);
      setTokenContract(ETHCurrency.contract);
    } else if (event.target.value === "custom") {
      setSelectedCurrencyContract("f");
    } else {
      console.log("ici");
      setSelectedCurrencyContract(selectedCurrencyContractObject[event.target.value]);
      setCustomContract(null);
    }
  };
  const handleCustomContractChange = (event) => {
    if (event.target.value === ETHCurrency.contract) {
      setTokenDecimals(ETHCurrency.decimals);
      setSymbolContract(ETHCurrency.symbol);
      setTokenContract(ETHCurrency.contract);
      setCustomTokenContract(ETHCurrency.contract);
    } else {
      setCustomContract(event.target.value);
      setSelectedCurrencyContract(event.target.value);
      setCustomTokenContract(tokenContractAsync);
    }
  };

  const helperStartDate = {
    title: "Start date",
    body: "You are free to choose the start date for the offer's validity. By default, it will be today's date.",
  };
  const helperEndDate = {
    title: "End date",
    body: "If you do not wish to set a time limit, choose a distant end date.",
  };


  const selectedCurrencyContractObject = {
    USDC: USDCCurrency.contract,
    ETH: ETHCurrency.contract,
    WETH: WETHCurrency.contract,
    USDT: USDTCurrency.contract,
    custom: customContract,
  };

  return (
    <div ref={(el) => (stepsRef.current[3] = el)} className={styles.form__step}>
      <div className="pr-6 pl-2">
        <h3 className="mb-2">Step 4 : Validity & Financials</h3>
        <p className="text-center pt-2  mb-14 dark:text-white">Set offer&apos;s validity period, currency, and royalties.</p>
        <div className="mb-6 flex flex-col items-center">
          <label htmlFor="item-description" className="font-display text-jacarta-700 mb-2 block dark:text-white">
            Validity period<span className="text-red">*</span>
          </label>
          <p className="dark:text-jacarta-300 text-jacarta-400 text-2xs mb-3">
            Set the validity period for the spaces associated with your offer. During this period, the acquired NFT grants the right to display an advertisement in the reserved space on your platform. The length of this
            validity period may influence the resale value of these NFTs on the secondary market.
          </p>
          <div className="flex gap-4 items-center text-jacarta-700 dark:text-white mb-3">
            <div className="flex flex-col justify-center items-center gap-1">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showMonthDropdown
                popperPlacement="bottom-end"
                showYearDropdown
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
              />
              <div className="flex gap-2 justify-center items-center">
                <span className="text-jacarta-700 dark:text-white">Start date</span>
                <ModalHelper title={helperStartDate.title} body={helperStartDate.body} size="small" />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-1">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showMonthDropdown
                popperPlacement="bottom-end"
                showYearDropdown
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
              />
              <div className="flex gap-2 justify-center items-center">
                <span className="text-jacarta-700 dark:text-white">End date</span>
                <ModalHelper title={helperEndDate.title} body={helperEndDate.body} size="small" />
              </div>
            </div>
          </div>
          <div className="mb-6 flex flex-col items-center">
            <label htmlFor="item-description" className="font-display text-jacarta-700 mb-2 block dark:text-white">
              Unit selling price
              <span className="text-red">*</span>
            </label>
            <p className="dark:text-jacarta-300 text-jacarta-400 text-2xs mb-3">
              USD payment means you&apos;ll receive USD tokens (1 USDC = 1$). You&apos;ll be able to cash out via wire transfer with a service like MtPelerin. You can change the pricing later.
            </p>
            <div className="flex  flex-wrap   gap-4 items-center text-jacarta-700 dark:text-white">
              <input
                id="numberInput"
                type="number"
                step="0.1"
                value={selectedUnitPrice}
                onChange={handleUnitPriceChange}
                placeholder="Unit selling price"
                className="dark:bg-jacarta-700 flex-grow border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300  rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
              />

              <div className="flex gap-4">
                <select
                  id="currency"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  className="dark:bg-jacarta-700 min-w-[110px] border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-5 hover:ring-2 dark:text-white"
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                  <option value="WETH">WETH</option>
                  <option value="USDT">USDT</option>
                  <option value="custom">Custom</option>
                </select>
                {selectedCurrency === "custom" && (
                  <input
                    type="text"
                    value={customContract}
                    onChange={handleCustomContractChange}
                    placeholder="Contract address"
                    className={`dark:bg-jacarta-700  hover:ring-accent/10 ${
                      tokenContractAsync && customContract ? "border-green" : "border-red"
                    } focus:ring-accent  dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white`}
                  />
                )}
              </div>
            </div>
            <p className="dark:text-jacarta-300 text-jacarta-400 text-2xs mt-3">
              You&apos;ll earn up to {selectedUnitPrice} {symbolContractAsync ? symbolContractAsync : selectedCurrency}. As d&gt;sponsor charges a fee of 4%, sponsors will pay{" "}
              {parseFloat(selectedUnitPrice) + parseFloat(selectedUnitPrice) * (4 / 100)} {symbolContractAsync ? symbolContractAsync : selectedCurrency}.
            </p>
          </div>

          {/* <!-- Royalties --> */}
          <div className="mb-6 flex flex-col items-center">
            <label htmlFor="item-description" className="font-display text-jacarta-700 mb-2 block dark:text-white">
              Royalties
              <span className="text-red">*</span>
            </label>
            <p className="dark:text-jacarta-300 text-jacarta-400  text-2xs mb-3">
              Sponsors can sell an ad space ownership on the marketplace. Define the fee you want to get from secondary sales. Sponsors might refuse to buy an ad space if your royalty fee is too high. You can change this
              value pricing later.
            </p>
            <div className="flex  gap-4 items-center text-jacarta-700 dark:text-white">
              <input
                id="numberInput"
                type="number"
                min="0"
                inputMode="decimal"
                step="0.01"
                max="100"
                pattern="^\d+(?:[.,]\d+)?$"
                value={selectedRoyalties}
                onChange={handleRoyaltiesChange}
                placeholder="Royalties"
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300  rounded-lg py-3 px-15 hover:ring-2 dark:text-white"
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step_4_Create;
