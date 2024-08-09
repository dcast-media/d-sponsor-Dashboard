import { useState } from "react";
import Image from "next/image";

export default function TokenImage({ tokenImage }) {
  const [imageModal, setImageModal] = useState(false);

  return (
    <figure className="mb-8 md:mb-0 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 items-start md:basis-auto lg:w-1/2 w-full flex justify-center relative">
      <button className="w-full md:sticky md:top-0 md:right-0" onClick={() => setImageModal(true)}>
        <Image
          width={585}
          height={726}
          src={tokenImage ?? "/images/gradient_creative.jpg"}
          alt="image"
          className="rounded-2xl cursor-pointer h-auto object-contain w-full shadow-lg"
        />
      </button>

      <div className={imageModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
          <Image
            width={582}
            height={722}
            src={tokenImage ?? "/images/gradient_creative.jpg"}
            alt="image"
            className="h-full object-cover w-full rounded-2xl"
          />
        </div>

        <button
          type="button"
          className="btn-close absolute top-6 right-6"
          onClick={() => setImageModal(false)}
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
    </figure>
  );
}
