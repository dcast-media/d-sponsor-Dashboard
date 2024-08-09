import { createContext } from "react";
import type { ChainObject } from "@/types/chain";
import { Address } from "thirdweb";

const ChainContext = createContext({
  currentChainObject: null as ChainObject | null,
  connectedAddress: null as Address | null
});

export default ChainContext;
