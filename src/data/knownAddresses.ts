import { Address } from "thirdweb";

interface KnownAddress {
  isKnown: boolean;
  name: string;
}

const siborg: Record<Address, KnownAddress> = {
  "0x9a7fac267228f536a8f250e65d7c4ca7d39de766": {
    isKnown: true,
    name: "SiBorg"
  }
};

export default siborg;
