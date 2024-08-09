import Profile from "@/components/layout/Profile";

export async function generateMetadata({ params }) {
  const { address } = params;
  return {
    title: "SiBorg Ads | Manage your ad spaces - " + address,
    keyword:
      "audience engagement, web3, creator economic, NFT, creator monetization, creator economy, creator token, creator coin, creator tokenization, creator economy",
    description: "Manage your ad spaces on SiBorg Ads."
  };
}

export default function ProfilePage() {
  return <Profile />;
}
