// import termsAndConditionsData from "@/data/terms-and-conditions";
import Image from "next/image";
import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="pt-[5.5rem] lg:pt-24">
      <section className="relative py-16 md:py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <Image src="/images/gradient_light.jpg" alt="gradient" width={1920} height={789} />
        </picture>

        <div className="container">
          <div className="mx-auto max-w-lg text-center">
            <div>
              <h1 className="text-jacarta-900 font-display mb-6 text-2xl dark:text-white md:text-4xl">
                {/* termsAndConditionsData.title */}
              </h1>
              <p className="dark:text-jacarta-100 mb-12 text-lg leading-normal">
                <a
                  href="https://docs.google.com/document/d/15um5c6mMoKc8V1rVyRJ7tcIxFDmtE8xe75mx-CdB84w"
                  target="_blank"
                >
                  Terms and conditions
                </a>
                {/* termsAndConditionsData.intro */}
              </p>
              {/* termsAndConditionsData.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-jacarta-900 font-bold font-display mb-6 text-2xl dark:text-white md:text-4xl">
                    {section.title}
                  </h2>
                  <p className="dark:text-jacarta-100 mb-12 text-lg leading-normal">
                    {section.content}
                  </p>
                </div>
              )) */}
              {/* <p>Last updated: {termsAndConditionsData.lastUpdated}</p> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
