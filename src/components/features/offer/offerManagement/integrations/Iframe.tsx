import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Divider } from "@nextui-org/react";
import ResponsiveTooltip from "@/components/ui/ResponsiveTooltip";
import { InformationCircleIcon, ClipboardIcon } from "@heroicons/react/24/solid";
import handleCopy from "@/utils/misc/handleCopy";
import Tippy from "@tippyjs/react";
import { ChromePicker } from "react-color";
import Input from "@/components/ui/Input";

const Iframe = ({ chainId, offerId }) => {
  const [copied, setCopied] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [customHeight, setCustomHeight] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).customHeight
      : false
  );
  const [height, setHeight] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).height
      : "400px"
  );
  const [bgColor, setBgColor] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).bgColor
      : false
  );
  const [color, setColor] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).color
      : "#0d102d"
  );
  const [changeRatio, setChangeRatio] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).changeRatio
      : false
  );
  const [ratio, setRatio] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).ratio
      : "1:1"
  );
  const [customAdPreview, setCustomAdPreview] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).customAdPreview
      : false
  );
  const [tokenId, setTokenId] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).tokenId
      : ""
  );
  const [tokenIds, setTokenIds] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).tokenIds
      : []
  );
  const [previewImage, setPreviewImage] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).previewImage
      : ""
  );
  const [previewLink, setPreviewLink] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).previewLink
      : ""
  );
  const [displayType, setDisplayType] = useState(
    localStorage.getItem("iframeSettings")
      ? JSON.parse(localStorage.getItem("iframeSettings") as string).displayType
      : "ClickableLogosGrid"
  );

  useEffect(() => {
    const params = new URLSearchParams();

    if (bgColor) params.append("bgColor", color);
    if (changeRatio) params.append("ratio", ratio);
    if (customAdPreview) {
      if (displayType === "ClickableLogosGrid") params.append("previewTokenId", tokenId);
      if (displayType === "DynamicBanner") params.append("tokenIds", tokenIds.join(","));
      if (previewImage) params.append("previewImage", previewImage);
      if (previewLink) params.append("previewLink", previewLink);
    }
    setIframeSrc(
      `https://relayer.dsponsor.com/${chainId}/integrations/${offerId}/${displayType}/iFrame${params.toString() ? "?" + params.toString() : ""}`
    );
  }, [
    chainId,
    offerId,
    bgColor,
    color,
    changeRatio,
    ratio,
    customAdPreview,
    tokenId,
    tokenIds,
    previewImage,
    previewLink,
    displayType
  ]);

  useEffect(() => {
    const savedSettings = localStorage.getItem("iframeSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCustomHeight(settings.customHeight);
      setHeight(settings.height);
      setBgColor(settings.bgColor);
      setColor(settings.color);
      setChangeRatio(settings.changeRatio);
      setRatio(settings.ratio);
      setCustomAdPreview(settings.customAdPreview);
      setTokenId(settings.tokenId);
      setTokenIds(settings.tokenIds);
      setPreviewImage(settings.previewImage);
      setPreviewLink(settings.previewLink);
      setDisplayType(settings.displayType);
    }
  }, []);

  useEffect(() => {
    const settings = {
      customHeight,
      height,
      bgColor,
      color,
      changeRatio,
      ratio,
      customAdPreview,
      tokenId,
      tokenIds,
      previewImage,
      previewLink,
      displayType
    };
    localStorage.setItem("iframeSettings", JSON.stringify(settings));
  }, [
    customHeight,
    height,
    bgColor,
    color,
    changeRatio,
    ratio,
    customAdPreview,
    tokenId,
    tokenIds,
    previewImage,
    previewLink,
    displayType
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="dark:text-jacarta-100 text-jacarta-100">
          Use iframes for simple integration on your website. Copy and paste the code to the desired
          location on your page. Compatible with platforms such as: WordPress, Webflow, Wix,
          GoDaddy, Squarespace, etc...{" "}
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
          onValueChange={(value) => setDisplayType(value)}
          value={displayType}
        >
          <div className="flex items-center gap-2">
            <RadioGroup.Item
              className="bg-white w-4 h-4 rounded-full hover:border-primaryPink outline-none cursor-default"
              value="ClickableLogosGrid"
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
            <ResponsiveTooltip text="This integration lets you display a randomly selected ad from those submitted by sponsors, with a new ad randomly selected at each request. The ad redirects to a URL.">
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
              handleCopy(
                `<iframe sandbox="allow-same-origin allow-scripts allow-popups allow-top-navigation-by-user-activation" src="${iframeSrc}" style="width: 100%; ${customHeight ? `height: ${height};` : "height: 100%;"} overflow: hidden; border: none;"></iframe>`,
                setCopied
              );

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
          {`<iframe sandbox="allow-same-origin allow-scripts allow-popups allow-top-navigation-by-user-activation" src="${iframeSrc}" style="width:100%; ${customHeight ? `height:${height};` : "height:100%;"} overflow:hidden; border: none;"></iframe>`}
        </code>
      </div>

      <Divider className="my-4" />

      <span className="text-white text-lg font-semibold">Customize</span>

      <div className="flex flex-wrap items-start gap-8">
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={customHeight}
              onChange={(e) => setCustomHeight(e.target.checked)}
              className=" !text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
            />
            <span className="text-white">Custom height</span>
            <ResponsiveTooltip text="Some integrations do not support automatic height adjustment. In such cases, we recommend setting a predefined height (which you can change at any time) to match the designated space on your page.">
              <InformationCircleIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-help" />
            </ResponsiveTooltip>
          </label>
          {customHeight && (
            <Input
              type="number"
              value={parseInt(height)}
              onChange={(e) => setHeight(`${e.target.value}px`)}
              placeholder="Height in px (ex: 400)"
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
            <ResponsiveTooltip text="By default, the background color of the space is #0d102d. You can select a different color to match your content.">
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

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={changeRatio}
              onChange={(e) => setChangeRatio(e.target.checked)}
              className=" !text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
            />
            <span className="text-white">Change ratio</span>
            <ResponsiveTooltip text="The ratio defined in your offer will apply by default to each ad space. You can choose a different display ratio for the ad spaces if desired; this will not affect the original ad image ratio.">
              <InformationCircleIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-help" />
            </ResponsiveTooltip>
          </label>
          {changeRatio && (
            <Input
              type="text"
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              placeholder="Ratio (ex: 16:9)"
            />
          )}
        </div>

        {/* 
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={customAdPreview}
              onChange={(e) => setCustomAdPreview(e.target.checked)}
              className=" !text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
            />
            <span className="text-white">Custom ad preview</span>
            <ResponsiveTooltip
              text={
                displayType === "ClickableLogosGrid"
                  ? "You can choose to display a custom preview for any of the desired ad spaces. In this case, specify the token it should apply to, the URL of the preview image, and the link to the target page."
                  : "You can choose the token ids you want to display (by default all from the offer can be displayed). You can choose to display a custom image instead of the images from the tokens, in this case, specify the URL of the preview image, and the link to the target page."
              }
            >
              <InformationCircleIcon className="w-5 h-5 text-white hover:text-jacarta-100 cursor-help" />
            </ResponsiveTooltip>
          </label>
          {customAdPreview && (
            <div className="flex flex-col gap-4">
              {displayType === "ClickableLogosGrid" ? (
                <select
                  placeholder="Token Id"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="p-2 rounded-md bg-secondaryBlack text-jacarta-100"
                >
                  {offerTokens.map((token) => (
                    <option key={token?.tokenId} value={token?.tokenId}>
                      {token?.tokenId}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  {offerTokens?.map((token) => (
                    <label key={token?.tokenId} className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        checked={tokenIds.includes(token?.tokenId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTokenIds([...tokenIds, token?.tokenId]);
                          } else {
                            setTokenIds(tokenIds.filter((id) => id !== token?.tokenId));
                          }
                        }}
                        className="!text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
                      />
                      <span className="text-white">{token?.tokenId}</span>
                    </label>
                  ))}
                </div>
              )}
              <Input
                type="text"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                placeholder="Preview Image URL"
              />
              <Input
                type="text"
                value={previewLink}
                onChange={(e) => setPreviewLink(e.target.value)}
                placeholder="Preview Link URL"
              />
            </div>
          )}
        </div>*/}
      </div>

      <Divider className="my-4" />

      <span className="text-white text-lg font-semibold">Preview</span>

      <div className={`w-full`} style={{ height: customHeight ? height : "500px" }}>
        <iframe
          title="offer"
          loading="lazy"
          src={iframeSrc}
          height={customHeight ? height : "100%"}
          width="100%"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Iframe;
