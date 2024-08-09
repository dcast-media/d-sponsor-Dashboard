import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@nextui-org/react";
import Image from "next/image";

const ModalHelper = ({
  title,
  body,
  images,
  titleImages,
  dark,
  size = "default"
}: {
  title: string;
  body: React.ReactElement | string;
  images?: string[];
  titleImages?: string[];
  dark?: boolean;
  size?: "small" | "medium" | "large" | "default";
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const displaySize = {
    small: "15",
    medium: "20",
    large: "25",
    default: "20"
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-transparent !min-w-[20px] !p-0 !h-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={displaySize[size]}
          height={displaySize[size]}
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={!dark ? "white" : "rgb(19 23 64)"}
            strokeWidth="2"
            fill="transparent"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            stroke={!dark ? "white" : "rgb(19 23 64)"}
            strokeWidth="1px"
            dy=".3em"
            fill={!dark ? "white" : "rgb(19 23 64)"}
            fontSize="12"
          >
            i
          </text>
        </svg>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="modal-helper">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">{title}</ModalHeader>
              <ModalBody>
                <p>{body}</p>
                <div className="flex justify-around flex-wrap">
                  {(images?.length as number) > 0 &&
                    images?.map((image, index) => (
                      <div className="flex flex-col items-center justify-center gap-3 " key={index}>
                        <p>{titleImages?.[index]}</p>
                        <Image
                          src={image ?? ""}
                          alt="image"
                          width={150}
                          height={150}
                          className=" object-contain"
                        />
                      </div>
                    ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Got it !
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalHelper;
