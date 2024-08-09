// This is not a secure way to handle feature flags.
// If a new feature is added there, it shall be known that one user can just devtool change it

const env = process.env.NEXT_PUBLIC_CONFIG_MODE;
const isDevelopment = env === "dev";

// In development mode, we display create offer and multiple currencies (by default to allow easier dev).
// We also later have those put in env variables to allow for easier testing
export const features = {
  canCreateOffer: !!isDevelopment,
  // by default, first item used
  canHaveMultipleCurrencies: !!isDevelopment,
  // Whether to show the "Submitted Ads" in offer details
  canSeeSubmittedAds: true,
  // Whether to show the Integration tab in offer details
  canSeeIntegrationDetails: true,
  // Whether to show the "Create Offer" button in the footer
  canSeeCreateOfferButton: !!isDevelopment,
  // Whether to accept USDC as payment
  canAcceptUSDC: false,
  // Whether to accept custom tokens as payment
  canAcceptCustomTokens: false,
  // Whether to accept Native Tokens as payment
  canAcceptNativeTokens: false,
  // Whether to accept USDT as payment
  canAcceptUSDT: false,
  // Whether to see home in the mobile menu
  canSeeHomeInMobileMenu: false,
  // Whether to filter transactions in activity with WETH only
  canFilterTransactionsWithWETH: true,
  // Whether to be able to change mint price for a specific token
  canChangeTokenMintPrice: false,
  // Wether we can change validators for an offer
  canChangeValidators: false,
  // Wether to show info bulle on the offer page showing the price of the token
  canSeeModalHelperOnOfferPage: false,
  // Wether we're able to pay with crossmint
  canPayWithCrossmintEnabled: !!isDevelopment
};
