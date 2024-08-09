import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import ModalHelper from "@/components/ui/modals/Helper";
import { FileUploader } from "react-drag-drop-files";

const AdImage = ({
  id,
  stepsRef,
  styles,
  file,
  handleLogoUpload,
  previewImage,
  currentStep,
  currentSlide,
  numSteps
}) => {
  const fileTypes = ["JPG", "PNG", "WEBP"];
  const modalHelper = {
    title: "Importance of Correct Image Aspect Ratio",
    body: "Ensuring images, especially logos, have the correct aspect ratio is crucial to prevent distortion when displayed. A distorted logo can undermine a brand’s professionalism and mislead potential clients. Maintaining the correct aspect ratio preserves the image's integrity across various platforms, supporting brand consistency and visual quality."
  };
  const containerElement = useRef(null);
  const [widthRatioImage, setWidthRatioImage] = useState<number | null>(null);
  const [heightRatioImage, setHeightRatioImage] = useState<number | null>(null);
  useEffect(() => {
    const stepWidth = 250;
    let tempId = id;
    if (id.includes("0-")) {
      tempId = id.slice(2);
    }
    const ratios = tempId.split(":");
    let width = Number(ratios[0]);
    let height = Number(ratios[1]);

    if (ratios.length !== 2) {
      width = 1;
      height = 1;
    }

    if (width / height > 1) {
      setWidthRatioImage(stepWidth);
      setHeightRatioImage(stepWidth * (height / width));
    } else {
      setHeightRatioImage(stepWidth);
      setWidthRatioImage(stepWidth * (width / height));
    }
  }, [id]);

  return (
    <div
      ref={(el) => {
        stepsRef.current[currentStep] = el;
      }}
      className={styles.form__step}
    >
      <div className="pr-6 pl-2" ref={containerElement}>
        <h3 className="mb-12 text-jacarta-200">
          Step {currentSlide + 1}/{numSteps} : Ad Image {id}
        </h3>
        {/* <!-- File Upload --> */}
        <div className="mb-6 items-center flex flex-col">
          <div className="flex gap-3 justify-center items-center mb-2">
            <label className="font-display text-jacarta-900  block dark:text-white">
              Image {id}
              <span className="text-red">*</span>
            </label>
            <ModalHelper title={modalHelper.title} body={modalHelper.body} dark={false} />
          </div>
          <p className="dark:text-jacarta-100 text-jacarta-100 text-2xs mb-3">
            Please upload a media format that visually represents the content to be displayed on the
            platform. This element will serve as a visual cue for users to quickly identify the
            associated content. Make sure the content is clear, relevant, and has a high enough
            resolution for good quality display. The visual will be approved by the Media before it
            is displayed on their platform.
          </p>

          {file ? (
            <p className="text-green text-2xs mb-3">successfully uploaded : {file.file.name}</p>
          ) : (
            <p className="dark:text-jacarta-100 text-2xs mb-3">
              Drag or choose your file to upload
            </p>
          )}

          <div
            className={`bg-jacarta-800 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-primaryPurple w-[${widthRatioImage}px] h-[${heightRatioImage}px] text-center ${
              !previewImage ? "px-2 py-8" : "py-1 px-1"
            }`}
            style={{ width: `${widthRatioImage}px`, height: `${heightRatioImage}px` }}
          >
            <div
              className={`relative z-10 cursor-pointer  ${!previewImage ? "px-2 py-2" : "px-0 h-full w-full"}`}
            >
              {!previewImage ? (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-500 mb-2 inline-block dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                  </svg>
                  <p className="dark:text-jacarta-100 mx-auto max-w-xs text-xs">
                    JPG, PNG, WEBP Max size: 25 MB
                  </p>
                </div>
              ) : (
                <div
                  className={`flex justify-center w-[${widthRatioImage}px] h-[${heightRatioImage}px] `}
                  style={{ width: `${widthRatioImage}px`, height: `${heightRatioImage}px` }}
                >
                  <Image
                    src={previewImage ?? ""}
                    fill={true}
                    alt="Preview"
                    className="object-contain h-full"
                  />
                </div>
              )}
            </div>
            <div className="dark:bg-jacarta-800 h-full w-full bg-jacarta-50 absolute cursor-pointer rounded opacity-0 group-hover:opacity-100">
              <FileUploader
                handleChange={handleLogoUpload}
                name="file"
                types={fileTypes}
                classes="file-drag"
                maxSize={25}
                minSize={0}
              />
            </div>
          </div>
          {file && (
            <p className="text-warning text-2xs mt-3">
              ⚠️ This is how your ad will be displayed on the media plateform. Be carefull to fill
              all the dotted square.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdImage;
