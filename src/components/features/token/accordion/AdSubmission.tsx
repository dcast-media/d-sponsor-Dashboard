import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { shortenAddress, Web3Button } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "@nextui-org/spinner";
import ModalHelper from "@/components/ui/modals/Helper";
import { useChainContext } from "@/hooks/useChainContext";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import ResponsiveTooltip from "@/components/ui/ResponsiveTooltip";
import TextArea from "@/components/ui/TextArea";

const AdSubmission = ({
  approvalForAllToken = true,
  handleApprove,
  isListing = false,
  helperFeesListing,
  selectedStartingPrice,
  handlePreviewModal,
  protocolFees,
  handleSubmit,
  imageUrlVariants = [],
  name,
  link,
  description,
  startDate,
  endDate,
  selectedNumber,
  selectedUnitPrice,
  symbolContract,
  selectedParameter,
  selectedCurrency,
  selectedRoyalties,
  previewImage,
  displayedParameter,
  terms = [],
  imageURLSteps = [],
  validate,
  errors,
  successFullUpload,
  buttonTitle,
  modalTitle,
  successFullUploadModal,
  address,
  adSubmission,
  isLoadingButton,
  multipleAdsSubmission
}: {
  approvalForAllToken?: boolean;
  handleApprove?: any;
  isListing?: boolean;
  helperFeesListing?: any;
  selectedStartingPrice?: number;
  handlePreviewModal: () => void;
  protocolFees?: number;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: any;
  imageUrlVariants?: string[];
  name: string | boolean;
  link: string | boolean;
  description: boolean | string;
  startDate?: Date;
  endDate?: Date;
  selectedNumber?: number;
  selectedUnitPrice?: number;
  symbolContract?: string;
  selectedParameter?: string[];
  selectedCurrency?: string;
  selectedRoyalties?: number;
  previewImage?: string[];
  displayedParameter?: string[];
  terms?: any;
  imageURLSteps?: any;
  validate: any;
  errors: any;
  successFullUpload: boolean;
  buttonTitle?: string;
  modalTitle?: string;
  successFullUploadModal: any;
  address?: string;
  adSubmission?: boolean;
  isLoadingButton: boolean;
  multipleAdsSubmission?: boolean;
}) => {
  const [imageRatios, setImageRatios] = React.useState<any[]>([]);
  const [isLoadingApproveButton, setIsLoadingApproveButton] = React.useState<boolean>(false);
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] = React.useState<boolean>(false);

  const { currentChainObject } = useChainContext();
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const imageRatioDisplay = React.useCallback(
    (id) => {
      if (!imageUrlVariants[id]) return [];

      const ratios = imageUrlVariants[id].split(":");
      const stepWidth = 250;
      let width = Number(ratios[0]);
      let height = Number(ratios[1]);
      const ratioArray: number[] = [];
      if (ratios.length !== 2) {
        ratioArray.push(stepWidth);
        ratioArray.push(stepWidth);
      }
      if (width / height > 1) {
        ratioArray.push(stepWidth);
        ratioArray.push(stepWidth * (height / width));
      } else {
        ratioArray.push(stepWidth * (width / height));
        ratioArray.push(stepWidth);
      }

      return ratioArray;
    },
    [imageUrlVariants]
  );

  useEffect(() => {
    if (imageUrlVariants.length > 0) {
      let imageRatios: string[][] = [];

      imageUrlVariants?.forEach((image: any, index: number) => {
        if (index < (previewImage?.length as number)) {
          const preSplit = image.split("-");

          const imageRatio =
            preSplit.length === 2 ? preSplit[1].split(":") : preSplit[0].split(":");

          if (imageRatio.length === 2) {
            imageRatios.push(imageRatio);
          } else {
            imageRatios.push([imageRatio[0], imageRatio[0]]);
          }
        }
      });

      setImageRatios(imageRatios);
    }
  }, [imageRatioDisplay, imageUrlVariants, previewImage]);

  if (adSubmission && !successFullUpload) {
    return (
      <div className="modal-dialog max-h-[75vh] max-w-2xl">
        <div className="modal-content !bg-secondaryBlack">
          <div className="modal-header">
            <div className="flex items-center justify-between w-full space-x-4">
              <h5 className="modal-title" id="placeBidLabel">
                Preview your ad submission
              </h5>
              <button
                type="button"
                className="btn-close-preview"
                onClick={() => handlePreviewModal()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="modal-body p-6 flex gap-4">
            <div className="flex flex-wrap gap-4 md:flex-row flex-col w-full">
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="block dark:text-jacarta-100">Link </span>
                <span className="dark:text-white font-semibold text-white">
                  {link ?? "No link provided"}
                </span>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="block dark:text-jacarta-100">
                    Image ({imageRatios[0] ? `${imageRatios[0][0]}:${imageRatios[0][1]}` : "N/A"})
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center gap-2 border border-dashed bg-jacarta-100 bg-opacity-10">
                  <Image
                    src={previewImage?.[0] as string}
                    width={1600}
                    height={380}
                    className="w-full h-auto"
                    alt="Preview image"
                    style={{
                      objectFit: "contain",
                      objectPosition: "center",
                      aspectRatio:
                        imageRatios?.length > 0
                          ? `${imageRatios[0] ? imageRatios[0][0] : 1}/${imageRatios[0] ? imageRatios[0][1] : 1}`
                          : "1/1"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* submit ad button */}
          <div className="modal-footer">
            <div className="flex items-center justify-center space-x-4">
              <Web3Button
                contractAddress={
                  currentChainObject?.smartContracts?.DSPONSORADMIN?.address as string
                }
                action={async () => {
                  setIsLoadingSubmitButton(true);

                  await toast
                    .promise(handleSubmit(true), {
                      pending: "Waiting for confirmation 🕒",
                      success: "Transaction confirmed 👌",
                      error: "Transaction rejected 🤯"
                    })
                    .finally(() => {
                      setIsLoadingSubmitButton(false);
                    });
                }}
                className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!validate || isLoadingSubmitButton ? "!btn-disabled !cursor-not-allowed !text-black" : "!bg-primaryPurple hover:!bg-opacity-80 !cursor-pointer"} `}
                isDisabled={!validate || isLoadingSubmitButton}
              >
                {isLoadingSubmitButton ? <Spinner size="sm" color="default" /> : buttonTitle}
              </Web3Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (multipleAdsSubmission && !successFullUpload) {
    return (
      <div className="modal-dialog max-h-[75vh] max-w-2xl">
        <div className="modal-content !bg-secondaryBlack">
          <div className="modal-header">
            <div className="flex items-center justify-between w-full space-x-4">
              <h5 className="modal-title" id="placeBidLabel">
                Preview your multiple tokens ad submission
              </h5>
              <button
                type="button"
                className="btn-close-preview"
                onClick={() => handlePreviewModal()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="modal-body p-6 flex gap-4">
            <div className="flex flex-wrap gap-4 md:flex-row flex-col w-full">
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="block dark:text-jacarta-100">Link </span>
                <span className="dark:text-white font-semibold text-white">
                  {link ?? "No link provided"}
                </span>
              </div>

              {previewImage?.map((image: any, index: number) => (
                <div className="flex flex-col gap-2 w-full" key={index}>
                  <div className="flex items-center gap-2">
                    <span className="block dark:text-jacarta-100">
                      Image {index + 1} - (
                      {imageRatios[index]
                        ? `${imageRatios[index][0]}:${imageRatios[index][1]}`
                        : "N/A"}
                      )
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-2">
                    <Image
                      src={image}
                      width={1600}
                      height={380}
                      className="w-full h-auto bg-jacarta-200"
                      alt="Preview image"
                      style={{
                        objectFit: "contain",
                        objectPosition: "center",
                        aspectRatio:
                          imageRatios?.length > 0
                            ? `${imageRatios[index] ? imageRatios[index][0] : 1}/${imageRatios[index] ? imageRatios[index][1] : 1}`
                            : "1/1"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* submit ad button */}
          <div className="modal-footer">
            <div className="flex items-center justify-center space-x-4">
              <Web3Button
                contractAddress={
                  currentChainObject?.smartContracts?.DSPONSORADMIN?.address as string
                }
                action={async () => {
                  await toast.promise(handleSubmit(true), {
                    pending: "Waiting for confirmation 🕒",
                    success: "Transaction confirmed 👌",
                    error: "Transaction rejected 🤯"
                  });
                }}
                className={` !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!validate ? "!btn-disabled !cursor-not-allowed !text-black" : "!bg-primaryPurple hover:!bg-opacity-80 !cursor-pointer"} `}
                isDisabled={!validate || isLoadingButton}
              >
                {isLoadingButton ? <Spinner size="sm" color="default" /> : buttonTitle}
              </Web3Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="modal-dialog max-h-[75vh] max-w-2xl">
        <div className="modal-content !bg-secondaryBlack md:min-w-[550px]">
          <div className="modal-header">
            <h5 className="modal-title mr-8" id="placeBidLabel">
              {!successFullUpload ? modalTitle : successFullUploadModal.title}
            </h5>
            <button type="button" className="btn-close" onClick={() => handlePreviewModal()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="fill-jacarta-700 h-6 w-6 dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
              </svg>
            </button>
          </div>

          <div className="modal-body p-6 flex gap-4 items-center">
            {!successFullUpload ? (
              <div className="flex text-left flex-wrap gap-8 md:flex-row flex-col">
                <div>
                  <p className="font-display mb-2 block dark:text-white">
                    {(name as string)?.length > 0 ? (
                      <span className="dark:text-jacarta-100 text-jacarta-100 text-sm">
                        Name : <span className="dark:text-white text-base ml-2"> {name} </span>
                      </span>
                    ) : !name ? (
                      <span className="dark:text-jacarta-100 text-jacarta-100 font-display text-sm">
                        Name : <span className="text-red text-base ml-2">{errors.nameError}</span>
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                  <p className="font-display mb-2 block text-sm dark:text-white">
                    {(description as string)?.length > 0 ? (
                      <span className="dark:text-jacarta-100 text-jacarta-100 text-sm flex  items-center">
                        Description : <TextArea readOnly value={description as string} />
                      </span>
                    ) : !description ? (
                      <span className="dark:text-jacarta-100 text-jacarta-100 font-display">
                        Description :{" "}
                        <span className="text-red text-base ml-2">{errors.descriptionError}</span>
                      </span>
                    ) : (
                      ""
                    )}
                  </p>

                  {(link as string)?.length ? (
                    <div className="font-display  mb-2  text-jacarta-100 text-sm flex justify-between ">
                      <span className="mr-2 text-sm">Link : </span>{" "}
                      {!errors?.linkError ? (
                        <span className="dark:text-white text-base ml-2"> {link} </span>
                      ) : (
                        <span className="text-red text-base ml-2"> {errors.linkError}</span>
                      )}
                    </div>
                  ) : !link ? (
                    <div className="dark:text-jacarta-100 text-jacarta-100 font-display flex gap-2">
                      <span className="text-sm"> Link :</span>
                      <span className="text-red text-base ml-2">{errors.linkError}</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {imageURLSteps?.length > 0 &&
                    (previewImage?.filter((item: any) => item)?.length as number) <
                      imageURLSteps?.length && (
                      <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                        Image preview :{" "}
                        <span className="text-red text-base ml-2"> {errors.imageError}</span>
                      </p>
                    )}
                  <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                    {startDate ? (
                      <span>
                        Start Date :{" "}
                        {!errors.startDateError ? (
                          <span className="dark:text-white text-base ml-2">
                            {" "}
                            {formatDate(startDate)}{" "}
                          </span>
                        ) : (
                          <span className="text-red text-base ml-2">{errors.startDateError}</span>
                        )}
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                  {endDate ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      End Date :{" "}
                      {!errors.endDateError ? (
                        <span className="dark:text-white text-base ml-2">
                          {" "}
                          {formatDate(endDate)}{" "}
                        </span>
                      ) : (
                        <span className="text-red text-base ml-2">{errors.endDateError}</span>
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                  {selectedNumber ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Number of Items :{" "}
                      {!errors.numberError ? (
                        <span className="dark:text-white text-base ml-2"> {selectedNumber} </span>
                      ) : (
                        <span className="text-red text-base ml-2">{errors.numberError}</span>
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                  {selectedParameter ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Type of Ad :{" "}
                      {!errors.typeAdError && !errors.imageRatioError ? (
                        displayedParameter?.map((item, index) => (
                          <span key={index} className="dark:text-white text-base ml-2">
                            {" "}
                            {item}{" "}
                          </span>
                        ))
                      ) : (
                        <div>
                          {errors.typeAdError && (
                            <span className="text-red text-base ml-2">{errors.typeAdError}</span>
                          )}
                          {errors.imageRatioError && (
                            <span className="text-red text-base ml-2">
                              {errors.imageRatioError}
                            </span>
                          )}
                        </div>
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                  {selectedStartingPrice || errors.startingPriceError ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Bid starting price :{" "}
                      {!errors.startingPriceError ? (
                        <span className="dark:text-white text-base ml-2">
                          {" "}
                          {selectedStartingPrice}{" "}
                        </span>
                      ) : (
                        <span className="text-red text-base ml-2">{errors.startingPriceError}</span>
                      )}
                      {helperFeesListing && <ModalHelper {...helperFeesListing} />}
                    </p>
                  ) : (
                    ""
                  )}
                  {selectedUnitPrice || errors.unitPriceError ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Buy Price :{" "}
                      {!errors.unitPriceError ? (
                        <span className="dark:text-white text-base ml-2">
                          {" "}
                          {selectedUnitPrice}{" "}
                        </span>
                      ) : (
                        <span className="text-red text-base ml-2">{errors.unitPriceError}</span>
                      )}
                      {helperFeesListing && <ModalHelper {...helperFeesListing} />}
                    </p>
                  ) : (
                    ""
                  )}
                  {symbolContract || selectedCurrency ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Currency :{" "}
                      {!errors.currencyError ? (
                        <span className="dark:text-white text-base ml-2">
                          {" "}
                          {symbolContract ?? selectedCurrency}{" "}
                        </span>
                      ) : (
                        <span className="text-red text-base ml-2">{errors.currencyError}</span>
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                  {selectedRoyalties ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Royalties :{" "}
                      {!errors.royaltyError ? (
                        <span className="dark:text-white text-base ml-2">
                          {" "}
                          {selectedRoyalties} %{" "}
                        </span>
                      ) : (
                        <span className="text-red text-base ml-2">{errors.royaltyError}</span>
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                  {address ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Address :{" "}
                      <span className="dark:text-white text-base ml-2">
                        {" "}
                        {shortenAddress(address)}{" "}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}
                  {protocolFees ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Protocol fees :{" "}
                      <span className="dark:text-white text-base ml-2"> {protocolFees} % </span>
                    </p>
                  ) : (
                    ""
                  )}
                  {terms.length > 0 ? (
                    <p className="font-display  mb-2 block text-jacarta-100 text-sm">
                      Terms :{" "}
                      <span className="dark:text-white text-base ml-2">
                        {" "}
                        {terms[0].name ? terms[0].name : terms[0]}{" "}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                {previewImage?.map((image: any, index: number) => (
                  <div className="mb-6 flex-col items-center justify-center" key={index}>
                    <label
                      htmlFor="item-description"
                      className="font-display text-jacarta-100 text-sm text-center mb-2 block "
                    >
                      Image {imageUrlVariants[index] && `( ratio ${imageUrlVariants[index]} )`}{" "}
                      preview
                    </label>
                    <div
                      className="dark:bg-secondaryBlack dark:border-jacarta-800 border-jacarta-100  group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed"
                      style={{
                        width:
                          imageUrlVariants.length > 0
                            ? `${imageRatioDisplay(index)[0]}px`
                            : "275px",
                        height:
                          imageUrlVariants.length > 0
                            ? `${imageRatioDisplay(index)[1]}px`
                            : "275px",
                        position: "relative"
                      }}
                    >
                      <Image
                        src={image ?? ""}
                        fill={true}
                        alt="Preview"
                        className="object-contain h-full p-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <p>{successFullUploadModal.body} </p>
                  <div
                    className="dark:border-jacarta-800 bg-green   flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                    data-tippy-content="Verified Collection"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="h-[.875rem] w-[.875rem] fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                  </div>
                </div>
                {successFullUploadModal.subBody && <p>{successFullUploadModal.subBody} </p>}
              </div>
            )}
          </div>

          <div className="modal-footer w-full">
            <div className="flex items-center justify-center space-x-4 w-full">
              <div className="flex items-center gap-4 w-full">
                {!successFullUpload ? (
                  <div className="flex flex-col gap-2 justify-center items-center w-full">
                    <div className="grid grid-cols-1 w-full mx-auto md:grid-cols-2 gap-6">
                      <Web3Button
                        contractAddress={
                          currentChainObject?.smartContracts?.DSPONSORMP?.address ?? "no address"
                        }
                        action={async () => {
                          setIsLoadingApproveButton(true);

                          await toast
                            .promise(handleApprove, {
                              pending: "Waiting for confirmation 🕒",
                              success: "Approval confirmed 👌",
                              error: "Approval rejected 🤯"
                            })
                            .finally(() => {
                              setIsLoadingApproveButton(false);
                            });
                        }}
                        className={`!rounded-full !w-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!validate || isLoadingApproveButton || approvalForAllToken ? "!btn-disabled !cursor-not-allowed !text-black opacity-30" : "!bg-primaryPurple hover:!bg-opacity-80 !cursor-pointer"} `}
                        isDisabled={!validate || isLoadingApproveButton || approvalForAllToken}
                      >
                        {isLoadingApproveButton ? (
                          <Spinner size="sm" color="default" />
                        ) : !isListing ? (
                          "Approve 🔓 (1/2)"
                        ) : (
                          "Authorize 🔓 (1/2)"
                        )}
                      </Web3Button>

                      <Web3Button
                        contractAddress={
                          currentChainObject?.smartContracts?.DSPONSORADMIN?.address ?? "no address"
                        }
                        action={async () => {
                          setIsLoadingSubmitButton(true);

                          await toast
                            .promise(handleSubmit(address), {
                              pending: "Waiting for confirmation 🕒",
                              success: "Transaction confirmed 👌",
                              error: "Transaction rejected 🤯"
                            })
                            .finally(() => {
                              setIsLoadingSubmitButton(false);
                            });
                        }}
                        className={`!w-full !rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all ${!validate || isLoadingSubmitButton || !approvalForAllToken ? "!btn-disabled !cursor-not-allowed !text-black" : "!bg-primaryPurple hover:!bg-opacity-80 !cursor-pointer"} `}
                        isDisabled={!validate || isLoadingSubmitButton || !approvalForAllToken}
                      >
                        {isLoadingSubmitButton ? (
                          <Spinner size="sm" color="default" />
                        ) : (
                          buttonTitle
                        )}
                      </Web3Button>
                    </div>

                    <ResponsiveTooltip
                      text={`You need to approve the marketplace contract to spend your NFT on this
      transaction.`}
                    >
                      <span className="text-xs text-jacarta-100 inline-flex items-center gap-1">
                        <InformationCircleIcon className="w-4 h-4 text-jacarta-100" />
                        Why do I have to approve ?
                      </span>
                    </ResponsiveTooltip>
                  </div>
                ) : successFullUploadModal.hrefButton !== null ? (
                  <Link href={successFullUploadModal.hrefButton ?? "#"}>
                    <button className="!rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-primaryPurple hover:!bg-opacity-80 !cursor-pointer">
                      {successFullUploadModal.buttonTitle}
                    </button>
                  </Link>
                ) : (
                  <button
                    className="!rounded-full !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-primaryPurple hover:!bg-opacity-80 !cursor-pointer"
                    onClick={() => handlePreviewModal()}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSubmission;
