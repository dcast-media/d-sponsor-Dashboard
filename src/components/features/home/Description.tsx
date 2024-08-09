import React, { useState } from "react";
import Link from "next/link";
import Modal from "react-modal";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/20/solid";

const socials = [
  {
    name: "X / Twitter",
    href: "https://x.com/siborgapp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-twitter-x"
        viewBox="0 0 16 16"
      >
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
      </svg>
    ),
    circle: false
  },
  {
    name: "Discord",
    href: "https://discord.gg/siborgapp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-discord"
        viewBox="0 0 16 16"
      >
        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
      </svg>
    ),
    circle: false
  },
  {
    name: "Website",
    href: "https://www.siborg.io/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-link-45deg"
        viewBox="0 0 16 16"
      >
        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
      </svg>
    ),
    circle: true
  }
];

const steps = [
  {
    title: "Find a Keyword",
    description: (
      <span>
        Find a keyword to bid on. Remember that{" "}
        <span className="font-semibold text-white">
          each ad space is linked to a unique search keyword
        </span>
        .
      </span>
    )
  },
  {
    title: "Bid To Earn",
    description: (
      <span>
        Participate in the &quot;bid to earn&quot; auction to secure ad space or{" "}
        <span className="font-semibold text-white">earn money by being outbid</span>!
      </span>
    )
  },
  {
    title: "Get Mystery Boxes",
    description: (
      <span>
        In addition to winning an auction, the ad owner will{" "}
        <span className="font-semibold text-white">
          receive mystery boxes, a new type of incentive
        </span>{" "}
        with contents to be revealed later.
      </span>
    )
  },
  {
    title: "Submit Ad Proposal",
    description: (
      <span>
        <span className="font-semibold text-white">Submit an ad proposal</span> that will be
        displayed in the SiBorg App once approved.
      </span>
    ),
    image: "/images/home/siborg-preview.png"
  }
];

const Description = ({ description }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage("");
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-white font-semibold text-2xl lg:text-4xl">
              Own the Ad Spaces of the SiBorg App
            </h1>
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href ?? "#"}
                  className={`bg-primaryPurple hover:bg-opacity-80 ${
                    social.circle ? "rounded-full" : "rounded-lg"
                  } text-white p-2`}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          {description && (
            <div className="flex">
              <p className="text-jacarta-100">
                Purchase Ad Space NFTs and gain exclusive control over key search terms in our app.
                Monetize your ad spaces by displaying your own ads, renting them out, or speculating
                on their value increase.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-white font-semibold text-2xl lg:text-4xl">How does it work?</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className="flex p-[1px] bg-primaryBlack hover:-translate-y-1 duration-300 rounded-lg"
                  style={{
                    backgroundImage:
                      "linear-gradient(176deg, #ea465c, #8a4cef 18%, #b649ac 51%, #ea465c 86%, #8a4cef)"
                  }}
                >
                  <div
                    className="flex flex-col justify-between gap-4 p-6 bg-primaryBlack rounded-lg relative"
                    key={index}
                  >
                    <div className="gap-4 flex flex-col">
                      <span className="text-white text-center font-semibold">
                        {index + 1}. {step.title}
                      </span>

                      <div
                        className="flex w-full h-[1px]"
                        style={{
                          backgroundImage:
                            "linear-gradient(176deg, #ea465c, #8a4cef 18%, #b649ac 51%, #ea465c 86%, #8a4cef)"
                        }}
                      />

                      <span className="text-jacarta-100 text-sm">{step.description}</span>
                    </div>

                    {step.image && (
                      <button onClick={() => openModal(step.image)} className="text-left">
                        <span className="underline text-white hover:text-jacarta-100 text-left text-xs cursor-pointer">
                          See example with &apos;Bitcoin&apos; search keyword
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Image"
        className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-0"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="bg-white rounded-lg px-4 pb-4 relative mx-4">
          <div className="absolute top-O right-0 p-2">
            <button
              onClick={closeModal}
              className="hover:bg-jacarta-100 p-1 rounded-full text-black"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <Image
            src={selectedImage}
            alt="SiBorg Ad Preview"
            width={500}
            height={300}
            className="rounded-lg mt-12"
          />
        </div>
      </Modal>
    </>
  );
};

export default Description;
