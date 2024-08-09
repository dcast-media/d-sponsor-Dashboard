import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

const TokenCardSkeleton = ({ widthSize }: { widthSize?: number }) => {
  return (
    <Card
      className={`dark:bg-secondaryBlack dark:border-jacarta-700 border-jacarta-100 relative rounded-2xl block border bg-white  transition-shadow hover:shadow-lg text-jacarta-100 w-[${widthSize}px] space-y-5 p-4`}
      radius="lg"
    >
      <Skeleton className="rounded-lg">
        <div className="rounded-lg bg-default-300 h-40"></div>
      </Skeleton>

      <div className=" flex justify-between ">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>

        <Skeleton className="w-1/5 rounded-lg">
          <div className="h-3 w-1/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>

      <div className=" flex justify-between ">
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>

        <Skeleton className="w-1/5 rounded-lg">
          <div className="h-3 w-1/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </Card>
  );
};

export default TokenCardSkeleton;
