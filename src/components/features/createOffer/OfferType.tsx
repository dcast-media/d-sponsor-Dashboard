import { useState, useCallback } from "react";
import ModalHelper from "@/components/ui/modals/Helper";
import Input from "@/components/ui/Input";

const AdSpaceSelector = ({
  AdIntegrationData,
  selectedIntegration,
  handleIntegrationChange,
  imageRatios,
  handleCustomRatioChange,
  handleCustomRatioInput,
  customRatioInputShown,
  customImageRatio,
  validRatio,
  predefinedRatios
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-col">
      <label className="font-display text-jacarta-900 mb-2 block dark:text-white text-center">
        Type of ad space for this offer <span className="text-red">*</span>
      </label>
      <p className="dark:text-jacarta-100 text-center text-2xs mb-3">
        Select the appropriate type.
      </p>
    </div>

    <div className="flex flex-wrap justify-center gap-2">
      {AdIntegrationData.map((integration, index) => (
        <div key={index} className="relative">
          <button
            className={`card relative ${selectedIntegration.includes(index) ? "bg-primaryPurple-dark" : "hover:ring-primaryPurple/30 border-primaryPurple border-2"}`}
            onClick={(e) => {
              if (e?.target === e?.currentTarget)
                document?.getElementById(`checkbox-${index}`)?.click();
            }}
          >
            {selectedIntegration?.includes(index) && (
              <span className="absolute border-2 border-green rounded-2xl -right-3 text-green font-bold -bottom-2 z-30 w-6 h-6 flex justify-center items-center">
                ✓
              </span>
            )}

            <Input
              id={`checkbox-${index}`}
              type="checkbox"
              value={index}
              checked={selectedIntegration.includes(index)}
              onChange={handleIntegrationChange}
              className="hidden"
            />

            <div className="flex gap-3">
              <label
                htmlFor={`checkbox-${index}`}
                className={`card-label ${selectedIntegration.includes(index) && "text-white"}`}
                onClick={(e) => {
                  e?.stopPropagation();
                  document?.getElementById(`checkbox-${index}`)?.click();
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e?.key === "Enter" || e?.key === " ") {
                    document?.getElementById(`checkbox-${index}`)?.click();
                  }
                }}
              >
                {integration.integrationName}
              </label>

              <ModalHelper
                dark={false}
                title={integration.integrationName}
                body={integration.bodyDescription}
                images={integration.imagesExemple ?? ""}
                titleImages={integration.titleImages ?? ""}
              />
            </div>

            {selectedIntegration.includes(index) && (
              <RatioSelector
                index={index}
                predefinedRatios={predefinedRatios}
                imageRatios={imageRatios}
                customRatioInputShown={customRatioInputShown}
                customImageRatio={customImageRatio}
                validRatio={validRatio}
                handleCustomRatioChange={handleCustomRatioChange}
                handleCustomRatioInput={handleCustomRatioInput}
              />
            )}
          </button>
        </div>
      ))}
    </div>
  </div>
);

const RatioSelector = ({
  index,
  predefinedRatios,
  imageRatios,
  customRatioInputShown,
  customImageRatio,
  validRatio,
  handleCustomRatioChange,
  handleCustomRatioInput
}) => (
  <div className="flex flex-col items-center mt-4">
    <div className="flex gap-2 items-center mb-2">
      <label htmlFor={`imageRatioSelect-${index}`} className="font-display text-sm text-white">
        Select Image Ratio <span className="text-red">*</span>
      </label>
      <ModalHelper
        title="Image ratio"
        body="Specify the ratio of the image you expect from the sponsor."
        size="small"
      />
    </div>
    <select
      id={`imageRatioSelect-${index}`}
      onClick={(e) => e.stopPropagation()}
      value={predefinedRatios.includes(imageRatios[index]) ? imageRatios[index] : "custom"}
      onChange={(e) => handleCustomRatioChange(index, e)}
      className="select-style text-jacarta-900"
    >
      {predefinedRatios.map((ratio) => (
        <option key={ratio} value={ratio}>
          {ratio}
        </option>
      ))}
      <option value="custom">Custom...</option>
    </select>
    {customRatioInputShown[index] && (
      <div className="relative">
        <Input
          type="text"
          value={customImageRatio[index]}
          onChange={(e) => handleCustomRatioInput(index, e)}
          onClick={(e) => e.stopPropagation()}
          placeholder="e.g., 16:10"
          className={`mt-2 w-full rounded-lg py-3 px-3 ${validRatio[index] ? "border-green border-2" : "border-red"}`}
        />
        {validRatio[index] && (
          <span className="absolute right-3 text-green font-bold top-5">✓</span>
        )}
      </div>
    )}
  </div>
);

