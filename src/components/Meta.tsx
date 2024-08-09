import Head from "next/head";

const Meta = ({ title, keyword, desc }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link
          rel="icon"
          href={
            process.env.NEXT_PUBLIC_CONFIG_MODE === "dev"
              ? "/favicon-siborg-testnet.png"
              : "/favicon-siborg.png"
          }
        />
        <meta name="description" content={desc} />
        <meta name="keyword" content={keyword} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Siborg Ads" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta
          property="og:image"
          content="https://orange-elegant-swallow-161.mypinata.cloud/ipfs/QmaKVtq9B8UaraFDfkYaodti2VummZ4FvR2MZeTTV7Ycke"
        />
        <meta property="og:url" content="https://app.dsponsor.com" />
        <meta name="og:site_name" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@siborgapp" />
        <meta name="twitter:creator" content="@siborgapp" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta
          name="twitter:image"
          content="https://orange-elegant-swallow-161.mypinata.cloud/ipfs/QmaKVtq9B8UaraFDfkYaodti2VummZ4FvR2MZeTTV7Ycke"
        />
        <script
          defer
          data-domain="app.dsponsor.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </Head>
    </div>
  );
};

Meta.defaultProps = {
  title: "Siborg Ads | Unlock The Web3 Monetization Solution.",
  keyword:
    "audience engagement, web3, creator economic, NFT, creator monetization, creator economy, creator token, creator coin, creator tokenization, creator economy",
  desc: "Explore the future of media monetization. Siborg Ads decentralized platform offers tokenized advertising spaces for dynamic and sustainable media funding."
};

export default Meta;
