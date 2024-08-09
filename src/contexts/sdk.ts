"use client";

import { createContext } from "react";
import { Address } from "thirdweb";

const SDKContext = createContext({
  sdk: null as any,
  admin: null as Address | null,
  SDKChainId: null as number | null,
  setSDKChainId: () => {},
  setSDK: () => {},
  getChainName: () => {},
  setAdmin: () => {}
});
export default SDKContext;