const AdSpaceNumberSelector = ({ selectedNumber, handleNumberChange }) => (
  <div className="mb-6 flex flex-col items-center">
    <label className="font-display text-jacarta-900 mb-2 block dark:text-white">
      Number of ads to display for this offer <span className="text-red">*</span>
    </label>
    <p className="dark:text-jacarta-100 text-2xs mb-3">
      Warning: DSponsor works with a fixed quantity of ads per location...
    </p>
    <div className="flex gap-4 justify-center items-center w-full text-jacarta-900 dark:text-white">
      <div className="flex gap-2 items-center justify-center">
        <label htmlFor="numberSelect">Select a number</label>
        <ModalHelper
          title="Number of ad spaces"
          body="Specify the number of items you want to sell..."
        />
      </div>
      <select
        id="numberSelect"
        value={selectedNumber}
        onChange={handleNumberChange}
        className="bg-jacarta-800 border-jacarta-100 rounded-lg py-3 px-15"
      >
        {[...Array(25)].map((_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const OfferType = ({
  setDisplayedParameter,
  selectedNumber,
  setSelectedNumber,
  selectedIntegration,
  imageRatios,
  setImageRatios,
  setSelectedIntegration,
  setSelectedParameter,
  numSteps,
  currentSlide
}) => {
  const [customRatioInputShown, setCustomRatioInputShown] = useState({});
  const [validRatio, setValidRatio] = useState({});
  const [customImageRatio, setCustomImageRatio] = useState({});

  const AdIntegrationData = [
    {
      integrationName: "Image Ad Space",
      imagesExemple: [
        "/images/examples/offer_exemple_0.png",
        "/images/examples/offer_exemple_1.png"
      ],
      titleImages: ["Clickable logos Grid", "Dynamic Banner"],
      bodyDescription: "Available ad integrations: You are free to integrate ads as you like."
    }
  ];

  const predefinedRatios = ["1:1", "16:9", "4:3"];

  const handleNumberChange = useCallback(
    (e) => {
      setSelectedNumber(parseInt(e.target.value, 10));
    },
    [setSelectedNumber]
  );

  const handleAddParameter = useCallback(
    (value) => {
      const initialRatio = imageRatios[value] || "";
      let paramsToAdd: string[] = [];

      if (value === 0) {
        paramsToAdd = [`imageURL${initialRatio ? `-${initialRatio}` : ""}`, "linkURL"];
        setDisplayedParameter((prev) => [...prev, "ClickableLogosGrid"]);
      } else if (value === 1) {
        paramsToAdd = [`imageURL${initialRatio ? `-${initialRatio}` : ""}`, "linkURL"];
        setDisplayedParameter((prev) => [...prev, "DynamicBanner"]);
      }
      setSelectedParameter((prev) => [...prev, ...paramsToAdd]);
    },
    [imageRatios, setDisplayedParameter, setSelectedParameter]
  );

  const handleRemoveParameter = useCallback(
    (value) => {
      let paramsToRemove = [`imageURL-${value}`, `linkURL-${value}`];

      setDisplayedParameter((prev) =>
        prev.filter((item) => item !== (value === 0 ? "ClickableLogosGrid" : "DynamicBanner"))
      );
      setSelectedParameter((prev) => prev.filter((param) => !paramsToRemove.includes(param)));
    },
    [setDisplayedParameter, setSelectedParameter]
  );

  const handleIntegrationChange = useCallback(
    (e) => {
      const { value, checked } = e.target;
      const intValue = parseInt(value);

      if (checked) {
        setSelectedIntegration([intValue]);
        setImageRatios((prev) => ({
          ...prev,
          [intValue]: prev[intValue] || "1:1"
        }));
        handleAddParameter(intValue);
      } else {
        setSelectedIntegration((prev) => prev.filter((item) => item !== intValue));
        handleRemoveParameter(intValue);
      }
    },
    [setSelectedIntegration, setImageRatios, handleAddParameter, handleRemoveParameter]
  );

  const updateParameterWithRatio = useCallback(
    (index, ratio) => {
      setSelectedParameter((prev) =>
        prev.map((param) => (param.startsWith(`imageURL`) ? `imageURL-${ratio}` : param))
      );
    },
    [setSelectedParameter]
  );

  const handleCustomRatioChange = useCallback(
    (index, e) => {
      const { value } = e.target;

      setImageRatios((prev) => ({ ...prev, [index]: value }));

      if (value === "custom") {
        setCustomImageRatio((prev) => ({ ...prev, [index]: "" }));
        setCustomRatioInputShown((prev) => ({ ...prev, [index]: true }));
        setValidRatio((prev) => ({ ...prev, [index]: false }));
      } else {
        setCustomRatioInputShown((prev) => ({ ...prev, [index]: false }));
        if (/^\d+:\d+$/.test(value)) {
          updateParameterWithRatio(index, value);
          setValidRatio((prev) => ({ ...prev, [index]: true }));
        } else {
          setValidRatio((prev) => ({ ...prev, [index]: false }));
        }
      }
    },
    [
      setImageRatios,
      setCustomImageRatio,
      setCustomRatioInputShown,
      setValidRatio,
      updateParameterWithRatio
    ]
  );

  const handleCustomRatioInput = useCallback(
    (index, e) => {
      const { value } = e.target;

      setCustomImageRatio((prev) => ({ ...prev, [index]: value }));
      if (/^\d+:\d+$/.test(value)) {
        setImageRatios((prev) => ({ ...prev, [index]: value }));
        updateParameterWithRatio(index, value);
        setValidRatio((prev) => ({ ...prev, [index]: true }));
      } else {
        setImageRatios((prev) => ({ ...prev, [index]: "custom" }));
        setValidRatio((prev) => ({ ...prev, [index]: false }));
      }
    },
    [setCustomImageRatio, setImageRatios, setValidRatio, updateParameterWithRatio]
  );

  return (
    currentSlide === 0 && (
      <div className="flex flex-col gap-10">
        <div className="absolute top-0 right-0">
          {currentSlide + 1}/{numSteps}
        </div>
        <div className="flex flex-col w-full items-center border-b-1 border-primaryPurple shadow-2xl pb-2">
          <h3 className="mb-2 text-jacarta-100 font-semibold bg-primaryPurple rounded-md px-4 py-2">
            OFFER TYPE & AVAILABILITY
          </h3>
          <p className="dark:text-white text-center">
            Choose the type of ad space suitable for your media and the number of spaces available
            for purchase.
          </p>
        </div>
        <AdSpaceSelector
          AdIntegrationData={AdIntegrationData}
          selectedIntegration={selectedIntegration}
          handleIntegrationChange={handleIntegrationChange}
          imageRatios={imageRatios}
          handleCustomRatioChange={handleCustomRatioChange}
          handleCustomRatioInput={handleCustomRatioInput}
          customRatioInputShown={customRatioInputShown}
          customImageRatio={customImageRatio}
          validRatio={validRatio}
          predefinedRatios={predefinedRatios}
        />
        <AdSpaceNumberSelector
          selectedNumber={selectedNumber}
          handleNumberChange={handleNumberChange}
        />
      </div>
    )
  );
};

export default OfferType;
