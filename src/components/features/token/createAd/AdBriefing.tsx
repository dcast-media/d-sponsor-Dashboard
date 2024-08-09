import React, { useState, useEffect } from "react";

const AdBriefing = ({
  stepsRef,
  styles,
  adParameters,
  setImageUrlVariants,
  currentSlide,
  numSteps
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    if (!adParameters) return;
    setSelectedItems(adParameters);
    const imageVariants = adParameters
      .filter((id) => id.startsWith("imageURL"))
      .map((id) => id.slice("imageURL-".length));

    setImageUrlVariants((prev) => [...prev, ...imageVariants]);
  }, [adParameters, setImageUrlVariants]);

  return (
    <div
      ref={(el) => {
        stepsRef.current[0] = el;
      }}
      className={styles.form__step}
    >
      <div className="pr-6 pl-2">
        <h3 className="mb-12 !text-jacarta-100">
          Step {currentSlide + 1}/{numSteps} : Ad Description
        </h3>
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex flex-col gap-4">
              To display your ad you need to provide the following parameters:
              {/* <DisplayImageIds ids={selectedItems} /> */}
              <div>
                <p className="font-display">Image :</p>
                {selectedItems
                  .filter((id: string) => id.startsWith("imageURL"))
                  .map((id: string) => {
                    const variant = id.slice("imageURL-".length);

                    return (
                      <div key={id}>
                        <ul>
                          <li>
                            {variant
                              ? `- Format : ${variant} (example:
                              ${(() => {
                                const [width, height] = variant.split(":");
                                return width && height
                                  ? `${parseFloat(width) * 100}x${parseFloat(height) * 100}px`
                                  : "No size";
                              })()})`
                              : "- Format : Any URL accepted"}
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                <p className="font-display">Link :</p>
                {selectedItems
                  .filter((id) => id.startsWith("linkURL"))
                  .map((id) => {
                    const variant = id.slice("linkURL-".length);
                    return (
                      <div key={id}>
                        <ul>
                          <li>{variant ? `- ${variant}` : "- Any URL accepted"}</li>
                        </ul>
                      </div>
                    );
                  })}
              </div>
              {/* <select
                id="adIntegrationSelect"
                className="dark:bg-secondaryBlack min-w-[110px] border-jacarta-100 hover:ring-primaryPurple/10 focus:ring-primaryPurple dark:border-jacarta-800 dark:placeholder:text-jacarta-100 w-full rounded-lg py-3 px-5 hover:ring-2 dark:text-white"
                value={selectedIntegration}
                onChange={handleSelectionChange}
              >
                <option value="">Select an Integration</option>
                {adParameters.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBriefing;
