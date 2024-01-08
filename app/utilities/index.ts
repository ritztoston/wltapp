import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type { ZodSchema, ZodError } from "zod";

export const DEFAULT_AUTH_HOME = "/classrooms";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown> | undefined;
}

export const acronymizer = (word: string): string => {
  return word
    .replace(/\(.*?\)/g, "")
    .split(" ")
    .map((w) => w[0])
    .join("");
};

export const capitalize = (string: string): string => {
  let words = string.split("%20");

  if (string.includes("%20")) {
    words = string.split("%20");
  } else {
    words = string.split(" ");
  }

  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  // Join the words back into a string
  const resultString = capitalizedWords.join(" ");

  return resultString;
};

export const urlParser = (pathname: string): string => {
  if (process.env.APP_SITE) return process.env.APP_SITE.concat(pathname);
  return pathname;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateRandomCode = (length = 5) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

export const getUserFullName = (
  a: string,
  b: string,
  separator = " ",
): string => {
  return a.concat(separator, b);
};

export const getInitials = (word: string): string => {
  return word.charAt(0);
};

export type ActionErrors<T> = Partial<Record<keyof T, string>>;
export function validationAction<ActionInput>({
  body,
  schema,
}: {
  body: ActionInput;
  schema: ZodSchema;
}) {
  try {
    const formData = schema.parse(body) as ActionInput;
    return { formData: formData, errors: null };
  } catch (e) {
    const errors = e as ZodError<ActionInput>;
    return {
      formData: body,
      errors: errors.issues.reduce((acc: ActionErrors<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput;
        acc[key] = curr.message;
        return acc;
      }, {}),
    };
  }
}
