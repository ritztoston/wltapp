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

const filter = ["year", "month", "week", "day"];

export const TimeAgo = ({ date }: { date: string }) => {
  const [daysAgo, setDaysAgo] = useState("");

  useEffect(() => {
    const updateDaysAgo = () => {
      const formatted = DateTime.fromISO(date);
      const diff = formatted.diffNow().shiftTo(...units);
      const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

      if (filter.includes(unit)) {
        return setDaysAgo(
          DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED),
        );
      }

      const relativeFormatter = new Intl.RelativeTimeFormat("en", {
        numeric: "auto",
      });

      setDaysAgo(relativeFormatter.format(Math.trunc(diff.as(unit)), unit));
    };

    const intervalId = setInterval(updateDaysAgo, 30000);

    updateDaysAgo(); // Initial update

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, [date]);

  return <span>{`${daysAgo}`}</span>;
};
