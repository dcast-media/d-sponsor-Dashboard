import { getContract } from "thirdweb";
import { ethereum, sepolia } from "thirdweb/chains";
import { client } from "../../data/services/client";

export const contractABI = [
    { inputs: [{ internalType: "address", name: "target", type: "address" }], name: "AddressEmptyCode", type: "error" },
    { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "AddressInsufficientBalance", type: "error" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "AlreadyMinted", type: "error" },
    { inputs: [{ internalType: "uint256", name: "value", type: "uint256" }], name: "AmountValueTooLow", type: "error" },
    { inputs: [], name: "CannotBeZeroAddress", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "numerator", type: "uint256" },
        { internalType: "uint256", name: "denominator", type: "uint256" },
      ],
      name: "ERC2981InvalidDefaultRoyalty",
      type: "error",
    },
    { inputs: [{ internalType: "address", name: "receiver", type: "address" }], name: "ERC2981InvalidDefaultRoyaltyReceiver", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "numerator", type: "uint256" },
        { internalType: "uint256", name: "denominator", type: "uint256" },
      ],
      name: "ERC2981InvalidTokenRoyalty",
      type: "error",
    },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "receiver", type: "address" },
      ],
      name: "ERC2981InvalidTokenRoyaltyReceiver",
      type: "error",
    },
    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "owner", type: "address" },
      ],
      name: "ERC721IncorrectOwner",
      type: "error",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "ERC721InsufficientApproval",
      type: "error",
    },
    { inputs: [{ internalType: "address", name: "approver", type: "address" }], name: "ERC721InvalidApprover", type: "error" },
    { inputs: [{ internalType: "address", name: "operator", type: "address" }], name: "ERC721InvalidOperator", type: "error" },
    { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "ERC721InvalidOwner", type: "error" },
    { inputs: [{ internalType: "address", name: "receiver", type: "address" }], name: "ERC721InvalidReceiver", type: "error" },
    { inputs: [{ internalType: "address", name: "sender", type: "address" }], name: "ERC721InvalidSender", type: "error" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "ERC721NonexistentToken", type: "error" },
    { inputs: [], name: "FailedInnerCall", type: "error" },
    { inputs: [{ internalType: "address", name: "currency", type: "address" }], name: "ForbiddenCurrency", type: "error" },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "InvalidInputLengths", type: "error" },
    {
      inputs: [
        { internalType: "address[]", name: "currencies", type: "address[]" },
        { internalType: "uint256[]", name: "prices", type: "uint256[]" },
      ],
      name: "InvalidPricingStructure",
      type: "error",
    },
    { inputs: [], name: "MaxSupplyExceeded", type: "error" },
    { inputs: [], name: "MaxSupplyShouldBeGreaterThan0", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "OwnableInvalidOwner", type: "error" },
    { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "OwnableUnauthorizedAccount", type: "error" },
    { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
    { inputs: [{ internalType: "address", name: "token", type: "address" }], name: "SafeERC20FailedOperation", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "uint256", name: "length", type: "uint256" },
      ],
      name: "StringsInsufficientHexLength",
      type: "error",
    },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "TokenNotAllowed", type: "error" },
    { inputs: [], name: "UnauthorizedToMint", type: "error" },
    { inputs: [], name: "UnauthorizedUserOperation", type: "error" },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "owner", type: "address" },
        { indexed: true, internalType: "address", name: "approved", type: "address" },
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "owner", type: "address" },
        { indexed: true, internalType: "address", name: "operator", type: "address" },
        { indexed: false, internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint256", name: "_fromTokenId", type: "uint256" },
        { indexed: false, internalType: "uint256", name: "_toTokenId", type: "uint256" },
      ],
      name: "BatchMetadataUpdate",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "ContractURIUpdated", type: "event" },
    { anonymous: false, inputs: [{ indexed: false, internalType: "uint64", name: "version", type: "uint64" }], name: "Initialized", type: "event" },
    { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }], name: "MetadataUpdated", type: "event" },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: true, internalType: "address", name: "from", type: "address" },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        { indexed: true, internalType: "address", name: "currency", type: "address" },
        { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
        { indexed: false, internalType: "string", name: "tokenData", type: "string" },
      ],
      name: "Mint",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
        { indexed: true, internalType: "address", name: "newOwner", type: "address" },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    { anonymous: false, inputs: [{ indexed: true, internalType: "bool", name: "allowed", type: "bool" }], name: "TokensAllowlist", type: "event" },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: true, internalType: "bool", name: "allowed", type: "bool" },
      ],
      name: "TokensAllowlistUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "from", type: "address" },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "currency", type: "address" },
        { indexed: true, internalType: "bool", name: "enabled", type: "bool" },
        { indexed: true, internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "UpdateDefaultMintPrice",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: true, internalType: "address", name: "currency", type: "address" },
        { indexed: true, internalType: "bool", name: "enabled", type: "bool" },
        { indexed: true, internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "UpdateMintPrice",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
        { indexed: true, internalType: "address", name: "user", type: "address" },
        { indexed: false, internalType: "uint256", name: "expires", type: "uint256" },
      ],
      name: "UpdateUser",
      type: "event",
    },
    { inputs: [], name: "MAX_SUPPLY", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "MINTER", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "applyTokensAllowlist", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "baseURI", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "contractURI", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "getApproved", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "currency", type: "address" },
      ],
      name: "getMintPrice",
      outputs: [
        { internalType: "bool", name: "enabled", type: "bool" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    { inputs: [], name: "getOwner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
    {
      inputs: [
        {
          components: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "string", name: "baseURI", type: "string" },
            { internalType: "string", name: "contractURI", type: "string" },
            { internalType: "address", name: "minter", type: "address" },
            { internalType: "uint256", name: "maxSupply", type: "uint256" },
            { internalType: "address", name: "forwarder", type: "address" },
            { internalType: "address", name: "initialOwner", type: "address" },
            { internalType: "uint96", name: "royaltyBps", type: "uint96" },
            { internalType: "address[]", name: "currencies", type: "address[]" },
            { internalType: "uint256[]", name: "prices", type: "uint256[]" },
            { internalType: "uint256[]", name: "allowedTokenIds", type: "uint256[]" },
          ],
          internalType: "struct IDSponsorNFTBase.InitParams",
          name: "params",
          type: "tuple",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    { inputs: [{ internalType: "address", name: "forwarder", type: "address" }], name: "isTrustedForwarder", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "address", name: "currency", type: "address" },
        { internalType: "string", name: "tokenData", type: "string" },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "ownerOf", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "salePrice", type: "uint256" },
      ],
      name: "royaltyInfo",
      outputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [{ internalType: "string", name: "_baseURI", type: "string" }], name: "setBaseURI", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [{ internalType: "string", name: "_contractURI", type: "string" }], name: "setContractURI", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [
        { internalType: "address", name: "currency", type: "address" },
        { internalType: "bool", name: "enabled", type: "bool" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "setDefaultMintPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "currency", type: "address" },
        { internalType: "bool", name: "enabled", type: "bool" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "setMintPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "receiver", type: "address" },
        { internalType: "uint96", name: "feeBps", type: "uint96" },
      ],
      name: "setRoyalty",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_tokenId", type: "uint256" },
        { internalType: "string", name: "_tokenURI", type: "string" },
      ],
      name: "setTokenURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" },
        { internalType: "string[]", name: "_tokenURIs", type: "string[]" },
      ],
      name: "setTokenURIs",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [{ internalType: "bool", name: "_applyTokensAllowlist", type: "bool" }], name: "setTokensAllowlist", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [
        { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
        { internalType: "bool[]", name: "allowed", type: "bool[]" },
      ],
      name: "setTokensAreAllowed",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [{ internalType: "address", name: "forwarder", type: "address" }], name: "setTrustedForwarder", outputs: [], stateMutability: "nonpayable", type: "function" },
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "address", name: "user", type: "address" },
        { internalType: "uint64", name: "expires", type: "uint64" },
      ],
      name: "setUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }], name: "supportsInterface", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "tokenIdIsAllowedToMint", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "tokenURI", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
    { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "tokenURIs", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [{ internalType: "address", name: "newOwner", type: "address" }], name: "transferOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [], name: "trustedForwarder", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "userExpires", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }], name: "userOf", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  ];
export const getContractNFT = async (nftContractAddress) => {
  const contract = getContract({
    client,

    chain: sepolia,

    address: nftContractAddress,
    abi: contractABI,
  });
  return contract;
};

export default getContractNFT;
