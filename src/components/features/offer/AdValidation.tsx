import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ValidatedOrRefusedAds from "@/components/features/offer/adValidation/ValidatedOrRefusedAds";
import PendingAds from "@/components/features/offer/adValidation/PendingAds";
import RejectAd from "@/components/features/offer/adValidation/modals/RejectAd";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import ResponsiveTooltip from "@/components/ui/ResponsiveTooltip";
import { CheckIcon, ClockIcon, XIcon } from "lucide-react";
import { AdProposal } from "@/types/graphql";

const AdValidation = ({
  offer,
  offerId,
  isOwner,
  handleSubmit,
  successFullRefuseModal,
  setSuccessFullRefuseModal,
  setRefusedValidatedAdModal,
  refusedValidatedAdModal,
  setSelectedItems,
  selectedItems,
  sponsorHasAtLeastOneRejectedProposalAndNoPending,
  setSponsorHasAtLeastOneRejectedProposalAndNoPending,
  mediaShouldValidateAnAd,
  isMedia,
  isTokenView,
  itemTokenId,
  pendingProposalData,
  setPendingProposalData
}: {
  offer: any;
  offerId?: string;
  isOwner: boolean;
  handleSubmit: any;
  successFullRefuseModal: boolean;
  setSuccessFullRefuseModal: any;
  setRefusedValidatedAdModal: any;
  refusedValidatedAdModal: any;
  setSelectedItems: any;
  selectedItems: any;
  sponsorHasAtLeastOneRejectedProposalAndNoPending: boolean;
  setSponsorHasAtLeastOneRejectedProposalAndNoPending?: any;
  mediaShouldValidateAnAd: boolean;
  isMedia: boolean;
  isTokenView?: boolean;
  itemTokenId?: string;
  pendingProposalData: any;
  setPendingProposalData: any;
}) => {
  const [validatedProposalData, setValidatedProposalData] = useState<AdProposal[]>([]);
  const [refusedProposalData, setRefusedProposalData] = useState<AdProposal[]>([]);
  const [itemActive, setItemActive] = useState<number>(1);
  const [, setComments] = useState({});
  const [isApprouvedAd, setIsApprouvedAd] = useState<boolean>(false);
  const [pendingProposalLength, setPendingProposalLength] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const tabItem = [
    {
      id: 1,
      text: "Pending",
      icon: <ClockIcon className="w-4 h-4" />
    },
    {
      id: 2,
      text: "Validated",
      icon: <CheckIcon className="w-4 h-4" />
    },

    {
      id: 3,
      text: "Refused",
      icon: <XIcon className="w-4 h-4" />
    }
  ];
  useEffect(() => {
    if (!offer) return;

    const groupedPendingAds = {};
    const groupedValidatedAds = {};
    const groupedRefusedAds = {};

    function processProposal(token, element, groupedAds, statusKey) {
      if (element[statusKey] !== null) {
        if (!groupedAds[token.tokenId]) {
          groupedAds[token.tokenId] = {
            tokenId: token.tokenId,
            offerId: offerId,
            tokenData: token.mint.tokenData || null,
            proposalIds: [],
            adParametersList: {},
            adParametersKeys: []
          };
          if (statusKey === "rejectedProposal") {
            groupedAds[token.tokenId].reason = element[statusKey].rejectReason;
          }
        }
        const adParamBase = element.adParameter.id;

        groupedAds[token.tokenId].proposalIds.push(element[statusKey].id);

        if (!groupedAds[token.tokenId].adParametersKeys.includes(adParamBase)) {
          groupedAds[token.tokenId].adParametersKeys.push(adParamBase);
        }

        groupedAds[token.tokenId].adParametersList[adParamBase] = element[statusKey].data;

        if (adParamBase.startsWith("imageURL") && element.adParameter.variants.length > 0) {
          // adParamBase can be imageURL-1:1 or imageURL-0-1:1 for example
          // in the first case we want aspectRatio to be "1:1" and cssAspectRatio to be "1/1"
          // in the second case we want aspectRatio to be "1:1" and cssAspectRatio to be "1/1" too
          if (adParamBase.includes("-0")) {
            const split = adParamBase.split("-");
            const aspectRatio = split[2];
            const cssAspectRatio = aspectRatio?.replace(":", "/");
            groupedAds[token.tokenId].adParametersList[`aspectRatio`] = aspectRatio;
            groupedAds[token.tokenId].adParametersList[`cssAspectRatio`] = cssAspectRatio;
            setAspectRatio(aspectRatio);
          } else {
            const split = adParamBase.split("-");
            const aspectRatio = split[1];
            const cssAspectRatio = aspectRatio?.replace(":", "/");
            groupedAds[token.tokenId].adParametersList[`aspectRatio`] = aspectRatio;
            groupedAds[token.tokenId].adParametersList[`cssAspectRatio`] = cssAspectRatio;
            setAspectRatio(aspectRatio);
          }
        }
      }
    }

    for (const token of offer.nftContract.tokens) {
      if (token.mint !== null) {
        for (const element of token.currentProposals) {
          processProposal(token, element, groupedPendingAds, "pendingProposal");
          processProposal(token, element, groupedValidatedAds, "acceptedProposal");
          processProposal(token, element, groupedRefusedAds, "rejectedProposal");
        }
      }
    }

    let formattedPendingAds: AdProposal[] = Object.values(groupedPendingAds);
    let formattedValidatedAds: AdProposal[] = Object.values(groupedValidatedAds);
    let formattedRefusedAds: AdProposal[] = Object.values(groupedRefusedAds);

    if (isTokenView) {
      formattedPendingAds = formattedPendingAds.filter(
        (ad) => ad?.token?.tokenId === BigInt(itemTokenId as string)
      );
      formattedValidatedAds = formattedValidatedAds.filter(
        (ad) => ad?.token?.tokenId === BigInt(itemTokenId as string)
      );
      formattedRefusedAds = formattedRefusedAds.filter(
        (ad) => ad?.token?.tokenId === BigInt(itemTokenId as string)
      );
    }

    setPendingProposalData(formattedPendingAds);
    setPendingProposalLength(formattedPendingAds.length);
    setValidatedProposalData(formattedValidatedAds);
    setRefusedProposalData(formattedRefusedAds);
  }, [isTokenView, offer, offerId, itemTokenId, setPendingProposalData]);

  const handleItemSubmit = async (approuved = false) => {
    let submissionArgs: {
      tokenId: string;
      offerId: string;
      validated?: boolean;
      item?: any;
      reason?: string;
    }[] = [];
    setIsApprouvedAd(approuved);

    for (const item of selectedItems) {
      let argObject = {
        ...item,
        ...(approuved && { reason: "" }),
        validated: approuved
      };

      submissionArgs.push(argObject);
    }

    try {
      await handleSubmit(submissionArgs);
      setPendingProposalLength((prev) => prev - submissionArgs.length);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const successFullRefusedAdModalObject = {
    title: "Refused",
    body: "The ad has been refused successfully ✅",
    button: "Close"
  };

  const successFullValidatedAdModalObject = {
    title: "Validated",
    body: "The ad has been validated successfully 🎉",
    button: "Close"
  };

  const closeRefuseModal = () => {
    setRefusedValidatedAdModal(null);
    if (successFullRefuseModal) {
      setSelectedItems([]);
      setSuccessFullRefuseModal(false);
    }
  };

  const handleCommentChange = (tokenId, value) => {
    setComments((currentComments) => ({
      ...currentComments,
      [tokenId]: value
    }));
    setSelectedItems((currentItems) => {
      return currentItems.map((item) => {
        if (!!item?.tokenId && tokenId && BigInt(item?.tokenId) === BigInt(tokenId)) {
          return { ...item, reason: value };
        }
        return item;
      });
    });
  };

  return (
    <>
      {/* <!-- Tabs Nav --> */}
      <Tabs className="tabs">
        <TabList className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-800 md:justify-center">
          {tabItem.map(({ id, text, icon }) => {
            return (
              <Tab className="nav-item" key={id} onClick={() => setItemActive(id)}>
                <button
                  className={
                    itemActive === id
                      ? "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center gap-1 whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                      : "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center gap-1 whitespace-nowrap py-3 px-6 dark:hover:text-white"
                  }
                >
                  {sponsorHasAtLeastOneRejectedProposalAndNoPending &&
                    isOwner &&
                    text === "Refused" && (
                      <ResponsiveTooltip text="You ad as been refused and you have no pending ad. Try to submit a new one.">
                        <ExclamationCircleIcon className="h-5 w-5 text-red dark:text-red" />
                      </ResponsiveTooltip>
                    )}
                  {mediaShouldValidateAnAd &&
                    text === "Pending" &&
                    isMedia &&
                    pendingProposalLength !== 0 && (
                      <ResponsiveTooltip text="You have at least one ad to validate or to refuse.">
                        <ExclamationCircleIcon className="h-5 w-5 text-red dark:text-red" />
                      </ResponsiveTooltip>
                    )}
                  {icon}
                  <span className="font-display text-base font-medium ml-2">
                    <div className="flex items-center">
                      <span>
                        {text} (
                        {text === "Pending"
                          ? pendingProposalData?.length
                          : text === "Validated"
                            ? validatedProposalData?.length
                            : text === "Refused"
                              ? refusedProposalData?.length
                              : 0}
                        )
                      </span>
                    </div>
                  </span>
                </button>
              </Tab>
            );
          })}
        </TabList>

        <div>
          <TabPanel>
            <div className="container mb-12 relative p-0">
              {/* <!-- Filter --> */}
              <PendingAds
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                setRefusedValidatedAdModal={setRefusedValidatedAdModal}
                pendingProposalData={pendingProposalData}
                isToken={false}
                isOwner={isOwner}
                handleItemSubmit={handleItemSubmit}
                aspectRatio={aspectRatio as string}
                setSponsorHasAtLeastOneRejectedProposalAndNoPending={
                  setSponsorHasAtLeastOneRejectedProposalAndNoPending
                }
                isRejecting={isRejecting}
              />
            </div>
          </TabPanel>
        </div>

        <TabPanel>
          <div className="container mb-12 relative p-0">
            {/* <!-- Filter --> */}
            <ValidatedOrRefusedAds
              statut={true}
              proposalData={validatedProposalData}
              isToken={false}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="container mb-12 relative p-0">
            {/* <!-- Filter --> */}
            <ValidatedOrRefusedAds statut={false} proposalData={refusedProposalData} />
          </div>
        </TabPanel>
      </Tabs>

      {refusedValidatedAdModal && (
        <div className="modal fade show bloc">
          <RejectAd
            selectedItems={selectedItems}
            handleCommentChange={handleCommentChange}
            handleItemSubmit={handleItemSubmit}
            closeRefuseModal={closeRefuseModal}
            successFullRefuseModal={successFullRefuseModal}
            successFullModalObject={
              isApprouvedAd ? successFullValidatedAdModalObject : successFullRefusedAdModalObject
            }
            setIsRejecting={setIsRejecting}
            isRejecting={isRejecting}
          />
        </div>
      )}
    </>
  );
};

export default AdValidation;
