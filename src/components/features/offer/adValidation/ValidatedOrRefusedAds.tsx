import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "tippy.js/dist/tippy.css";

const ValidatedOrRefusedAds = ({
  statut,
  proposalData,
  isToken
}: {
  statut: boolean;
  proposalData: any;
  isToken?: boolean;
}) => {
  const [modalStates, setModalStates] = useState({});
  const [statutItem, setStatutItem] = useState<"check" | "refused" | undefined>(undefined);

  const openModal = (tokenId) => {
    setModalStates((prev) => ({ ...prev, [tokenId]: true }));
  };

  const closeModal = (tokenId) => {
    setModalStates((prev) => ({ ...prev, [tokenId]: false }));
  };

  useEffect(() => {
    if (statut) {
      setStatutItem("check");
    } else {
      setStatutItem("refused");
    }
  }, [proposalData, statut]);

  function formatTokenId(str) {
    if (str.length <= 6) {
      return str;
    }
    return str.slice(0, 3) + "..." + str.slice(-3);
  }
  const getImageUrl = (adParams) => {
    if (!adParams) return "/";

    const imageKey = Object.keys(adParams).find((key) => key.startsWith("imageURL"));
    return imageKey ? adParams[imageKey] : "/";
  };

  if (proposalData?.length === 0) {
    return (
      <div className="flex justify-center">
        {statut ? "No validated ads..." : "No refused ads..."}
      </div>
    );
  }

  return (
    <>
      {/* <!-- Activity Tab --> */}
      <div className="tab-pane fade">
        {/* <!-- Records / Filter --> */}
        {isToken && (
          <div className="dark:bg-secondaryBlack rounded-2lg bg-white p-6 mb-4">
            <div className=" sm:flex sm:flex-wrap">
              <span className="dark:text-jacarta-100 text-jacarta-100 text-sm">
                This ad is displayed on the offer creator&apos;s interfaces!
              </span>
            </div>
          </div>
        )}
        <div className="lg:flex">
          {/* <!-- Records --> */}

          <div className="mb-10 shrink-0 basis-8/12 space-y-5 lg:mb-0 lg:pr-10">
            {proposalData?.map((item) => {
              const { adParametersList, tokenId, reason, tokenData } = item;

              return (
                <div
                  key={tokenId}
                  className="dark:bg-secondaryBlack  gap-5 p-4 dark:border-jacarta-700 transition-shadow hover:shadow-lg border-jacarta-100 rounded-2.5xl relative flex"
                >
                  <div className=" relative flex items-center gap-5 flex-col sm:flex-row w-full">
                    <figure className="self-start w-48 h-auto">
                      <button className="w-full h-full" onClick={() => openModal(tokenId)}>
                        {getImageUrl(adParametersList) && (
                          <Image
                            src={getImageUrl(adParametersList) ?? ""}
                            alt={item?.title ?? "image title"}
                            height={300}
                            width={300}
                            objectFit="contain"
                            className="rounded-2lg w-full h-full"
                            loading="lazy"
                          />
                        )}
                      </button>

                      {/* Modal */}
                      {modalStates[tokenId] && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl h-screen w-full max-h-screen max-w-full"
                          onClick={(e) => {
                            if (e.target === e.currentTarget) {
                              closeModal(tokenId);
                            }
                          }}
                        >
                          <div
                            className="flex justify-center items-center max-w-full max-h-full"
                            style={{
                              aspectRatio: `${proposalData?.find((item) => !!item?.tokenId && tokenId && BigInt(item?.tokenId) === BigInt(tokenId))?.adParametersList?.cssAspectRatio}`
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent click through to the backdrop
                          >
                            <div className="relative flex items-center justify-center max-w-full max-h-full w-3/4 h-3/4">
                              <div className="relative flex justify-center items-center h-full max-w-full max-h-full border-2 border-dotted border-jacarta-100 bg-white dark:bg-jacarta-200 bg-opacity-20 backdrop-blur-xl dark:bg-opacity-20 dark:border-jacarta-100 overflow-hidden">
                                <Image
                                  src={
                                    getImageUrl(
                                      proposalData?.find(
                                        (item) =>
                                          !!item?.tokenId &&
                                          tokenId &&
                                          BigInt(item?.tokenId) === BigInt(tokenId)
                                      )?.adParametersList
                                    ) ?? ""
                                  }
                                  alt="logo"
                                  height={1000}
                                  width={1000}
                                  className="max-w-full max-h-full h-full object-contain object-center"
                                  loading="lazy"
                                />
                              </div>
                              <button
                                type="button"
                                className="absolute top-0 right-0 -p-10"
                                onClick={() => closeModal(tokenId)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width="24"
                                  height="24"
                                  className="h-6 w-6 fill-white"
                                >
                                  <path fill="none" d="M0 0h24v24H0z" />
                                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* End Modal */}
                    </figure>

                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex flex-col w-full">
                        <h3 className=" text-jacarta-900 text-sm dark:text-jacarta-100">Item</h3>
                        <span className="text-green font-medium">
                          {tokenData ?? formatTokenId(tokenId)}
                        </span>
                      </div>

                      <div className="flex flex-col w-full">
                        <h3 className=" text-jacarta-900 text-sm dark:text-jacarta-100">Link</h3>
                        <button className="flex min-w-[20px] text-green hover:text-opacity-80 hover:underline max-w-[20rem]  select-none overflow-hidden text-ellipsis whitespace-nowrap">
                          <Link href={adParametersList.linkURL ?? ""} target="_blank">
                            {adParametersList?.linkURL}
                          </Link>
                        </button>
                      </div>
                      {reason && (
                        <div className="flex flex-col w-full">
                          <h3 className=" text-jacarta-900 text-sm dark:text-jacarta-100">
                            Reason
                          </h3>
                          <span className="text-white">{reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="dark:border-jacarta-800 border-jacarta-100 ml-auto rounded-full border p-3 self-start">
                    <Image
                      width={24}
                      height={24}
                      src={`/images/${statutItem}.svg`}
                      alt="icon"
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* <!-- Filters --> */}

          {/* <aside className="basis-4/12 lg:pl-5">
           
             <form action="search" className="relative mb-12 block" onSubmit={handleSubmit}>
              <input
                type="search"
                className="text-jacarta-900 placeholder-jacarta-500 focus:ring-primaryPurple border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
                placeholder="Search"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-jacarta-500 h-4 w-4 dark:fill-white">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
                </svg>
              </button>
            </form>

            <h3 className="font-display text-jacarta-100 mb-4 font-semibold dark:text-white">Filters</h3>
            <div className="flex flex-wrap">
              {filterData.map((category, i) => {
                return (
                  <button
                    className={
                      filterVal === i
                        ? "dark:border-jacarta-800 group bg-primaryPurple border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border px-4 py-3 border-transparent text-white dark:border-transparent"
                        : "dark:border-jacarta-800 dark:bg-secondaryBlack group dark:hover:bg-primaryPurple hover:bg-primaryPurple border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-3 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent"
                    }
                    key={i}
                    onClick={() => {
                      handleFilter(category);
                      setFilterVal(i);
                    }}
                  >
                    <svg className={filterVal === i ? "icon mr-2 h-4 w-4 fill-white" : "icon fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white"}>
                      <use xlinkHref={`/icons.svg#icon-${category}`}></use>
                    </svg>
                    <span className="text-2xs font-medium capitalize">{category}</span>
                  </button>
                );
              })}
            </div> 
          </aside> */}
        </div>
      </div>
    </>
  );
};

export default ValidatedOrRefusedAds;
