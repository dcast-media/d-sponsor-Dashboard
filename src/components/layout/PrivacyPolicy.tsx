import Image from "next/image";
import React from "react";
import privacyPolicyData from "@/data/privacyPolicy";

export default function PrivacyPolicy() {
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
                {privacyPolicyData.title}
              </h1>
              <p className="dark:text-jacarta-100 mb-12 text-lg leading-normal">
                {privacyPolicyData.intro}
              </p>
              {privacyPolicyData.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-jacarta-900 font-bold font-display mb-6 text-2xl dark:text-white md:text-4xl">
                    {section.title}
                  </h2>
                  <p className="dark:text-jacarta-100 mb-12 text-lg leading-normal">
                    {section.content}
                  </p>
                </div>
              ))}
              <p>Last updated: {privacyPolicyData.lastUpdated}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
