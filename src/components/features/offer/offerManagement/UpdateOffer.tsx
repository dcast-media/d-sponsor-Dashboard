import React, { useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { Web3Button, useContract, useContractWrite } from "@thirdweb-dev/react";
import config from "@/config/config";
import { useChainContext } from "@/hooks/useChainContext";
import { toast } from "react-toastify";
import { features } from "@/data/features";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { DatePicker } from "@nextui-org/date-picker";
import { parseDate } from "@internationalized/date";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Address } from "thirdweb";

const fileTypes = ["JPG", "PNG", "WEBP"];

const UpdateOffer = ({ offer }) => {
  const [offerId, setOfferId] = useState<string | null>(null);
  const [metadataURL, setMetadataURL] = useState(null);
  const [admins, setAdmins] = useState<string[]>([]);
  const [initialAdmins, setInitialAdmins] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [validators, setValidators] = useState<string[]>([]);
  const [initialValidators, setInitialValidators] = useState<string[]>([]);
  const [imageRatio, setImageRatio] = useState<string | null>(null);
  const [initialImageRatio, setInitialImageRatio] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [disabledLocked, setDisabledLocked] = useState<boolean>(false);
  const [initialDescription, setInitialDescription] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");
  const [, setImageUrl] = useState<string>("");
  const [initialExternalLink, setInitialExternalLink] = useState<string>("");
  const [externalLink, setExternalLink] = useState<string>("");
  const [initialValidDateFrom, setInitialValidDateFrom] = useState<any>(null);
  const [validDateFrom, setValidDateFrom] = useState<any>(null);
  const [initialValidDateTo, setInitialValidDateTo] = useState<any>(null);
  const [validDateTo, setValidDateTo] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [initialMetadatas, setInitialMetadatas] = useState<any>(null);
  const [metadatas, setMetadatas] = useState<any>(null);
  const [initialName, setInitialName] = useState<string | null>(null);

  const { currentChainObject } = useChainContext();
  const chainId = currentChainObject?.chainId;

  const { contract } = useContract(
    config[chainId as number]?.smartContracts?.DSPONSORADMIN?.address as Address
  );
  const { mutateAsync } = useContractWrite(contract, "updateOffer");

  const handleLogoUpload = (file: any) => {
    if (file) {
      setFiles([file]);
      setPreviewImages([URL.createObjectURL(file)]);
    }
  };

  const uploadNewMetadatas = async (originalMetadatas) => {
    const storage = new ThirdwebStorage({ clientId: "6f375d41f2a33f1f08f6042a65d49ec9" });

    let finalMetadatas = { ...originalMetadatas };

    // check if image has changed, if so, upload the new image
    let newImageUrl: string | null = null;
    if (files.length > 0) {
      try {
        const imageUri = await storage.upload(files[0]);
        newImageUrl = await storage.resolveScheme(imageUri);
      } catch (error) {
        console.error(error);
        throw new Error("Error uploading the image");
      }
    }

    // update the metadata object with the new image url or keep the old one
    finalMetadatas = {
      ...finalMetadatas,
      offer: {
        ...finalMetadatas?.offer,
        image: newImageUrl ?? originalMetadatas?.offer?.image
      }
    };

    // make sure metadatas is a valid JSON object
    if (typeof finalMetadatas !== "object") {
      throw new Error("Metadatas are not correct");
    }

    // check if the metadatas object has the required fields
    if (!finalMetadatas?.offer?.name) {
      throw new Error("Metadatas must have a name field");
    } else if (!finalMetadatas?.offer?.description) {
      throw new Error("Metadatas must have a description field");
    } else if (!finalMetadatas?.offer?.external_link) {
      throw new Error("Metadatas must have an external_link field");
    } else if (!finalMetadatas?.offer?.image) {
      throw new Error("Metadatas must have an image field");
    } else if (!finalMetadatas?.offer?.valid_from) {
      throw new Error("Metadatas must have a valid_from field");
    } else if (!finalMetadatas?.offer?.valid_to) {
      throw new Error("Metadatas must have a valid_to field");
    }

    // check if metadatas have changed
    if (
      finalMetadatas?.offer?.name === initialName &&
      finalMetadatas?.offer?.description === initialDescription &&
      finalMetadatas?.offer?.external_link === initialExternalLink &&
      finalMetadatas?.offer?.image === initialImageUrl &&
      finalMetadatas?.offer?.valid_from ===
        new Date(
          initialValidDateFrom?.year,
          initialValidDateFrom?.month - 1,
          initialValidDateFrom?.day + 1
        ).toISOString() &&
      finalMetadatas?.offer?.valid_to ===
        new Date(
          initialValidDateTo?.year,
          initialValidDateTo?.month - 1,
          initialValidDateTo?.day + 1
        ).toISOString()
    ) {
      return null;
    }

    try {
      const jsonUri = await storage.upload(finalMetadatas);
      const jsonUrl = await storage.resolveScheme(jsonUri);
      return jsonUrl;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  useEffect(() => {
    const fetchMetadatas = async (metadataURL) => {
      const storage = new ThirdwebStorage({ clientId: "6f375d41f2a33f1f08f6042a65d49ec9" });

      if (metadataURL) {
        try {
          const initialMetadatas = await storage.downloadJSON(metadataURL);

          // init metadatas
          setInitialDescription(initialMetadatas?.offer?.description);
          setInitialExternalLink(initialMetadatas?.offer?.external_link);
          setInitialImageUrl(initialMetadatas?.offer?.image);
          setInitialValidDateFrom(
            parseDate(new Date(initialMetadatas?.offer?.valid_from).toISOString().slice(0, 10))
          );
          setInitialValidDateTo(
            parseDate(new Date(initialMetadatas?.offer?.valid_to).toISOString().slice(0, 10))
          );
          setInitialMetadatas(initialMetadatas);

          // set initialMetadatas
          setName(initialMetadatas?.offer?.name);
          setDescription(initialMetadatas?.offer?.description);
          setExternalLink(initialMetadatas?.offer?.external_link);
          setImageUrl(initialMetadatas?.offer?.image);
          setValidDateFrom(
            parseDate(new Date(initialMetadatas?.offer?.valid_from).toISOString().slice(0, 10))
          );
          setValidDateTo(
            parseDate(new Date(initialMetadatas?.offer?.valid_to).toISOString().slice(0, 10))
          );
          setMetadatas(initialMetadatas);

          // set preview images
          setPreviewImages([initialMetadatas?.offer?.image]);
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (offer) {
      setName(offer?.name);
      setInitialName(offer?.name);
      setOfferId(offer?.id);
      setMetadataURL(offer?.metadataURL);
      setAdmins(offer?.admins);
      setInitialAdmins(offer?.admins);
      setDisabled(offer?.disable);
      setValidators(offer?.validators);
      setInitialValidators(offer?.validators);

      const param = offer?.adParameters?.find((param) => param?.adParameter?.base === "imageURL");

      // if variants are not present, set image ratio to null
      // if variants length is 0, set image ratio to null
      // if variants length is 1, set image ratio to the first element
      // if variants length is greater than 1, set image ratio to the first element + ":" + the second element

      let imageRatio;
      if (!param?.adParameter?.variants || param?.adParameter?.variants.length === 0) {
        imageRatio = null;
      }

      if (param?.adParameter?.variants.length === 1) {
        imageRatio = param?.adParameter?.variants[0];
      }

      if (param?.adParameter?.variants.length > 1) {
        imageRatio = param?.adParameter?.variants[0] + ":" + param?.adParameter?.variants[1];
      }

      setInitialImageRatio(imageRatio);
      setImageRatio(imageRatio);

      fetchMetadatas(offer?.metadataURL);
    }
  }, [offer]);

  useEffect(() => {
    if (initialMetadatas) {
      // retake the initial metadatas but override the offer object fields with the new values but keep the rest
      setMetadatas({
        ...initialMetadatas,
        offer: {
          ...initialMetadatas?.offer,
          name,
          description,
          external_link: externalLink,
          valid_from: new Date(
            validDateFrom?.year as number,
            (validDateFrom?.month as number) - 1,
            (validDateFrom?.day as number) + 1
          ).toISOString(),
          valid_to: new Date(
            validDateTo?.year as number,
            (validDateTo?.month as number) - 1,
            (validDateTo?.day as number) + 1
          ).toISOString()
        }
      });
    } else {
      setMetadatas({
        creator: {
          name: "",
          description: "",
          image: "",
          external_link: "",
          categories: []
        },
        offer: {
          name,
          description,
          external_link: externalLink,
          valid_from: validDateFrom
            ? new Date(validDateFrom).toISOString()
            : new Date().toISOString(),
          valid_to: validDateTo ? new Date(validDateTo).toISOString() : new Date().toISOString(),
          token_metadata: {}
        }
      });
    }
  }, [description, externalLink, initialMetadatas, name, validDateFrom, validDateTo]);

  const handleAddAdmin = () => {
    if (!admins) {
      setAdmins([""]);
      return;
    }
    if (admins?.length === 0) {
      setAdmins([""]);
      return;
    }

    setAdmins([...admins, ""]);
  };

  const handleRemoveAdmin = (index) => {
    if (index === 0) {
      toast("You can't remove the initial admin", { type: "error" });
      return;
    }

    setAdmins(admins.filter((_, i) => i !== index));
  };

  const handleAdminChange = (index, value) => {
    if (!admins) setAdmins([""]);

    const newAdmins = admins?.map((admin) => admin);

    newAdmins[index] = value;

    setAdmins(newAdmins);
  };

  const handleAddValidator = () => {
    if (!validators) {
      setValidators([""]);
      return;
    }
    if (validators.length === 0) {
      setValidators([""]);
      return;
    }

    setValidators([...validators, ""]);
  };

  const handleRemoveValidator = (index) => {
    setValidators(validators.filter((_, i) => i !== index));
  };

  const handleValidatorChange = (index, value) => {
    if (!validators) setValidators([""]);

    const newValidators = validators?.map((validator) => validator);

    newValidators[index] = value;

    setValidators(newValidators);
  };

  const handleImageRatioChange = (value) => {
    if (value === "") {
      setImageRatio("");
      return;
    }

    if (value.includes("/")) {
      const [width, height] = value.split("/");

      if (width === "" || height === "") {
        setImageRatio("");
        return;
      }

      if (isNaN(width) || isNaN(height)) {
        setImageRatio("");
        return;
      }

      setImageRatio(width + ":" + height);
    } else {
      setImageRatio(value);
    }
  };

  const handleUpdateOffer = async (originalMetadatas) => {
    // check image ratio
    // ratio should be "0" or "x:x" specific format with x being a number
    if (imageRatio !== "" && imageRatio !== "0") {
      const [width, height] = (imageRatio as string).split(":");
      const length = (imageRatio as string).split(":").length;

      if (length > 2) {
        toast("Image ratio is not correct, it should be 0 or width:height", { type: "error" });
        return;
      }

      if (width === "" || height === "") {
        toast("Image ratio is not correct, it should be 0 or width:height", { type: "error" });
        return;
      }
    }

    // remove empty strings from admins and validators
    const updatedAdmins = admins?.filter((admin) => !!admin) ?? [];
    const updatedValidators = validators?.filter((validator) => !!validator) ?? [];

    // admins for add options are admins not included in initial admins
    const updatedAdminsForAddOptions =
      updatedAdmins?.filter((admin) => !initialAdmins?.includes(admin)) ?? [];

    // admins for remove options are initial admins not included in updated admins
    const updatedAdminsForRemoveOptions =
      initialAdmins?.filter((admin) => !updatedAdmins?.includes(admin)) ?? [];

    // validators for add options are validators not included in initial validators
    const updatedValidatorsForAddOptions =
      updatedValidators?.filter((validator) => !initialValidators?.includes(validator)) ?? [];

    // validators for remove options are initial validators not included in updated validators
    const updatedValidatorsForRemoveOptions =
      initialValidators?.filter((validator) => !updatedValidators?.includes(validator)) ?? [];

    // init ad parameters for add options and remove options
    let updatedAdParametersForAddOptions: string[] = [];
    let updatedAdParametersForRemoveOptions: string[] = [];

    // ad parameters as initial are in the format of [{adParameter: {id: string, base: string, variants: [""]}}]
    // we want to send to the blockchain an array of ad parameters that are string in the format base-variant1:variant2 (for image ratio for example)
    // so we need to check if the new image ratio is different from the initial image ratio
    const isRatioDifferent = initialImageRatio !== imageRatio;

    // if the ratio is different, we need to add it to the ad parameters for add options
    if (isRatioDifferent) {
      updatedAdParametersForAddOptions.push("imageURL-" + imageRatio);
    }

    // if the ratio is different, we need to remove it from the ad parameters for remove options
    if (isRatioDifferent) {
      updatedAdParametersForRemoveOptions.push("imageURL-" + initialImageRatio);
    }

    let newMetadataUrl: string = "";
    try {
      newMetadataUrl = (await uploadNewMetadatas(originalMetadatas)) as string;
    } catch (error) {
      console.error(error);
      toast(error.message, { type: "error" });
      throw new Error(error);
    }

    setDisabledLocked(disabled);

    const updatedOfferParams = {
      offerId: parseFloat(offerId as string),
      disable: disabled,
      name,
      offerMetadata: newMetadataUrl ?? metadataURL,
      addOptions: {
        admins: updatedAdminsForAddOptions,
        validators: updatedValidatorsForAddOptions,
        adParameters: updatedAdParametersForAddOptions
      },
      removeOptions: {
        admins: updatedAdminsForRemoveOptions,
        validators: updatedValidatorsForRemoveOptions,
        adParameters: updatedAdParametersForRemoveOptions
      }
    };

    try {
      await mutateAsync({
        args: [
          updatedOfferParams?.offerId,
          updatedOfferParams?.disable,
          updatedOfferParams?.name,
          updatedOfferParams?.offerMetadata,
          updatedOfferParams?.addOptions,
          updatedOfferParams?.removeOptions
        ]
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <div className="flex items-center flex-wrap gap-8">
        <div className="mb-4 w-1/3">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Offer name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={name ?? ""}
            className="rounded-lg w-full p-2 text-white"
          />
        </div>

        <div className="mb-4 w-1/3">
          <label className="block text-gray-700 text-sm font-semibold mb-2">External Link</label>
          <Input
            type="text"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            placeholder={externalLink ?? ""}
            className="rounded-lg w-full p-2 text-white"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Offer Description</label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={description ?? ""}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Image</label>

        <div className="flex items-start gap-4 flex-wrap">
          <div
            className={`dark:bg-secondaryBlack dark:border-primaryPurple border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white  px-1 text-center ${
              previewImages.length <= 0 ? "py-20" : "p-1"
            }`}
            style={{ width: `300px`, height: `300px` }}
          >
            <div
              className={`relative z-10 cursor-pointer  ${!previewImages ? "p-1" : "px-0 h-full w-full"}`}
            >
              {previewImages.length <= 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
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
                  className="flex justify-center items-center"
                  style={{ width: `300px`, height: `300px` }}
                >
                  <Image
                    src={previewImages[0] ?? ""}
                    fill={true}
                    objectFit="cover"
                    alt="Preview"
                    className="object-cover h-full"
                  />
                </div>
              )}
            </div>
            <div className="dark:bg-primaryPurple bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
              <FileUploader
                handleChange={handleLogoUpload}
                name="file"
                types={fileTypes}
                classes="file-drag !max-w-full !min-w-[fit-content]"
                maxSize={25}
                minSize={0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setPreviewImages([initialImageUrl]);
                setFiles([]);
              }}
              className="bg-green text-white rounded-lg px-4 py-2"
            >
              Reset to default
            </button>

            <button
              onClick={() => {
                setPreviewImages([]);
                setFiles([]);
              }}
              className="bg-red text-white rounded-lg px-4 py-2"
            >
              Remove Image
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Valid From</label>
          <DatePicker className="max-w-md" value={validDateFrom} onChange={setValidDateFrom} />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Valid To</label>
          <DatePicker className="max-w-md" value={validDateTo} onChange={setValidDateTo} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Admins</label>

        {admins &&
          admins.map((admin, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <Input
                type="text"
                placeholder={admin}
                value={admin}
                onChange={(e) => handleAdminChange(index, e.target.value)}
              />
              <button
                type="button"
                className="bg-red text-white rounded-lg px-4 py-2"
                onClick={() => handleRemoveAdmin(index)}
              >
                Remove
              </button>
            </div>
          ))}

        <button
          type="button"
          className="bg-green text-white rounded-lg px-4 py-2 mt-2"
          onClick={handleAddAdmin}
        >
          Add Admin
        </button>
      </div>

      {features.canChangeValidators && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Validators</label>

          {validators &&
            validators.map((validator, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder={validator}
                  value={validator}
                  onChange={(e) => handleValidatorChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="bg-red text-white rounded-lg px-4 py-2"
                  onClick={() => handleRemoveValidator(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          <button
            type="button"
            className="bg-green text-white rounded-lg px-4 py-2"
            onClick={handleAddValidator}
          >
            Add Validator
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-4">Ad Parameters</label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 mb-4">
            <label className="block text-gray-700 text-xs">Image aspect ratio (width:height)</label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={imageRatio as string}
                value={imageRatio}
                onChange={handleImageRatioChange}
              />
            </div>
            <span className="text-jacarta-300 text-xs">
              Leave empty or put 0 if you don&apos;t want to specify an aspect ratio.
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Switch.Root
          checked={disabled}
          onCheckedChange={setDisabled}
          id="disable"
          className="w-[42px] h-[25px] rounded-full relative data-[state=checked]:bg-primaryPurple border border-white border-opacity-10 outline-none cursor-default"
        >
          <Switch.Thumb className="block w-[19px] h-[19px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
        <label className="block text-white text-sm font-semibold">Disable the offer</label>
      </div>

      <Web3Button
        action={() => {
          toast
            .promise(handleUpdateOffer(metadatas), {
              pending: "Waiting for confirmation 🕒",
              success: disabledLocked
                ? "The offer has been disabled 🎉"
                : "The offer has been updated 🎉",
              error: "Transaction rejected 🤯"
            })
            .catch((error) => {
              console.error(error);
            });
        }}
        contractAddress={config[chainId as number]?.smartContracts?.DSPONSORADMIN?.address}
        className="!mt-4 !bg-primaryPurple !w-fit !hover:bg-opacity-80 !px-4 !py-2 !text-white !font-semibold !rounded-full mb-4"
      >
        Update Offer
      </Web3Button>
    </div>
  );
};

export default UpdateOffer;
