"use client";

import React, { useEffect, useState, useCallback } from "react";
import MarketplaceHeroSection from "../../components/marketplace/marketplace-hero/marketplace-hero";
import MarketplaceListingSection from "../../components/marketplace/marketplace-listing-section/marketplace-listing-section";
// import { fetchRandomListingsForMarketplace, fetchAllMpListings} from "./services";
import { defaultChainId } from "./marketplace.config";
import Meta from "../../components/Meta";
import {Hero } from "../../components/component";
import HowItWorks from "../../components/explication/howItWorks";
import fetchRandomListingsForMarketplace from "../../providers/ChainProvider/methods/fetchRandomListingsForMarketplace";

export default function MarketplaceContainer() {
    const chainId = defaultChainId;
    const [listings, setListings] = useState({
        listingsForBids: [],
        listingsForBuyNow: [],
    });


    const getMpListings = async () => {
        try {
            const { listingsForBids, listingsForBuyNow } =
                await fetchRandomListingsForMarketplace(chainId);

            setListings({
                listingsForBids,
                listingsForBuyNow,
            });

        } catch (error) {
            console.error("Error fetching marketplace listings", error);
        }
    }


    useEffect(() => {
        getMpListings();
    }, []);

    return (
        <section >
            <main>
                {listings.listingsForBids.length > 0 && (
                    <MarketplaceListingSection
                        listings={listings.listingsForBids}
                        title={"Hot Bids"}
                        type={"bids"}
                    />
                )}
                {listings.listingsForBuyNow.length > 0 && (
                    <MarketplaceListingSection
                        listings={listings.listingsForBuyNow}
                        title={"Buy Now"}
                        type={"buy-now"}
                    />
                )}
            </main>
        </section>
    );
}
