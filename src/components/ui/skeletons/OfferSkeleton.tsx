import React from "react";
import { Skeleton } from "@nextui-org/react";
import Tippy from "@tippyjs/react";

const OfferSkeleton = () => {
  return (
    <section className="relative lg:mt-24 lg:pt-12  mt-24 pt-12 pb-8 w-full">
      <div className="mb-8 container  flex justify-center flex-col items-center w-full ">
        <div className=" flex justify-center w-full  ">
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-8 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
      </div>
      <div className="container">
        {/* <!-- Item --> */}

        <div className="md:flex md:flex-wrap">
          {/* <!-- Image --> */}
          <figure className="mb-8 md:mb-0   md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full flex justify-center">
            {/* <!-- Modal --> */}

            <Skeleton className="rounded-lg w-full">
              <div className="sm:h-[450px] h-[250px] rounded-lg bg-default-300"></div>
            </Skeleton>

            {/* <!-- end modal --> */}
          </figure>

          {/* <!-- Details --> */}
          <div className="md:w-3/5 gap-4 md:gap-0 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem] flex flex-col justify-between">
            {/* <!-- Collection / Likes / Actions --> */}
            <div className="mb-3 flex w-full">
              {/* <!-- Collection --> */}
              <div className="flex items-center w-full">
                <Skeleton className="w-2/5 rounded-lg mr-2 ">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <span
                  className="dark:border-jacarta-800 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                  data-tippy-content="Verified Collection"
                >
                  <Tippy content={<span>Verified Collection</span>}>
                    <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                      <use xlinkHref="/icons.svg#icon-right-sign"></use>
                    </svg>
                  </Tippy>
                </span>
              </div>
            </div>

            <Skeleton className="w-3/5 rounded-lg ">
              <div className="h-6 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>

            <div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
              <div className="flex items-center w-[100px]">
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              </div>

              <Skeleton className="w-1/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-1/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
              </Skeleton>
            </div>

            <Skeleton className="w-5/5 rounded-lg">
              <div className="h-12 w-5/5 rounded-lg bg-default-200"></div>
            </Skeleton>

            <div className="dark:bg-secondaryBlack dark:border-jacarta-800 border-jacarta-100 rounded-2lg border flex flex-col gap-4 bg-white p-8">
              <div className=" sm:flex sm:flex-wrap">
                <Skeleton className="rounded-lg w-full">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSkeleton;
