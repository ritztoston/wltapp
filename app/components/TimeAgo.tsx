import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const units: Intl.RelativeTimeFormatUnit[] = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
];

export const TimeAgo = ({ date }: { date: string }) => {
  const [daysAgo, setDaysAgo] = useState(date);

  useEffect(() => {
    const updateDaysAgo = () => {
      const date = DateTime.fromISO(daysAgo);
      const diff = date.diffNow().shiftTo(...units);
      const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

      const relativeFormatter = new Intl.RelativeTimeFormat("en", {
        numeric: "auto",
      });

      setDaysAgo(relativeFormatter.format(Math.trunc(diff.as(unit)), unit));
    };

    const intervalId = setInterval(updateDaysAgo, 60000);

    updateDaysAgo(); // Initial update

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, []);

  return <span>{`${daysAgo}`}</span>;
};
