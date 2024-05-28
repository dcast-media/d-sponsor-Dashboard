import React, {  useState, useRef } from "react";
import { ownedAdProposals_categories_filter } from "../../data/categories_data";
import { useContract, useContractWrite, useStorageUpload } from "@thirdweb-dev/react";
import { trendingCategoryData } from "../../data/categories_data";
import styles from "../../styles/createPage/style.module.scss";
import OfferItem from "../cards/offerItem";
import Link from "next/link";
import Image from "next/image";
import SliderForm from "../sliderForm/sliderForm";
import Step_1_Mint from "../sliderForm/PageMint/Step_1_Mint";
import Step_2_Mint from "../sliderForm/PageMint/Step_2_Mint";
import Step_3_Mint from "../sliderForm/PageMint/Step_3_Mint";
 import contractABI from "../../abi/dsponsorAdmin.json";

import PreviewModal from "../modal/previewModal";
import {useChainContext} from "../../contexts/hooks/useChainContext";

const OwnedAdProposals_categories_items = ({ data, isOwner }) => {
  const [itemdata, setItemdata] = useState(trendingCategoryData);
  const {chainName} = useChainContext();

  const [filterVal, setFilterVal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectedItem, setIsSelectedItem] = useState({});
  const [validate, setValidate] = useState({});
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [successFullUpload, setSuccessFullUpload] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedParamsIntegration, setSelectedParamsIntegration] = useState([]);
  const [showSliderForm, setShowSliderForm] = useState(false);
  const [adParameters, setAdParameters] = useState([]);
  const [imageURLSteps, setImageURLSteps] = useState([]);
  const [successFullUploadModal, setSuccessFullUploadModal] = useState(false);
  const [imageUrlVariants, setImageUrlVariants] = useState([]);
  const stepsRef = useRef([]);
  const [numSteps, setNumSteps] = useState(2);
  const { contract: DsponsorAdminContract } = useContract("0xE442802706F3603d58F34418Eac50C78C7B4E8b3", contractABI);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const { mutateAsync: uploadToIPFS, isLoading: isUploading } = useStorageUpload();
  const { mutateAsync: submitAd } = useContractWrite(DsponsorAdminContract, "submitAdProposals");


  const handleFilter = (category) => {
    if (category !== "all") {
      setItemdata(trendingCategoryData.filter((item) => item.category === category));
    } else {
      setItemdata(trendingCategoryData);
    }
  };
  const handlePreviewModal = () => {
    setSuccessFullUpload(false);
    validateInputs();
    setShowPreviewModal(!showPreviewModal);
  };
  const handleSelection = (item) => {
    setIsSelectedItem((prevState) => ({
      ...prevState,
      [item.id]: !prevState[item.id],
    }));

    setSelectedItems((previousItems) => {
      const isAlreadySelected = previousItems.some((i) => i.id === item.id);

      if (isAlreadySelected) {
        return previousItems.filter((i) => i.id !== item.id);
      } else {
        const newItems = item;
        return [...previousItems, newItems];
      }
    });
  };
  const handleLogoUpload = (file, index, step) => {

    if (file) {
      const newFiles = [...files];
      const newPreviewImages = [...previewImages];
      newFiles[index] = { file: file, index: index, offerIds: step.offerIds};
      newPreviewImages[index] = URL.createObjectURL(file);

      setFiles(newFiles);
      setPreviewImages(newPreviewImages);
    }
  };
  const validateInputs = () => {
    let isValid = true;
    let newErrors = {};

    if (files.length < imageURLSteps.length) {
      newErrors.imageError = "Image is missing.";
      isValid = false;
    }

    if (!link || !isValidURL(link)) {
      newErrors.linkError = "The link is missing or invalid.";
      isValid = false;
    }
    setValidate(isValid);
    setErrors(newErrors);
    return isValid;
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSliderForm = () => {
    setShowSliderForm(!showSliderForm);
    console.log(selectedItems, "selectedItems");
    let adParams = [];
    const uniqueIds = new Set();
    const adDetails = {};

    for (const token of selectedItems) {
      const offers = token.nftContract.adOffers;
      if (offers.length > 0) {
        const offer = offers[0];
        for (const param of offer.adParameters) {
          const paramId = param.adParameter.id;
          if (paramId && paramId !== "xSpaceId" && paramId !== "xCreatorHandle") {
            uniqueIds.add(paramId);
            adDetails[paramId] = adDetails[paramId] || new Set();
            adDetails[paramId].add(offer.id);
          }
        }
      }
    }

    for (const id in adDetails) {
      adDetails[id] = Array.from(adDetails[id]);
    }

    const uniqueIdsArray = Array.from(uniqueIds);
    setAdParameters(uniqueIdsArray);

    const imageURLStep = [];

    uniqueIdsArray
      .filter((id) => id.startsWith("imageURL"))
      .map((id) => {
        const variant = id.slice("imageURL-".length);
        imageURLStep.push({
          uniqueId: variant,
          offerIds: adDetails[id],
        });
      });
    const totalNumSteps = numSteps + imageURLStep.length;
    setImageURLSteps(imageURLStep);
    setNumSteps(totalNumSteps);

  };
  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }
    setIsLoadingButton(true);
    const selectedOfferIdItems = [];
    const selectedTokenIdItems = [];
    const adParametersItems = [];
    const dataItems = [];


    try {
      for (const item of selectedItems) {
        for (const args of item.nftContract.adOffers[0].adParameters) {
          if (args.adParameter.id !== "xSpaceId" && args.adParameter.id !== "xCreatorHandle") {
            selectedOfferIdItems.push(item.nftContract.adOffers[0].id);
            selectedTokenIdItems.push(item.tokenId);
            adParametersItems.push(args.adParameter.id);

          }
        }
        for (const file of files) {
          let uploadUrl;
          if (file.offerIds.includes(item.nftContract.adOffers[0].id)) {
            try {
              uploadUrl = await uploadToIPFS({
                data: [file.file],
                options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
              });
            } catch (error) {
              console.error("Erreur lors de l'upload à IPFS:", error);
              throw new Error("Upload to IPFS failed.");
            }
            dataItems.push(uploadUrl[0]);
          }
        }
        dataItems.push(link);
      }


      const argsAdSubmited = {
        offerId: selectedOfferIdItems,
        tokenId: selectedTokenIdItems,
        adParameters: adParametersItems,
        data: dataItems,
      };
      console.log(argsAdSubmited, "argsAdSubmited");
      await submitAd({ args: Object.values(argsAdSubmited) });
    } catch (err) {
      console.log(err);
      throw new Error("Upload to Blockchain failed.");
    } finally {
    isLoadingButton(false);
    }
  };

  const handleSelectionTokens = () => {
    setIsSelectionActive(!isSelectionActive);
    setShowSliderForm(false);
    setIsSelectedItem({});
    setSelectedItems([]);
    setImageURLSteps([]);
    setPreviewImages([]);
    setImageUrlVariants([]);
    setFiles([]);
    setNumSteps(2);
  };
  console.log(imageUrlVariants, "imageUrlVariants");

  if (!data) {
    return (
      <div className="flex w-full justify-center">
        <Image src="/images/loading-bullet.svg" alt="icon" width={60} height={60} />
      </div>
    );
  }
  return (
    <>
      {/* <!-- Filter --> */}
      <div className="mb-8 flex flex-wrap items-center justify-between">
        <ul className="flex flex-wrap items-center">
          {ownedAdProposals_categories_filter.map(({ id, svg, text }) => {
            if (text === "all") {
              return (
                <li className="my-1 mr-2.5" key={id}>
                  <button
                    className={
                      filterVal === id
                        ? "dark:border-jacarta-600 group bg-accent border-jacarta-100 font-display flex h-9 items-center rounded-lg border px-4 text-sm font-semibold transition-colors border-transparent text-white dark:border-transparent capitalize"
                        : "dark:border-jacarta-600 dark:bg-jacarta-900 dark:hover:bg-accent group hover:bg-accent border-jacarta-100 font-display text-jacarta-500 flex h-9 items-center rounded-lg border bg-white px-4 text-sm font-semibold transition-colors hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent dark:hover:text-white capitalize"
                    }
                    onClick={() => {
                      handleFilter(text);
                      setFilterVal(id);
                    }}
                  >
                    {text}
                  </button>
                </li>
              );
            } else {
              return (
                <li className="my-1 mr-2.5" key={id}>
                  <button
                    onClick={() => {
                      handleFilter(text);
                      setFilterVal(id);
                    }}
                  >
                    <div
                      className={
                        filterVal === id
                          ? "dark:border-jacarta-600 group bg-accent border-jacarta-100 font-display flex h-9 items-center rounded-lg border px-4 text-sm font-semibold transition-colors border-transparent text-white dark:border-transparent capitalize"
                          : "dark:border-jacarta-600 dark:bg-jacarta-900 dark:hover:bg-accent group hover:bg-accent border-jacarta-100 font-display text-jacarta-500 flex h-9 items-center rounded-lg border bg-white px-4 text-sm font-semibold transition-colors hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent dark:hover:text-white capitalize"
                      }
                    >
                      <svg className={filterVal === id ? "icon mr-1 h-4 w-4 transition-colors fill-white" : "icon fill-jacarta-700 dark:fill-jacarta-100 mr-1 h-4 w-4 transition-colors group-hover:fill-white"}>
                        <use xlinkHref={`/icons.svg#icon-${svg}`}></use>
                      </svg>
                      <span>{text}</span>
                    </div>
                  </button>
                </li>
              );
            }
          })}
        </ul>
        {/* dropdown */}
        {/* <Recently_added_dropdown data={sortText} dropdownFor="recently_added" /> */}
      </div>

      {/* <!-- Grid --> */}
      {data.length > 0 ? (
        <div className="flex flex-col justify-center items-center">
          {" "}
          {isOwner && (
            <button
              className={`${
                isSelectionActive
                  ? "text-accent shadow-white-volume ici hover:bg-accent-dark mb-4 hover:shadow-accent-volume  rounded-full bg-white py-3 px-8 text-center font-semibold transition-all hover:text-white"
                  : "bg-accent shadow-accent-volume hover:bg-accent-dark mb-4 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              }`}
              onClick={handleSelectionTokens}
            >
              {showSliderForm || isSelectionActive ? "Close selection" : "Submit ad for multiple tokens"}
            </button>
          )}
          {!showSliderForm && (
            <div className={` grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4`}>
              {data?.map((item, index) => {
                return isSelectionActive ? (
                  <div onClick={() => handleSelection(item)} key={index} className={`  ${isSelectedItem[item.id] ? "border-4 border-jacarta-100 rounded-2xl" : ""}`}>
                    <OfferItem
                      item={item}
                      isToken={true}
                      isSelectionActive={isSelectionActive}
                      url={!item.tokenData ? `/${chainName}/offer/${item.nftContract.adOffers[0].id}/${item.tokenId}` : `/${chainName}/offer/${item.nftContract.adOffers[0].id}/${item.tokenId}?tokenData=${item.tokenData}`}
                    />
                  </div>
                ) : (
                  <OfferItem
                    item={item}
                    key={index}
                    isToken={true}
                    isSelectionActive={isSelectionActive}
                    url={!item.tokenData ? `/${chainName}/offer/${item.nftContract.adOffers[0].id}/${item.tokenId}` : `/${chainName}/offer/${item.nftContract.adOffers[0].id}/${item.tokenId}?tokenData=${item.tokenData}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <span>You have no ad space yet...</span>
          <Link href="/#hot-offers" className="bg-accent shadow-accent-volume hover:bg-accent-dark w-36 rounded-full py-3 px-8 text-center font-semibold text-white transition-all">
            Buy
          </Link>
        </div>
      )}
      {!showSliderForm && (
        <div className={`fixed dark:border-jacarta-500 border  bottom-0 blury-background left-0 right-0 px-4 py-3 animated-modalSelectedItemUp ${!isSelectionActive && "animated-modalSelectedItemDown"}`}>
          <div className="dropdown-item mb-4 font-display   block w-full rounded-xl  text-left text-sm transition-colors dark:text-white">
            <span className="flex items-center justify-center gap-6">
              <span className="mr-4">
                Ad Spaces selected : <span className="text-accent text-md ml-1">{Object.values(isSelectedItem).filter((value) => value === true).length}</span>{" "}
              </span>
            </span>
          </div>

          <div className="flex justify-center  gap-4 flex-wrap">
            <button className={` !rounded-full !min-w-[100px] !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-green !cursor-pointer `} onClick={handleSliderForm}>
              Continue
            </button>

            <button className={` !rounded-full !min-w-[100px] !py-3 !px-8 !text-center !font-semibold !text-white !transition-all !bg-red !cursor-pointer `} onClick={handleSelectionTokens}>
              Close
            </button>
          </div>
        </div>
      )}
      {showSliderForm && (
        <div>
          <SliderForm styles={styles} files={files} handlePreviewModal={handlePreviewModal} stepsRef={stepsRef} numSteps={numSteps}>
            <Step_1_Mint stepsRef={stepsRef} styles={styles} adParameters={adParameters} setImageUrlVariants={setImageUrlVariants} />
            <Step_2_Mint stepsRef={stepsRef} styles={styles} setLink={setLink} link={link} />
            {imageURLSteps.map((step, index) => (
              <Step_3_Mint
                key={step.uniqueId}
                stepsRef={stepsRef}
                currentStep={index + 2}
                offerIds={step.offerIds}
                id={step.uniqueId}
                styles={styles}
                file={files[index]}
                previewImage={previewImages[index]}
                handleLogoUpload={(file) => handleLogoUpload(file, index, step)}
              />
            ))}
          </SliderForm>
        </div>
      )}
      {showPreviewModal && (
        <div className="modal fade show bloc">
          <PreviewModal
            handlePreviewModal={handlePreviewModal}
            handleSubmit={handleSubmit}
            link={link}
            imageUrlVariants={imageUrlVariants}
            imageURLSteps={imageURLSteps}
            name={true}
            description={true}
            previewImage={previewImages}
            errors={errors}
            successFullUpload={successFullUpload}
            validate={validate}
            buttonTitle="Submit ad"
            modalTitle="Ad Space Preview"
            successFullUploadModal={successFullUploadModal}
            isLoadingButton={isLoadingButton}
          />
        </div>
      )}
    </>
  );
};

export default OwnedAdProposals_categories_items;
