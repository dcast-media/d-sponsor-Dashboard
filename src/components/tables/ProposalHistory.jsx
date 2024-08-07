import Link from "next/link";
import React, { useState, useEffect } from "react";
import renderDateToHumanString from "../../providers/utils/renderDateToHumanString";
import renderPriceToHumanString from "../../providers/utils/renderPriceToHumanString";
import formatLongAddress from "../../utils/formatLongAddress";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

// let data = [
//   {
//     id: 0,
//     type: "linkURL",
//     creationTimestamp: "1721115312",
//     data: "https://binance.com",
//     lastUpdateTimestamp: "1721117196",
//     rejectReason: null,
//     status: "CURRENT_ACCEPTED"
//   },
//   {
//     id: 0,
//     type: "imageURL-5:1",
//     creationTimestamp: "1721115312",
//     data: "https://6f375d41f2a33f1f08f6042a65d49ec9.ipfscdn.io/ipfs/bafybeihkthq6hnez2tfogymwnktkgnpbpbvreizpclhvzywyxkc6ukqa7u/",
//     lastUpdateTimestamp: "1721117196",
//     rejectReason: null,
//     status: "CURRENT_ACCEPTED"
//   }
// ];

const ProposalHistory = ({ data }) => {
  const [currProposal, setCurrProposal] = useState(null);

  // No need to add the event when the modal opens and remove it when it closes because worst case it just remove an inexisting modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setCurrProposal(null);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const containsMetadata = data.some((proposal) => proposal.metadata);
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="w-full text-left min-w-[736px] border dark:border-primaryPink dark:border-opacity-10 dark:bg-primaryBlack dark:text-white rounded-2lg">
        <table className="w-full mx-auto text-left rounded-2lg">
          <thead className="rounded-2lg">
            <tr className="text-base bg-jacarta-50 dark:bg-primaryPurple rounded-2lg">
              <th className="px-4 py-3 font-medium text-jacarta-100 dark:text-jacarta-100">Id</th>
              {containsMetadata && (
                <th className="px-4 py-3 font-medium text-jacarta-100 dark:text-jacarta-100 w-fit">
                  Metadata
                </th>
              )}
              <th className="px-4 py-3 font-medium text-jacarta-100 dark:text-jacarta-100">Type</th>
              <th className="px-4 py-3 font-medium text-jacarta-100 text-nowrap dark:text-jacarta-100">
                Creation Timestamp
              </th>
              <th className="px-4 py-3 font-medium text-jacarta-100 text-nowrap dark:text-jacarta-100">
                Last Update Timestamp
              </th>
              <th className="px-4 py-3 font-medium text-jacarta-100 dark:text-jacarta-100">Data</th>
              <th className="px-4 py-3 font-medium text-jacarta-100 text-nowrap dark:text-jacarta-100 ">
                Reject Reason
              </th>
              <th className="px-4 py-3 font-medium text-jacarta-100 dark:text-jacarta-100">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.length > 0 &&
              data.map((proposal, proposalIndex) => (
                <tr key={proposalIndex}>
                  <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                    {proposal.id}
                  </td>
                  {containsMetadata && (
                    <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                      {proposal.metadata || "-"}
                    </td>
                  )}
                  <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                    {proposal.type}
                  </td>
                  <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                    {renderDateToHumanString(new Date(parseInt(proposal.creationTimestamp) * 1000))}
                  </td>
                  <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                    {renderDateToHumanString(
                      new Date(parseInt(proposal.lastUpdateTimestamp) * 1000)
                    )}
                  </td>
                  <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                    <button
                      className="hover:cursor-pointer hover:underline"
                      onClick={
                        proposal.type !== "linkURL"
                          ? (e) => {
                              e.preventDefault();
                              console.log("clicked");
                              setCurrProposal(proposal);
                            }
                          : null
                      }
                    >
                      {proposal.type === "linkURL" ? (
                        <Link href={proposal.data} target="_blank" className="text-green">
                          {proposal.data}
                        </Link>
                      ) : (
                        "Preview Image 🔎"
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                    {proposal.rejectReason || "-"}
                  </td>
                  <td className="px-4 py-4 text-jacarta-100 dark:text-jacarta-100">
                    {proposal.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {currProposal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCurrProposal(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen max-w-full max-h-screen backdrop-blur-xl"
        >
          <div
            className="flex items-center justify-center max-w-full max-h-full"
            style={{
              aspectRatio: `${currProposal.cssAspectRatio}`
            }}
          >
            <div className="relative flex items-center justify-center w-3/4 max-w-full max-h-full h-3/4">
              <div className="relative flex items-center justify-center h-full max-w-full max-h-full overflow-hidden bg-white border-2 border-dotted border-jacarta-100 dark:bg-jacarta-200 bg-opacity-20 backdrop-blur-xl dark:bg-opacity-20 dark:border-jacarta-100">
                <Image
                  src={currProposal.data}
                  alt="logo"
                  height={1000}
                  width={1000}
                  className="object-contain object-center h-full max-w-full max-h-full"
                  loading="lazy"
                />
              </div>
              <button
                type="button"
                className="absolute top-0 right-0 -p-10"
                onClick={() => setCurrProposal(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="w-6 h-6 fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="flex items-center justify-center gap-4 mx-auto mt-4 text-center">
        {visibleListings > 1 && (
          <button
            className="px-4 py-2 text-white rounded-lg bg-secondaryBlack hover:bg-opacity-80"
            onClick={handleViewLess}
          >
            <span className="flex items-center gap-1">
              View Less <ChevronUpIcon className="w-4 h-4" />
            </span>
          </button>
        )}
        {visibleListings < sortedBids.length && (
          <button
            className="px-4 py-2 text-white rounded-lg bg-secondaryBlack hover:bg-opacity-80"
            onClick={handleViewMore}
          >
            <span className="flex items-center gap-1">
              View More <ChevronDownIcon className="w-4 h-4" />
            </span>
          </button>
        )}
      </div> */}
    </div>
  );
};

export default ProposalHistory;
