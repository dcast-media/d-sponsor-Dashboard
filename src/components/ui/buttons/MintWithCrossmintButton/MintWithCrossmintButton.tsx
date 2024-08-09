import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import React from "react";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

/**
 * Mint with Crossmint Button
 * @description Allow to use card to mint a new available a token. Specific to Mint collection / configuration.
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
export default function MintWithCrossmintButton(
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
      tokenData?: string;
    };
    user: { address: string; email: string };
    referrer: { address: string };
    actions: { processing: Function; success: Function; error: Function };
    isDisabled: boolean;
    isLoadingRender: () => React.JSX.Element;
    isActiveRender?: (() => React.JSX.Element) | string;
    isBid: boolean;
    config: {
      projectId: string;
      mintCollectionId: string;
      environment: string;
      currency: any;
      locale: any;
      paymentMethod: any;
    };
    successCallbackURL?: string;
    failureCallbackURL?: string;
    isLoading: boolean;
  }>
) {
  const { offer, token, user, referrer } = props;

  const price = ethers.utils.parseUnits(props.token.price, "wei");

  if (!token.fee) {
    console.warn("MintWithCrossmint: Token fee not found - Using default fee");
  }

  let reason: string = "";
  const expected = ["token.currency", "token.tokenId", "offer.offerId", "user.address"];
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

  const feesBPS = token.protocolFeeBPS ?? 400;
  const fee = price.mul(feesBPS).div(10000);
  const totalFee = fee;
  const totalPriceFormatted = formatUnits(price.add(totalFee), "ether");

  const buttonProps = {
    projectId: props.config?.projectId,
    collectionId: props.config?.mintCollectionId,
    environment: props.config?.environment,
    currency: props.config?.currency,
    locale: props.config?.locale,
    paymentMethod: props.config?.paymentMethod,
    mintTo: user.address,
    mintConfig: {
      totalPrice: totalPriceFormatted,
      params: {
        tokenId: token.tokenId,
        to: user.address,
        currency: token.currency,
        tokenData: token.tokenData ?? "",
        offerId: offer.offerId,
        adParameters: [],
        adDatas: [],
        referralAdditionalInformation: referrer.address ?? "0x"
      }
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
      disabled={props?.isDisabled}
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
