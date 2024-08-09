import Link from "next/link";
import { footerMenuList as defaultFooterMenuList } from "@/data/footer";
import Image from "next/image";
import { useChainContext } from "@/hooks/useChainContext";
import { useAddress } from "@thirdweb-dev/react";
import { features } from "@/data/features";
import Logo from "@/../public/images/siborg-ads/siborg-ads.png";

const Footer = () => {
  const { currentChainObject } = useChainContext();
  const chainId = currentChainObject?.chainId;

  const address = useAddress();

  const footerMenuList = defaultFooterMenuList.concat(
    address !== undefined
      ? [
          {
            id: 3,
            title: "My Account",
            diffClass: "",
            list: [
              {
                id: 1,
                href: `/profile/${address}`,
                text: "Profile"
              },
              ...(features.canCreateOffer
                ? [
                    {
                      id: 2,
                      href: `${chainId}/offer/create`,
                      text: "Create Offer"
                    }
                  ]
                : [])
            ]
          }
        ]
      : []
  );

  return (
    <>
      {/* <!-- Footer --> */}

      <footer className="dark:bg-primaryBlack page-footer bg-white">
        <div className="container">
          <div className="grid grid-cols-6 gap-x-7 gap-y-14 pt-24 pb-12 md:grid-cols-12">
            <div className="col-span-3 md:col-span-4">
              {/* <!-- Logo --> */}
              <Link href="/" className="mb-6 inline-block">
                <Image
                  width={220}
                  height={50}
                  src={Logo ?? ""}
                  className=" dark:hidden"
                  alt="SiBorg Ads | Media sponsoring Marketplace"
                />
              </Link>

              <Link href="/" className=" mb-6 inline-block">
                <Image
                  width={220}
                  height={50}
                  src={Logo ?? ""}
                  className="hidden  dark:block mb-6"
                  alt="SiBorg Ads | Media sponsoring Marketplace"
                />
              </Link>

              {/* <!-- Socials --> */}
              {/* <div className="flex space-x-5">
                {socialIcons.map((item) => {
                  const { id, href, text } = item;
                  return (
                    <Link href={href ?? ""} key={id} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                      <svg className="icon group-hover:fill-primaryPurple fill-jacarta-300 h-5 w-5 dark:group-hover:fill-white">
                        <use xlinkHref={`/icons.svg#icon-${text}`}></use>
                      </svg>
                    </Link>
                  );
                })}
              </div> */}
            </div>

            {footerMenuList.map((single) => (
              <div
                className={`col-span-full sm:col-span-3 md:col-span-2 ${single.diffClass}`}
                key={single.id}
              >
                <h3 className="font-display text-jacarta-900 mb-6 text-sm dark:text-white">
                  {single.title}
                </h3>
                <ul className="dark:text-jacarta-100 flex flex-col space-y-1">
                  {single.list.map((item) => {
                    const { id, href, text, target } = item;
                    return (
                      <li key={id}>
                        <Link
                          href={href ?? ""}
                          target={target ?? ""}
                          className="hover:text-primaryPurple dark:hover:text-white"
                        >
                          {text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between space-y-2 py-8 sm:flex-row sm:space-y-0">
            <span className="dark:text-jacarta-100 text-sm">
              <span>© {new Date().getFullYear()} SiBorg Ads </span>
            </span>

            <ul className="dark:text-jacarta-100 flex flex-wrap space-x-4 text-sm">
              <li>
                <Link
                  href="https://docs.google.com/document/d/15um5c6mMoKc8V1rVyRJ7tcIxFDmtE8xe75mx-CdB84w"
                  target="_blank"
                  className="hover:text-primaryPurple dark:hover:text-white"
                >
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
