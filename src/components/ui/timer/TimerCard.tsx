"use client";

import { useEffect, useState } from "react";
import Countdown from "react-countdown";

const Completionist = () => (
  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center text-black dark:text-black justify-center space-x-1 rounded-full bg-white py-2.5 px-6 text-2xs font-medium">
    <span>Ended listing</span>
  </div>
);

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <div
        className="js-countdown-single-timer flex space-x-2"
        data-countdown="2023-09-07T19:40:30"
        data-expired="Ended listing"
      >
        <span className="countdown-days text-jacarta-900 dark:text-white">
          <span className="js-countdown-days-number text-xs font-medium">{days}</span>
          <span className="block text-xs font-medium tracking-tight">D</span>
        </span>
        <span className="countdown-hours text-jacarta-900 dark:text-white">
          <span className="js-countdown-hours-number text-xs  font-medium">{hours}</span>
          <span className="block text-xs font-medium tracking-tight">H</span>
        </span>
        <span className="countdown-minutes text-jacarta-900 dark:text-white">
          <span className="js-countdown-minutes-number text-xs  font-medium">{minutes}</span>
          <span className="block text-xs font-medium tracking-tight">Min</span>
        </span>
        <span className="countdown-seconds text-jacarta-900 dark:text-white">
          <span className="js-countdown-seconds-number text-xs  font-medium">{seconds}</span>
          <span className="block text-xs font-medium tracking-tight">Sec</span>
        </span>
      </div>
    );
  }
};

export default function TimerCard({ endTime }) {
  const [showTimer, setShowTimer] = useState(false);
  const [remainingTime, setRemainingTime] = useState<Date | null>(null);

  useEffect(() => {
    const endDate = new Date(parseInt(endTime) * 1000); // Convert UNIX timestamp to JavaScript Date object
    setRemainingTime(endDate);
    setShowTimer(true);
  }, [endTime]);

  return <>{showTimer && <Countdown date={remainingTime as Date} renderer={renderer} />}</>;
}
