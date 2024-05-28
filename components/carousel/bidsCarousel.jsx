'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "tippy.js/dist/tippy.css";
import MdKeyboardArrowRight from "../../components/icons/MdKeyboardArrowRight";
import MdKeyboardArrowLeft from "../../components/icons/MdKeyboardArrowLeft";
import OfferItem from "../cards/offerItem";
import {useChainContext} from "../../contexts/hooks/useChainContext";

const BidsCarousel = ({data}) => {

//  if (!data || data.length === 0) {
//    return (
//      <div className="flex w-full justify-center">
//        <Image src="/images/loading-bullet.svg" alt="icon" width={60} height={60} />
//      </div>
//    );
//  }

    const {chainName} = useChainContext();

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={30}
        slidesPerView="auto"
        loop={true}
        breakpoints={{
          240: {
            slidesPerView: 1,
          },
          565: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
        navigation={{
          nextEl: ".bids-swiper-button-next",
          prevEl: ".bids-swiper-button-prev",
        }}
        className=" card-slider-4-columns !py-5"
      >
        {data.length === 0 || !data ? (
          <div className="flex w-full justify-center">
            <Image src="/images/loading-bullet.svg" alt="icon" width={60} height={60} />
          </div>
        ) : (
          data.map((item, index) => {
            return (
              <SwiperSlide className="text-white" key={index}>
                <OfferItem item={item} url={`/${chainName}/offer/${item.id}/${item.tokenIdAllowedToMint ? item.tokenIdAllowedToMint.tokenId : "" }`} />
              </SwiperSlide>
            );
          })
        )}

      </Swiper>
      {/* <!-- Slider Navigation --> */}
      <div className="group bids-swiper-button-prev swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group bids-swiper-button-next swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default BidsCarousel;
