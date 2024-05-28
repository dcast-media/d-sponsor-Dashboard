'use client';
import Image from "next/image";
import Link from "next/link";
import {useChainContext} from "../../contexts/hooks/useChainContext";

const Hero = () => {
  const {chainName} = useChainContext();
  return (
    <section className="relative pt-24 md:pt-10 h-1527">
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 block dark:hidden h-full">
        <Image
          width={1519}
          height={760}
          src="/images/gradient.jpg"
          alt="gradient"
          className="h-full w-full object-cover"
        />
      </picture>
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden dark:block">
        <Image
          width={1519}
          height={760}
          src="/images/gradient_dark.jpg"
          alt="gradient dark"
          className="h-full w-full object-cover"
        />
      </picture>

      <div className="container h-full mx-auto">
        <div className="grid h-full items-center gap-4 ">
          <div className="col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-6">
            <h1 className="text-jacarta-700 font-bold font-display mb-6 text-center text-5xl dark:text-white md:text-left lg:text-6xl xl:text-7xl">
              Unlock Smarter Monetization with d&gt;sponsor
            </h1>
            <p className="dark:text-jacarta-200 mb-8 text-center text-lg md:text-left">
              Leverage audience engagement into investment opportunities. A new
              Web3 model for an enhanced media and creator economy.
            </p>
            <div className="flex space-x-4">
              <Link
                href={`/${chainName}/offer/create`}
                className="bg-accent shadow-accent-volume hover:bg-accent-dark w-36 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              >
                Create
              </Link>
              <Link
                href="#hot-offers"
                className="text-accent shadow-white-volume ici hover:bg-accent-dark hover:shadow-accent-volume w-36 rounded-full bg-white py-3 px-8 text-center font-semibold transition-all hover:text-white"
              >
                Buy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
