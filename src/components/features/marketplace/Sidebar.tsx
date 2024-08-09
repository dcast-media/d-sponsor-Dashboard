"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import tippy from "tippy.js";
import config from "@/config/config";
import Input from "@/components/ui/Input";

const status = [
  { id: 1, label: "Buy Now", listingType: "Direct" },
  { id: 2, label: "On Auction", listingType: "Auction" }
];

export default function Sidebar({ setFilterTypes }) {
  const [isChainsOpen, setIsChainsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const toggleChains = () => setIsChainsOpen(!isChainsOpen);
  const toggleStatus = () => setIsStatusOpen(!isStatusOpen);
  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  const handleFilterChange = (type, checked, category) => {
    setFilterTypes((prev) => {
      if (checked) {
        return [...new Set([...prev, { type, category }])];
      } else {
        return prev.filter((t) => t.type !== type || t.category !== category);
      }
    });
  };

  return (
    <div className="lg:w-1/5 min-w-[150px] mb-10 js-collections-sidebar lg:h-[calc(100vh_-_232px)] lg:overflow-auto lg:sticky lg:top-32 lg:mr-10 pr-4 scrollbar-custom divide-y divide-jacarta-100 dark:divide-jacarta-800">
      {/* Chains filter */}
      <div className="mt-4 pt-4">
        <h2 id="filters-chains-heading">
          <button
            className="relative flex w-full items-center justify-between py-3 text-left font-display text-xl text-jacarta-900 dark:text-white"
            type="button"
            onClick={toggleChains}
            aria-expanded={isChainsOpen}
            aria-controls="filters-chains"
          >
            <span>Chains</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className={`accordion-arrow h-5 w-5 shrink-0 fill-jacarta-700 transition-transform dark:fill-white ${isChainsOpen ? "rotate-180" : "rotate-0"}`}
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
            </svg>
          </button>
        </h2>
        <div
          id="filters-chains"
          className={`mt-3 ${isChainsOpen ? "collapse-enter collapse-enter-active" : "collapse-exit collapse-exit-active"}`}
          aria-labelledby="filters-chains-heading"
        >
          <ul className="space-y-6 mb-8">
            {Object.entries(config).map((elm, i) => (
              <li key={i}>
                <label className="flex items-center cursor-pointer w-full">
                  <Input
                    type="checkbox"
                    className=" dark:bg-jacarta-800 hover:bg-jacarta-800 !text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
                    onChange={(e) => handleFilterChange(elm[1].network, e.target.checked, "chain")}
                  />
                  <div className="backdrop-blur-sm mr-1 w-7 h-7 rounded-[0.625rem] flex justify-center items-center">
                    <Image
                      src={elm[1].logoURL ?? ""}
                      width={15}
                      height={15}
                      alt="logo"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-display text-sm font-semibold text-jacarta-900 dark:text-white">
                    {elm[1].network}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Status filter */}
      <div className="mt-4 pt-4">
        <h2 id="filters-status-heading">
          <button
            className="relative flex w-full items-center justify-between py-3 text-left font-display text-xl text-jacarta-900 dark:text-white"
            type="button"
            onClick={toggleStatus}
            aria-expanded={isStatusOpen}
            aria-controls="filters-status"
          >
            <span>Status</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className={`accordion-arrow h-5 w-5 shrink-0 fill-jacarta-700 transition-transform dark:fill-white ${isStatusOpen ? "rotate-180" : "rotate-0"}`}
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
            </svg>
          </button>
        </h2>
        <div
          id="filters-status"
          className={`mt-3 ${isStatusOpen ? "collapse-enter collapse-enter-active" : "collapse-exit collapse-exit-active"}`}
          aria-labelledby="filters-status-heading"
        >
          <ul className="space-y-6 mb-8">
            {status.map((elm, i) => (
              <li key={i}>
                <label className="flex items-center cursor-pointer w-full">
                  <Input
                    type="checkbox"
                    id="terms"
                    className=" dark:bg-jacarta-800 hover:bg-jacarta-800 !text-primaryPurple border-jacarta-200 focus:ring-primaryPurple/20 dark:border-jacarta-500 h-5 !w-5 self-start rounded focus:ring-offset-0"
                    onChange={(e) =>
                      handleFilterChange(elm.listingType, e.target.checked, "status")
                    }
                  />
                  <span className="dark:text-white">{elm.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
