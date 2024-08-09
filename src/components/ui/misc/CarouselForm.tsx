import React from "react";

const CarouselForm = ({
  handlePreviewModal,
  numSteps,
  children,
  currentSlide,
  setCurrentSlide
}) => {
  const handleNextClick = () => {
    if (currentSlide < numSteps - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleBulletClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="mx-4">
      <div className="flex flex-col items-center border border-primaryBlack shadow bg-secondaryBlack max-w-2xl mx-auto rounded-2lg p-4">
        <form className="flex flex-col items-center gap-4 relative w-full">
          <div className="w-full mb-12">
            {/* Steps */}
            {children}
            {/*End Steps */}
          </div>
          <div className="absolute bottom-0 flex items-center w-full justify-between gap-2">
            <button
              type="button"
              onClick={handlePrevClick}
              className={`text-white w-32 bg-primaryPurple hover:bg-opacity-80 px-3 py-1 rounded-lg ${currentSlide === 0 ? "disabled opacity-25" : ""}`}
            >
              Back
            </button>

            <div className="flex items-center justify-center">
              {Array.from({ length: numSteps }).map((_, index) => (
                <button
                  key={`bullet-${index}`}
                  onClick={() => handleBulletClick(index)}
                  tabIndex={0}
                  className={`${
                    currentSlide === index ? "bg-primaryPurple" : "bg-primaryBlack"
                  } w-3 h-3 rounded-full mx-1 cursor-pointer`}
                />
              ))}
            </div>

            {currentSlide === numSteps - 1 ? (
              <button
                type="button"
                className="text-white w-32 bg-primaryPurple hover:bg-opacity-80 px-3 py-1 rounded-lg"
                onClick={handlePreviewModal}
              >
                Show preview
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextClick}
                className={`text-white w-32 bg-primaryPurple hover:bg-opacity-80 px-3 py-1 rounded-lg ${currentSlide === numSteps - 1 ? "disabled" : ""}`}
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarouselForm;
