import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? "75a96f0b0e8c3e2f83863f08abeec6e6"
});

export { client };
export default client;
