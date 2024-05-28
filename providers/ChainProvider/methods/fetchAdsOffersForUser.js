export default async function fetchAdsOffersForUser(userAddress, options) {
    const chainId = options?.chainId || '11155111';

    const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);

    const query = `
        query FetchAdsOffersForUser($userAddress: String!) {
            adOffers(where: { creator: $userAddress }) {
                id
                metadataURL
                nftContract {
                    id
                    tokens {
                        currentProposals {
                            pendingProposal
                        }
                    }
                }
            }
        }`;

    const start = new Date();
    const response = await fetch(path,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({query})
    });
    console.info(` ✓ [Relayer] ${new Date().toISOString()} [FETCH]: last user ${userAddress} offers in ${new Date() - start}ms`);
    const json = await response.json();
    return json?.data?.adOffers ?? [];
}
