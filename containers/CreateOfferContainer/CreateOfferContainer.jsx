'use client';
import React, { useState, useRef } from "react";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import { useAddress, useContract, useContractWrite, useStorageUpload } from "@thirdweb-dev/react";

import styles from "../../styles/createPage/style.module.scss";
import PreviewModal from "../../components/modal/previewModal";
import Step_1_Create from "../../components/sliderForm/PageCreate/Step_1_Create";
import Step_2_Create from "../../components/sliderForm/PageCreate/Step_2_Create";
import Step_3_Create from "../../components/sliderForm/PageCreate/Step_3_Create";
import Step_4_Create from "../../components/sliderForm/PageCreate/Step_4_Create";
import contractABI from "../../abi/dsponsorAdmin.json";
import SliderForm from "../../components/sliderForm/sliderForm";
import {ethers} from "ethers";

const CreateOfferContainer = () => {
    const [files, setFiles] = useState([]);
    const { mutateAsync: upload, isLoading } = useStorageUpload();

    const [link, setLink] = useState(null);
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [selectedUnitPrice, setSelectedUnitPrice] = useState(1);
    const [selectedCurrency, setSelectedCurrency] = useState("USDC");
    const [customContract, setCustomContract] = useState(null);
    const [selectedRoyalties, setSelectedRoyalties] = useState(10);
    const [validate, setValidate] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [successFullUpload, setSuccessFullUpload] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState([]);
    const [displayedParameter, setDisplayedParameter] = useState([]);
    const [selectedTypeParameter, setSelectedTypeParameter] = useState(0);
    const { contract: DsponsorAdminContract } = useContract("0xE442802706F3603d58F34418Eac50C78C7B4E8b3", contractABI);
    const { mutateAsync: createDSponsorNFTAndOffer } = useContractWrite(DsponsorAdminContract, "createDSponsorNFTAndOffer");
    const [imageRatios, setImageRatios] = useState([]);
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [symbolContract, setSymbolContract] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);
    const [customTokenContract, setCustomTokenContract] = useState(null);
    const [terms, setTerms] = useState([]);
    const [previewTerms, setPreviewTerms] = useState([]);
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const [name, setName] = useState(false);
    const stepsRef = useRef([]);
    const { ethers } = require("ethers");

    const handleUnitPriceChange = (e) => {
        const { value } = e.target;

        const price = value;

        console.log(price);

        setSelectedUnitPrice(value === "" ? null : price);
    };

    const handleRoyaltiesChange = (e) => {
        let { name, value } = e.target;
        setSelectedRoyalties(value);
    };

    const address = useAddress();

    const handleLogoUpload = (file) => {
        if (file) {
            setFiles([file]);
            setPreviewImages([URL.createObjectURL(file)]);
        }
    };



    const validateInputs = () => {
        let isValid = true;
        let newErrors = {};
        if (!name) {
            newErrors.nameError = "Name is missing.";
            isValid = false;
        }

        if (!link){
            newErrors.linkError = "The link is missing or invalid.";
            isValid = false;
        }

        if (!description) {
            newErrors.descriptionError = "Description is missing.";
            isValid = false;
        }
        console.log(files);
        if (files.length === 0) {
            newErrors.imageError = "Image is missing.";
            isValid = false;
        }

        const currentDate = new Date();
        const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1));

        if (!startDate) {
            newErrors.startDateError = "Start date is missing.";
            isValid = false;
        } else if (new Date(startDate) < yesterday) {
            newErrors.startDateError = "Start date cannot be in the past.";
            isValid = false;
        }

        for (let i = 0; i < selectedIntegration.length; i++) {
            if (imageRatios[i] === "custom") {
                console.log("ici");
                newErrors.imageRatioError = "Image ratio is missing.";
                isValid = false;
            }
        }
        if (!endDate) {
            newErrors.endDateError = "End date is missing.";
            isValid = false;
        } else if (new Date(endDate) < yesterday) {
            newErrors.endDateError = "End date cannot be in the past.";
            isValid = false;
        }
        console.log(parseFloat(selectedUnitPrice))
        if (parseFloat(selectedUnitPrice) < 1 * 10 ** -tokenDecimals || isNaN(selectedUnitPrice) || selectedUnitPrice === null) {
            console.log("là");
            newErrors.unitPriceError = `Unit price must be at least ${1 * 10 ** -tokenDecimals}.`;
            isValid = false;
        }

        if (selectedNumber < 0) {
            newErrors.numberError = "Number of ad spaces is missing or invalid.";
            isValid = false;
        }
        if (selectedParameter.length === 0) {
            newErrors.typeAdError = "Type of ad spaces is missing or invalid.";
            isValid = false;
        }

        if (!selectedCurrency) {
            newErrors.currencyError = "Currency is missing or invalid.";
            isValid = false;
        }

        if (selectedCurrency === "custom" && customTokenContract === undefined) {
            newErrors.currencyError = "Custom contract is missing or invalid.";
            isValid = false;
        }

        if (parseFloat(selectedRoyalties) < 0.01 || parseFloat(selectedRoyalties) > 100) {
            newErrors.royaltyError = "Royalties are missing or invalid. They should be between 0.01% and 100%.";
            isValid = false;
        }
        console.log(previewImages, "previewImages");
        setValidate(isValid);
        setErrors(newErrors);
        return isValid;
    };

    const handlePreviewModal = () => {
        setShowPreviewModal(!showPreviewModal);
        validateInputs();
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            return;
        }
        setIsLoadingButton(true);
        try {
            let paramsFormated = [];
            selectedParameter.forEach((param) => {
                const a = param.split("-");
                const b = a.splice(1, 1);
                const c = a.join("-");
                paramsFormated.push(c);
            });
            let uniqueParams = [...new Set(paramsFormated)];
            console.log(uniqueParams);

            const uploadUrl = await upload({
                data: [files[0]],
                options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
            });
            let uploadTerms = [];


            if (typeof terms[0] === "string") {
                uploadTerms.push(terms[0]);

            } else if (typeof terms[0] === "object" && terms[0] !== null && "name" in terms[0]) {
                uploadTerms = await upload({
                    data: [terms[0]],
                    options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
                });
            }

            if (name && link) {
                onUpload(name, link);
            } else {
                console.error("Missing name or link");
            }
            const jsonMetadata = JSON.stringify({
                creator: {
                    name: "",
                    description: "",
                    image: "",
                    external_link: "",
                    categories: ["dApp", "social", "media", "education"],
                },
                offer: {
                    name: name,
                    description: description,
                    image: uploadUrl[0],
                    terms:  uploadTerms[0],
                    external_link: link,
                    valid_from: startDate || "1970-01-01T00:00:00Z",
                    valid_to: endDate || "2100-01-01T00:00:00Z",
                    categories: ["Community", "NFT", "Crypto"],
                    token_metadata: {},
                },
            });
            console.log(jsonMetadata, "jsonMetadata");
            const jsonContractURI = JSON.stringify({
                name: name,
                description: description,
                image: uploadUrl[0],
                external_link: link,
                collaborators: [address],
            });
            // upload json to IPFS
            const jsonMetadataURL = await upload({
                data: [jsonMetadata],
                options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
            });

            // upload json to IPFS
            const jsonContractURIURL = await upload({
                data: [jsonContractURI],
                options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
            });

            const jsonIpfsLinkContractURI = jsonContractURIURL[0];
            const jsonIpfsLinkMetadata = jsonMetadataURL[0];

            const args = [
                JSON.stringify({
                    name: name, // name
                    symbol: "DSPONSORNFT", // symbol
                    baseURI: "https://api.dsponsor.com/tokenMetadata/", // baseURI
                    contractURI: jsonIpfsLinkContractURI, // contractURI from json
                    minter: address,
                    maxSupply: selectedNumber, // max supply
                    forwarder: "0x0000000000000000000000000000000000000000", // forwarder
                    initialOwner: address, // owner
                    royaltyBps: selectedRoyalties * 100, // royalties
                    currencies: [tokenContract], // accepted token
                    prices: [ethers.utils.parseUnits(selectedUnitPrice.toString(), tokenDecimals)], // prices with decimals
                    allowedTokenIds: Array.from({ length: selectedNumber }, (_, i) => i), // allowed token ids
                }),
                JSON.stringify({
                    name: name, // name
                    offerMetadata: jsonIpfsLinkMetadata, // rulesURI

                    options: {
                        admins: [address], // admin
                        validators: [], // validator
                        adParameters: uniqueParams, // ad parameters
                    },
                }),
            ];
            const preparedArgs = [Object.values(JSON.parse(args[0])), Object.values(JSON.parse(args[1]))];
            console.log(preparedArgs, "preparedArgs");
            await createDSponsorNFTAndOffer({ args: preparedArgs });

            setSuccessFullUpload(true);
        } catch (error) {
            setSuccessFullUpload(false);
            console.log(error);
            throw error;
        } finally{
            setIsLoadingButton(false);
        }
    };

    const onUpload = (updatedName, updatedLink) => {
        setName(updatedName);
        setLink(updatedLink);
    };

    const numSteps = 4;
    const successFullUploadModal = {
        body: "Your offer has been created successfully",
        subBody: "❕❕ On your offer management page, you will find the integration code to copy/paste onto your platform.",
        buttonTitle: "Manage Spaces",
        hrefButton: `/manage/${address}`,
    };

    return (
        <div>
            {/* <!-- Create --> */}
            <section className="relative py-24">
                <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
                    <Image width={1519} height={773} priority src="/images/gradient_light.jpg" alt="gradient" className="h-full w-full object-cover" />
                </picture>
                <div className="container">
                    <h1 className="font-display text-jacarta-700 pt-16 pb-8 text-center text-4xl font-medium dark:text-white">Create ad space offer</h1>

                    <div className="mx-auto max-w-[48.125rem]">
                        <p className="text-center pt-8 pb-16 dark:text-white">
                            Finance your activity by selling ad space ownerships. The sponsors, the buyers of ad spaces, will have the exclusive right to propose an ad on your media platform, such as your website. You retain full
                            control to accept or reject any ads submitted.{" "}
                        </p>
                    </div>
                </div>
                <SliderForm styles={styles} handlePreviewModal={handlePreviewModal} stepsRef={stepsRef} numSteps={numSteps} selectedIntegration={selectedIntegration}>
                    <Step_1_Create
                        stepsRef={stepsRef}
                        styles={styles}
                        selectedTypeParameter={selectedTypeParameter}
                        setSelectedParameter={setSelectedParameter}
                        selectedNumber={selectedNumber}
                        setSelectedNumber={setSelectedNumber}
                        setDisplayedParameter={setDisplayedParameter}
                        displayedParameter={displayedParameter}
                        selectedIntegration={selectedIntegration}
                        setSelectedIntegration={setSelectedIntegration}
                        imageRatios={imageRatios}
                        setImageRatios={setImageRatios}
                    />
                    <Step_2_Create stepsRef={stepsRef} styles={styles} setName={setName} setDescription={setDescription} />

                    <Step_3_Create
                        stepsRef={stepsRef}
                        styles={styles}
                        setLink={setLink}
                        link={link}
                        terms={terms}
                        setTerms={setTerms}
                        setPreviewTerms={setPreviewTerms}
                        previewTerms={previewTerms}
                        previewImage={previewImages}
                        file={files}
                        handleLogoUpload={handleLogoUpload}
                    />

                    <Step_4_Create
                        stepsRef={stepsRef}
                        styles={styles}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        selectedUnitPrice={selectedUnitPrice}
                        handleUnitPriceChange={handleUnitPriceChange}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        customContract={customContract}
                        setCustomContract={setCustomContract}
                        selectedRoyalties={selectedRoyalties}
                        handleRoyaltiesChange={handleRoyaltiesChange}
                        setSymbolContract={setSymbolContract}
                        setTokenDecimals={setTokenDecimals}
                        symbolContract={symbolContract}
                        setTokenContract={setTokenContract}
                        tokenDecimals={tokenDecimals}
                        tokenContract={tokenContract}
                        setCustomTokenContract={setCustomTokenContract}
                    />
                </SliderForm>
            </section>
            {showPreviewModal && (
                <div className="modal fade show bloc">
                    <PreviewModal
                        handlePreviewModal={handlePreviewModal}
                        handleSubmit={handleSubmit}
                        name={name}
                        link={link}
                        file={files}
                        description={description}
                        startDate={startDate}
                        endDate={endDate}
                        selectedNumber={selectedNumber}
                        selectedUnitPrice={selectedUnitPrice}
                        symbolContract={symbolContract}
                        selectedCurrency={selectedCurrency}
                        customContract={customContract}
                        selectedRoyalties={selectedRoyalties}
                        imageURLSteps={["imageURL"]}
                        previewImage={previewImages}
                        terms={terms}
                        selectedParameter={selectedParameter}
                        displayedParameter={displayedParameter}
                        validate={validate}
                        errors={errors}
                        successFullUpload={successFullUpload}
                        address={address}
                        buttonTitle="Create ad space offer"
                        modalTitle="Ad Space Offer "
                        successFullUploadModal={successFullUploadModal}
                        isLoadingButton={isLoadingButton}
                    />
                </div>
            )}

            {/* <!-- end create --> */}
        </div>
    );
};

export default CreateOfferContainer;
