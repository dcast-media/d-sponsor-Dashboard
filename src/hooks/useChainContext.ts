import { useContext } from "react";
import ChainContext from "@/contexts/chain";

export function useChainContext() {
  const context = useContext(ChainContext);

  if (context === undefined) {
    throw new Error("useClient must be used within a ScintillaClientProvider");
  }
  return context;
}
