import Input from "@/components/ui/Input";

const AdURL = ({ stepsRef, styles, setLink, link, currentSlide, numSteps }) => {
  const handleChange = (e) => {
    let value = e.target.value;
    setLink(value);
  };
  return (
    <div
      ref={(el) => {
        stepsRef.current[1] = el;
      }}
      className={styles.form__step}
    >
      <div className="pr-6 pl-2">
        <h3 className="mb-12 text-jacarta-200">
          Step {currentSlide + 1}/{numSteps} : Ad URL
        </h3>
        {/* <!-- Link --> */}
        <div className="mb-6">
          <label
            htmlFor="item-external-link"
            className="font-display text-jacarta-900 mb-2 block dark:text-white"
          >
            External link<span className="text-red">*</span>
          </label>
          <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mb-3">
            Enter the URL to which users will be redirected upon clicking on the ad image. This link
            should lead to a page that expands on the content or service represented by the image.
            Make sure the URL is correct and leads to a safe, relevant webpage.
          </p>
          <Input
            type="url"
            id="item-external-link"
            placeholder="https://yoursite.com"
            onChange={handleChange}
            value={link}
          />
        </div>
      </div>
    </div>
  );
};

export default AdURL;
