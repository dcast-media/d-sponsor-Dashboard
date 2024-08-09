import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { BigNumber } from "ethers";
import React from "react";

/**
 * Bid with Crossmint Button
 * @description Allow to use card to bid on a token. Specific to Auction collection for bid.
 * @description Mint params is used to allow integration with the card payment system.
 * @param props
 * @param {Object} props.offer
 * @param {String} props.offer.offerId - Offer ID
 * @param {Object} props.token
 * @param {String} props.token.tokenId - Token ID
 * @param {String} props.token.currency - Token currency
 * @param {String} props.token.buyoutPricePerToken - Token buyout price per token
 * @param {String} props.token.price - Token price
 * @param {String} props.token.listingId - Token listing ID
 * @param {String} props.token.protocolFeeBPS - Token protocol fee BPS
 * @param {String} props.token.royaltiesBPS - Token royalties BPS
 * @param {String} props.token.fee - Token fee
 * @param {Object} props.user
 * @param {String} props.user.address - User address
 * @param {String} props.user.email - User email
 * @param {Object} props.referrer
 * @param {String} props.referrer.address - Referrer address
 * @param {Function} props.actions
 * @param {Function} props.actions.processing - Processing action
 * @param {Function} props.actions.success - Success action
 * @param {Function} props.actions.error - Error action
 * @param {Boolean} props.isDisabled - Is disabled
 * @param {String} props.isLoadingRender - Loading render
 * @param {String} props.isActiveRender - Active render
 * @returns {Element} - CrossmintPayButton
 * @constructor
 */
export default function BidWithCrossmintButton(
  props: Readonly<{
    offer: { offerId: string };
    token: {
      tokenId: string;
      currency: string;
      buyoutPricePerToken: string;
      price: string;
      listingId: string;
      protocolFeeBPS: string;
      royaltiesBPS: string;
      fee: string;
    };
    user: { address: string; email: string };
    referrer: { address: string };
    actions: { processing: Function; success: Function; error: Function };
    isDisabled: boolean;
    isLoadingRender: () => React.JSX.Element;
    isActiveRender?: () => React.JSX.Element;
    isBid: boolean;
    config: {
      projectId: string;
      bidCollectionId: string;
      environment: string;
      currency: any;
      locale: any;
      paymentMethod: any;
    };
    perPriceToken: BigNumber;
    totalPriceFormatted: string;
    successCallbackURL?: string;
    failureCallbackURL?: string;
    isLoading: boolean;
  }>
) {
  const { offer, token, user, referrer } = props;

  if (!token.fee) {
    console.warn("MintWithCrossmint: Token fee not found - Using default fee");
  }

  let reason: string = "";
  const expected = [
    "token.currency",
    "token.tokenId",
    "offer.offerId",
    "user.address",
    "token.buyoutPricePerToken"
  ];
  for (const fullKey of expected) {
    const [parent, key] = fullKey.split(".");

    const value = props?.[parent]?.[key];
    if (!value) {
      // Missing token.currency -> Missing token currency in case happen in face of users.
      reason = `Missing ${key.replace(".", " ")}`;
      break;
    }
  }
  if (reason) {
    // We do not throw, we display in place of the button
    return (
      <code>
        Pay with card not available: {reason} ${JSON.stringify({ offer, token, user, referrer })}
      </code>
    );
  }

  const buttonProps = {
    projectId: props.config?.projectId,
    collectionId: props.config?.bidCollectionId,
    environment: props.config?.environment,
    currency: props.config?.currency,
    locale: props.config?.locale,
    paymentMethod: props.config?.paymentMethod,
    mintTo: user.address,
    mintConfig: {
      totalPrice: props?.totalPriceFormatted,
      quantity: 1,
      _listingId: token.listingId,
      _pricePerToken: props?.perPriceToken,
      _bidder: user.address,
      _referralAdditionalInformation: referrer.address ?? "0x"
    },
    successCallbackURL: props.successCallbackURL,
    failureCallbackURL: props.failureCallbackURL
  };

  if (props?.successCallbackURL) {
    buttonProps.successCallbackURL = props.successCallbackURL;
  }

  if (props?.failureCallbackURL) {
    buttonProps.failureCallbackURL = props.failureCallbackURL;
  }

  return (
    <CrossmintPayButton
      disabled={props?.isDisabled === true}
      className={(props?.isDisabled && "opacity-30 cursor-not-allowed") || ""}
      getButtonText={() => {
        if (props?.isBid) {
          return `Bid NOW with Credit Card`;
        } else {
          return `Buy NOW with Credit Card`;
        }
      }}
      {...buttonProps}
    />
  );
}
