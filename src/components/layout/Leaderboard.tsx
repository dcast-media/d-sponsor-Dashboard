import React, { useEffect, useState } from "react";
import Tables from "@/components/features/leaderboard/Tables";
import { fetchLeaderboard } from "@/utils/graphql/fetchLeaderboard";
import processBidsAndCalculateRewards from "@/utils/bids/processBidsAndCalculateRewards";
import LeaderboardSkeleton from "@/components/layout/skeletons/LeaderboardSkeleton";
import Meta from "@/components/Meta";
import config from "@/config/config";

const metadata = {
  title: `Leaderboard || SiBorg Ads - The Web3 Monetization Solution`,
  keyword:
    "audience engagement, web3, creator economic, NFT, creator monetization, creator economy, creator token, creator coin, creator tokenization, creator economy",
  desc: "Explore the future of media monetization. SiBorg Ads decentralized platform offers tokenized advertising spaces for dynamic and sustainable media funding."
};

const Marketplace = () => {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises = Object.entries(config).map(
      async ([chainId]) =>
        await fetchLeaderboard(chainId).then((activity) => ({
          ...activity,
          chainId
        }))
    );

    Promise.all(promises)
      .then((activities) => {
        const mergedActivitiesArray: any[] = [];

        for (const activity of activities) {
          const mergedActivities = {
            ...activity,
            rankings: processBidsAndCalculateRewards(activity.rankings)
          };
          mergedActivitiesArray.push(mergedActivities);
        }

        console.log(mergedActivitiesArray);

        setActivity(mergedActivitiesArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  return (
    <>
      <Meta {...metadata} />
      <section className="relative py-24">
        <Tables activity={activity} />
      </section>
    </>
  );
};

export default Marketplace;
