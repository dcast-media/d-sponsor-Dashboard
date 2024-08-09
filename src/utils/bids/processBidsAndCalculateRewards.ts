import { Ranking } from "@/utils/graphql/fetchLeaderboard";

/**
 * Process bids and calculate rewards for each participant.
 * @param {Array} rankings - The list of ranking objects.
 * @returns {Array} The list of ranking objects with DPoints.
 */
const processBidsAndCalculateRewards = (rankings: Ranking[]) => {
  if (!Array.isArray(rankings)) {
    console.error("Rankings is not an array:", rankings);
    return [];
  }

  const updatedRankings = rankings.map((ranking) => ({
    ...ranking,
    dPoints: 0 // Initialize DPoints for each ranking
  }));

  updatedRankings.forEach((ranking) => {
    // Process bids
    if (ranking.nbBids > 0) {
      let previousBidAmount = 0;

      Object.entries(ranking.currenciesAmounts || {}).forEach(([, amounts]) => {
        const bidSpent = parseFloat(amounts.bidSpent ?? 0);

        // Reward prior bidders
        if (previousBidAmount > 0) {
          const bidIncrement = bidSpent - previousBidAmount;
          if (bidIncrement > 0) {
            const reward = bidIncrement * 0.5;
            ranking.dPoints += reward;
          }
        }

        previousBidAmount = bidSpent;

        // Calculate potential reward if the bid were to stop now
        const potentialReward = bidSpent * 0.5;
        ranking.dPoints += potentialReward;
      });
    }

    // Check if this bidder won any bids
    if ((ranking.nbWinningBids as number) > 0) {
      Object.entries(ranking.currenciesAmounts || {}).forEach(([, amounts]) => {
        const bidSpent = parseFloat(amounts.bidSpent ?? "0");
        ranking.dPoints += bidSpent; // Reward equivalent to the cost
      });
    }

    // Process direct buys
    if ((ranking.nbBuys as number) > 0) {
      Object.entries(ranking.currenciesAmounts || {}).forEach(([, amounts]) => {
        const buySpent = parseFloat(amounts.buySpent ?? "0");
        ranking.dPoints += buySpent; // Reward equivalent to the cost
      });
    }
  });

  return updatedRankings;
};

export default processBidsAndCalculateRewards;
