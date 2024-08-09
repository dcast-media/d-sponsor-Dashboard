import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import React, { useEffect, useState } from "react";

const OfferName = ({
  stepsRef,
  styles,
  setName,
  name,
  description,
  setDescription,
  numSteps,
  currentSlide
}) => {
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const isSlideActive = currentSlide === 1;

  if (!isSlideActive) return null;

  return (
    <div
      ref={(el) => {
        stepsRef.current[1] = el;
      }}
      className={styles.form__step}
    >
      <div className="relative flex flex-col items-center gap-8 pr-6 pl-2">
        <div className="absolute top-0 right-0">
          {currentSlide + 1}/{numSteps}
        </div>

        <div className="flex flex-col items-center w-full border-b-1 border-primaryPurple shadow-2xl pb-2">
          <Header />
        </div>

        <div className="w-full">
          <Title name={name} handleNameChange={handleNameChange} />
        </div>

        <div className="mb-6 w-full">
          <Description
            description={description}
            handleDescriptionChange={handleDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <React.Fragment>
      <h3 className="px-4 py-2 mb-2 text-jacarta-100 bg-primaryPurple rounded-md">
        Name & Description
      </h3>
      <p className="pt-2 text-center dark:text-white">
        Provide offer&apos;s name and a brief description.
      </p>
    </React.Fragment>
  );
};

const Title = ({ name, handleNameChange }) => {
  return (
    <React.Fragment>
      <label
        htmlFor="item-name"
        className="block mb-2 font-display text-center text-jacarta-900 dark:text-white"
      >
        Title<span className="text-red">*</span>
      </label>
      <Input
        type="text"
        id="item-name"
        placeholder="Provide a title for your offer."
        value={name}
        onChange={handleNameChange}
        required
      />
    </React.Fragment>
  );
};

const Description = ({ description, handleDescriptionChange }) => {
  const [charCount, setCharCount] = useState(description.length);

  useEffect(() => {
    setCharCount(description.length);
  }, [description]);

  const remainingChars = 2000 - charCount;

  return (
    <React.Fragment>
      <label
        htmlFor="item-description"
        className="block mb-2 font-display text-center text-jacarta-900 dark:text-white"
      >
        Description<span className="text-red">*</span>
      </label>
      <p className="mb-3 text-center text-2xs text-jacarta-100 dark:text-jacarta-100">
        The description should briefly introduce your media, specify the location of the ad space,
        and describe the type of content expected.
      </p>
      <TextArea
        id="item-description"
        value={description}
        onChange={handleDescriptionChange}
        rows={4}
        maxLength={2000}
        placeholder="This is a description of the offer. characters limit : 2000"
        required
        className="placeholder:text-jacarta-300"
      />
      <p className={`mt-1 text-2xs ${remainingChars > 0 ? "text-green" : "text-red"}`}>
        {remainingChars} characters remaining
      </p>
    </React.Fragment>
  );
};

export default OfferName;
