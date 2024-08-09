import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Divider } from "@nextui-org/react";
import ResponsiveTooltip from "@/components/ui/ResponsiveTooltip";
import { InformationCircleIcon, ClipboardIcon } from "@heroicons/react/24/solid";
import handleCopy from "@/utils/misc/handleCopy";
import Tippy from "@tippyjs/react";
import { ChromePicker } from "react-color";
import Input from "@/components/ui/Input";

const initialColumns = (numberOfTokens) => {
  if (numberOfTokens % 7 === 0) return 7;
  if (numberOfTokens % 6 === 0) return 6;
  if (numberOfTokens % 5 === 0) return 5;
  if (numberOfTokens % 4 === 0) return 4;
  if (numberOfTokens % 3 === 0) return 3;

  if (numberOfTokens > 2) {
    return initialColumns(numberOfTokens - 1);
  }

  return 2;
};

const HTML = ({ chainId, offerId, offerTokens }) => {
  const [copied, setCopied] = React.useState(false);
  const [columns, setColumns] = useState(
    localStorage.getItem("htmlSettings")
      ? JSON.parse(localStorage.getItem("htmlSettings") as string).columns
      : false
  );
  const [numberOfColumns, setNumberOfColumns] = useState(
    localStorage.getItem("htmlSettings")
      ? JSON.parse(localStorage.getItem("htmlSettings") as string).numberOfColumns
      : initialColumns(offerTokens?.length)
  );
  const [numberOfRows, setNumberOfRows] = useState(offerTokens?.length / numberOfColumns);
  const [bgColor, setBgColor] = useState(
    localStorage.getItem("htmlSettings")
      ? JSON.parse(localStorage.getItem("htmlSettings") as string).bgColor
      : false
  );
  const [color, setColor] = useState("#0d102d");
  const [htmlSrc, setHtmlSrc] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayType, setDisplayType] = useState("ClickableLogoGrid");
  const [ratio, setRatio] = useState(
    localStorage.getItem("htmlSettings")
      ? JSON.parse(localStorage.getItem("htmlSettings") as string).ratio
      : false
  );
  const [ratioValue, setRatioValue] = useState(
    localStorage.getItem("htmlSettings")
      ? JSON.parse(localStorage.getItem("htmlSettings") as string).ratioValue
      : "1:1"
  );

  useEffect(() => {
    const savedSettings = localStorage.getItem("htmlSettings");

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setColumns(settings.columns);
      setNumberOfColumns(settings.numberOfColumns);
      setBgColor(settings.bgColor);
      setColor(settings.bgColor);
      setRatio(settings.ratio);
      setRatioValue(settings.ratioValue);
    }
  }, []);

  useEffect(() => {
    const settings = {
      columns,
      numberOfColumns,
      bgColor,
      color,
      ratio,
      ratioValue
    };
    localStorage.setItem("htmlSettings", JSON.stringify(settings));
  }, [columns, numberOfColumns, bgColor, color, ratio, ratioValue]);

  useEffect(() => {
    setNumberOfRows(Math.ceil(offerTokens?.length / numberOfColumns));
  }, [offerTokens, numberOfColumns]);

  useEffect(() => {
    const generateTableHTML = () => {
      if (displayType === "DynamicBanner") {
        return `<img src="https://relayer.dsponsor.com/${chainId}/integrations/${offerId}/DynamicBanner/image${ratio && ratioValue !== "" ? `?ratio=${ratioValue}` : ""}" style="max-width: 100%; height: auto; display: block;" alt="No Ad" />`;
      }

      if (!offerTokens || offerTokens.length === 0) return "";
      if (!numberOfColumns || numberOfColumns === 0) return "";
      if (!numberOfRows || numberOfRows === 0) return "";

      const sortedOfferTokens = [...offerTokens]?.sort((a, b) => a.tokenId - b.tokenId);

      let tableHTML = `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed; background-color: ${bgColor ? `#${color}` : "transparent"};">`;

      for (
        let rowIndex = 0;
        rowIndex < Math.ceil(sortedOfferTokens?.length / numberOfColumns);
        rowIndex++
      ) {
        tableHTML += `<tr>`;

        const isLastRow = rowIndex === numberOfRows - 1;
        let realElementsInLastRow = sortedOfferTokens.length % numberOfColumns;
        realElementsInLastRow =
          realElementsInLastRow === 0 ? numberOfColumns : realElementsInLastRow;
        const totalEmptyCells = numberOfColumns - realElementsInLastRow;
        const emptyCellsBefore = Math.floor(totalEmptyCells / 2);
        const emptyCellsAfter = Math.ceil(totalEmptyCells / 2);

        if (isLastRow) {
          for (let i = 0; i < emptyCellsBefore; i++) {
            tableHTML += `<td width="${100 / numberOfColumns}%" style="text-align: center; padding: 10px;"></td>`;
          }
        }

        for (
          let colIndex = 0;
          colIndex < (isLastRow ? realElementsInLastRow : numberOfColumns);
          colIndex++
        ) {
          const index = rowIndex * numberOfColumns + colIndex;

          if (index < sortedOfferTokens?.length) {
            tableHTML += `<td width="${100 / numberOfColumns}%" style="text-align: center; padding: 10px;">
            <a href="https://relayer.dsponsor.com/${chainId}/integrations/${offerId}/${sortedOfferTokens[index]?.tokenId}/link" target="_blank" rel="noopener noreferrer">
              <img src="https://relayer.dsponsor.com/${chainId}/integrations/${offerId}/${sortedOfferTokens[index]?.tokenId}/image" style="max-width: 100%; height: auto; display: block;" alt="No Ad" />
            </a>
          </td>`;
          }
        }

        if (isLastRow) {
          for (let i = 0; i < emptyCellsAfter; i++) {
            tableHTML += `<td width="${100 / numberOfColumns}%" style="text-align: center; padding: 10px;"></td>`;
          }
        }

        tableHTML += `</tr>`;
      }

      tableHTML += `</table>`;
      return tableHTML;
    };

    const htmlSrc = generateTableHTML();
    setHtmlSrc(htmlSrc);
  }, [
    chainId,
    offerId,
    offerTokens,
    numberOfColumns,
    bgColor,
    numberOfRows,
    color,
    displayType,
    ratio,
    ratioValue
  ]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedHtmlSrc = htmlSrc.length > 250 ? htmlSrc.substring(0, 250) + "..." : htmlSrc;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="dark:text-jacarta-100 text-jacarta-100">
          Copy and paste the provided HTML code to the desired location on your newsletter template.
          Compatible with platforms such as: Mailchimp, Brevo, etc...
        </span>

        <span className="dark:text-jacarta-100 text-jacarta-100">
          Read the full documentation by clicking{" "}
          <Link href="/" target="_blank" className="text-primaryPurple hover:text-opacity-80">
            here
          </Link>
          .
        </span>
      </div>

      <Divider className="my-4" />

      <div className="flex items-center">
        <span className="dark:text-jacarta-100 text-jacarta-100 mr-8">Select display type : </span>

        <RadioGroup.Root
          className="flex items-center gap-8"
          value={displayType}
          onValueChange={(value) => setDisplayType(value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroup.Item
              className="bg-white w-4 h-4 rounded-full hover:border-primaryPink outline-none cursor-default"
              value="ClickableLogoGrid"
              id="r1"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-primaryPurple" />
            </RadioGroup.Item>
            <label className="text-white leading-none pl-1" htmlFor="r1">
              Clickable Logo Grid
            </label>
            <ResponsiveTooltip text="This integration allows you to display a grid of clickable logos. (Example: sponsor logo grid at the bottom of the page). Each slot in the grid will display the sponsor's proposed logo redirecting to a URL. If you need to display a single static logo, you can also choose this integration.">
              <InformationCircleIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-help" />
            </ResponsiveTooltip>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroup.Item
              className="bg-white w-4 h-4 rounded-full hover:border-primaryPink outline-none cursor-default"
              value="DynamicBanner"
              id="r2"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-primaryPurple" />
            </RadioGroup.Item>
            <label className="text-white leading-none pl-1" htmlFor="r2">
              Dynamic Banner
            </label>
            <ResponsiveTooltip text="This integration lets you display a randomly selected ad from those submitted by sponsors, with a new ad randomly selected at each request. The ad does not redirect to a URL.">
              <InformationCircleIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-help" />
            </ResponsiveTooltip>
          </div>
        </RadioGroup.Root>
      </div>

      <span className="dark:text-jacarta-100 text-jacarta-100">
        Copy and paste the following code to the desired location on your page.
      </span>

      <div className="bg-jacarta-800 relative hover:bg-jacarta-800 border border-primaryPurple ring-0 focus:ring-0 focus:border-primaryPurple placeholder:text-jacarta-300 w-full rounded-lg p-3 text-white">
        <div className="absolute top-2 right-2">
          <button
            className="z-10"
            onClick={() => {
              handleCopy(htmlSrc, setCopied);

              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <Tippy content={`${copied ? "copied" : "copy"}`} placement="top" hideOnClick={false}>
              <ClipboardIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-pointer" />
            </Tippy>
          </button>
        </div>

        <code className="text-sm">
          {isExpanded ? htmlSrc : truncatedHtmlSrc}
          {htmlSrc?.length > 250 && (
            <button onClick={toggleExpansion} className="text-primaryPurple mt-2 ml-2">
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </code>
      </div>

      {displayType === "ClickableLogoGrid" && (
        <>
          <Divider className="my-4" />
          <span className="text-white text-lg font-semibold">Customize</span>
          <div className="flex flex-wrap items-start gap-8">
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  checked={columns}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setColumns(false);
                      setNumberOfColumns(initialColumns(offerTokens?.length));
                    } else {
                      setColumns(true);
                      setNumberOfColumns(offerTokens?.length);
                    }
                  }}
                  className=" !text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
                />
                <span className="text-white">Number of columns</span>
                <ResponsiveTooltip text="You can set the number of columns to match the designated space on your page.">
                  <InformationCircleIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-help" />
                </ResponsiveTooltip>
              </label>
              {columns && (
                <Input
                  type="number"
                  value={parseInt(numberOfColumns)}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setNumberOfColumns("");
                    } else if (
                      parseFloat(value) > 0 &&
                      parseFloat(value) <= Math.min(offerTokens?.length, 25)
                    ) {
                      setNumberOfColumns(value);
                    } else {
                      setNumberOfColumns(Math.min(offerTokens?.length, 25));
                    }
                  }}
                  placeholder="Number of columns"
                  min={1}
                  max={Math.min(offerTokens?.length, 25)}
                />
              )}
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  checked={bgColor}
                  onChange={(e) => setBgColor(e.target.checked)}
                  className=" !text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
                />
                <span className="text-white">Background color</span>
                <ResponsiveTooltip text="By default, the background color of the table is not defined. You can select one if desired.">
                  <InformationCircleIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-help" />
                </ResponsiveTooltip>
              </label>
              {bgColor && (
                <ChromePicker
                  color={color}
                  onChangeComplete={(color) => setColor(color.hex.replace("#", ""))}
                />
              )}
            </div>
          </div>
        </>
      )}

      <Divider className="my-4" />

      <span className="text-white text-lg font-semibold">Preview</span>

      {displayType === "ClickableLogoGrid" && (
        <table
          width="100%"
          border={0}
          cellSpacing={0}
          cellPadding={0}
          style={{ tableLayout: "fixed", backgroundColor: bgColor ? `#${color}` : "transparent" }}
        >
          <tbody>
            {offerTokens &&
              numberOfColumns > 0 &&
              numberOfRows > 0 &&
              Array.from({
                length: Math.ceil(
                  offerTokens?.sort((a, b) => a?.tokenId - b?.tokenId)?.length / numberOfColumns
                )
              }).map((_, rowIndex) => {
                const totalRows = Math.ceil(
                  offerTokens?.sort((a, b) => a?.tokenId - b?.tokenId)?.length / numberOfColumns
                );
                const isLastRow = rowIndex === totalRows - 1;
                let realElementsInLastRow =
                  offerTokens?.sort((a, b) => a?.tokenId - b?.tokenId)?.length % numberOfColumns;
                realElementsInLastRow =
                  realElementsInLastRow === 0 ? numberOfColumns : realElementsInLastRow; // Handle full last row
                const totalEmptyCells = numberOfColumns - realElementsInLastRow;
                const emptyCellsBefore = Math.floor(totalEmptyCells / 2);
                const emptyCellsAfter = Math.ceil(totalEmptyCells / 2);

                return (
                  <tr key={rowIndex}>
                    {isLastRow &&
                      Array.from({ length: emptyCellsBefore }).map((_, index) => (
                        <td
                          key={`empty-before-${index}`}
                          width={`${100 / numberOfColumns}%`}
                          style={{ textAlign: "center", padding: "10px" }}
                        />
                      ))}
                    {Array.from({ length: numberOfColumns }).map((_, colIndex) => {
                      const index = rowIndex * numberOfColumns + colIndex;
                      if (index < offerTokens?.sort((a, b) => a?.tokenId - b?.tokenId)?.length) {
                        return (
                          <td
                            key={colIndex}
                            width={`${100 / numberOfColumns}%`}
                            style={{ textAlign: "center", padding: "10px" }}
                          >
                            <a
                              href={`https://relayer.dsponsor.com/${chainId}/integrations/${offerId}/${offerTokens?.sort((a, b) => a?.tokenId - b?.tokenId)[index]?.tokenId}/link`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`https://relayer.dsponsor.com/${chainId}/integrations/${offerId}/${offerTokens?.sort((a, b) => a?.tokenId - b?.tokenId)[index]?.tokenId}/image`}
                                style={{ maxWidth: "100%", height: "auto", display: "block" }}
                                alt="No Ad"
                              />
                            </a>
                          </td>
                        );
                      } else if (
                        isLastRow &&
                        colIndex >= realElementsInLastRow + emptyCellsBefore
                      ) {
                        return (
                          <td
                            key={`empty-after-${colIndex}`}
                            width={`${100 / numberOfColumns}%`}
                            style={{ textAlign: "center", padding: "10px" }}
                          />
                        );
                      }
                      return null;
                    })}
                    {isLastRow &&
                      Array.from({ length: emptyCellsAfter }).map((_, index) => (
                        <td
                          key={`empty-after-${index}`}
                          width={`${100 / numberOfColumns}%`}
                          style={{ textAlign: "center", padding: "10px" }}
                        />
                      ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      {displayType === "DynamicBanner" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://relayer.dsponsor.com/${encodeURIComponent(Number(chainId))}/integrations/${encodeURIComponent(Number(offerId))}/DynamicBanner/image?ratio=${encodeURIComponent(ratio && ratioValue !== "" ? ratioValue : "1:1")}`}
          style={{ maxWidth: "100%", height: "auto", display: "block" }}
          alt="No Ad"
        />
      )}
    </div>
  );
};

export default HTML;
