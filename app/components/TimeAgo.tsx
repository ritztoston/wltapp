import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const UPDATE_INTERVAL = 30000;

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

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export const TimeAgo = ({ date }: { date: string }) => {
  const [daysAgo, setDaysAgo] = useState("");

  useEffect(() => {
    const updateDaysAgo = () => {
      const formatted = DateTime.fromISO(date);
      const diff = formatted.diffNow().shiftTo(...units);
      let unit: Intl.RelativeTimeFormatUnit = "second";

      for (const u of units) {
        if (diff.get(u) !== 0) {
          unit = u;
          break;
        }
      }

      if (filter.includes(unit)) {
        return setDaysAgo(
          DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED),
        );
      }

      setDaysAgo(relativeFormatter.format(Math.trunc(diff.as(unit)), unit));
    };

    const intervalId = setInterval(updateDaysAgo, UPDATE_INTERVAL);

    updateDaysAgo(); // Initial update

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, [date]);

  return <span>{`${daysAgo}`}</span>;
};
