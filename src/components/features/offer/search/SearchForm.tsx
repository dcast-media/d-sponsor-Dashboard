import { useState } from "react";
import { toUtf8Bytes, keccak256 } from "ethers/lib/utils";
import { useChainContext } from "@/hooks/useChainContext";
import Input from "@/components/ui/Input";

const SearchForm = ({ offerId, onUrlChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentChainObject } = useChainContext();

  const chainId = currentChainObject?.chainId;

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    const normalized = searchTerm
      .toLowerCase()
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]/gi, "");
    const bigInt = BigInt(keccak256(toUtf8Bytes(normalized)));
    const url = `/${chainId}/offer/${offerId}/${bigInt}?tokenData=${searchTerm}`;

    onUrlChange(url, searchTerm);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6 rounded-xl">
      <button
        type="submit"
        className="absolute right-0 top-0 flex h-full w-12 items-center justify-center rounded-md bg-primaryPurple transition-all  hover:bg-primaryPurple-dark"
      >
        <span className="  ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            className="h-4 w-4 fill-jacarta-500 dark:fill-white"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
          </svg>
        </span>
      </button>
      <Input type="search" value={searchTerm} onChange={handleChange} placeholder="Search" />
    </form>
  );
};

export default SearchForm;
