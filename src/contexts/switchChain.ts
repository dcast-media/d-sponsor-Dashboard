import { createContext } from "react";
import config from "@/config/config";

const SwitchChainContext = createContext({
  selectedChain: Object.values(config)[0]?.network as string,
  // eslint-disable-next-line no-unused-vars
  setSelectedChain: (chain: string) => {}
});

export default SwitchChainContext;
