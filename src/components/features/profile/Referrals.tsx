import React from "react";
import Referrals from "@/components/features/profile/referrals/Referrals";
import SiBorgApp from "@/components/features/profile/referrals/SiBorgApp";

const ProfileReferrals = ({ userData, userAddr }) => {
  return (
    <div className="flex flex-col gap-4">
      <Referrals userData={userData} userAddr={userAddr} />
      <SiBorgApp />
    </div>
  );
};

export default ProfileReferrals;
