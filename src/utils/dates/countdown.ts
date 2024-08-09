import { useEffect, useState } from "react";

/**
 * A custom React hook that provides a countdown timer to a specified target date.
 *
 * @param {Date | string | number} targetDate - The target date and time to count down to.
 *                                              This can be a Date object, a string, or a number representing milliseconds since the epoch.
 * @returns {Object} - An object containing the remaining time in days, hours, minutes, and seconds.
 *
 * @example
 * // Example usage:
 * const targetDate = "2024-12-31T23:59:59";
 * const { days, hours, minutes, seconds } = useCountdown(targetDate);
 *
 * // This hook will recalculate the remaining time every second until the target date is reached.
 */
export function useCountdown(targetDate: Date | number | string) {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
}

/**
 * A helper function that calculates the remaining time until the countdown ends.
 *
 * @param {number} countDown - The difference in milliseconds between the current time and the target date.
 * @returns {Object} - An object containing the calculated time left in:
 *                     - `days` (number): Number of full days remaining.
 *                     - `hours` (number): Number of full hours remaining after subtracting days.
 *                     - `minutes` (number): Number of full minutes remaining after subtracting days and hours.
 *                     - `seconds` (number): Number of full seconds remaining after subtracting days, hours, and minutes.
 *
 * @example
 * const countDown = 86400000; // 1 day in milliseconds
 * const timeLeft = getReturnValues(countDown);
 * // `timeLeft` will be { days: 1, hours: 0, minutes: 0, seconds: 0 }
 */
function getReturnValues(countDown) {
  // Calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}
