export const fetchDataFromIPFS = async (ipfsLink) => {
  try {

    // new URL(ipfsLink);
    const url = new URL(ipfsLink);
    console.log(url, "URL");

    const path = url.pathname;
    console.log(path, "Path");

    const ipfsGateway = "https://ipfs.io/ipfs/";
    const ipfsUrl = `${ipfsGateway}${path}`;

    console.log(ipfsUrl, "IPFS URL");

    const response = await fetch(ipfsLink);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données IPFS:", error);
    return null;
  }
};
