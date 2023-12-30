import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type { ZodSchema, ZodError } from "zod";

import { logout } from "~/controllers/auth";
import { getSession } from "~/session.server";

import { ActionErrors, Notification, Profile } from "./types";

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

const isProfile = (profile: Profile) => {
    return (
        profile &&
        typeof profile === "object" &&
        typeof profile.email === "string"
    );
};

export const getProfile = async (request: Request) => {
    const session = await getSession(request);
    const profile = session.get("user") as Profile | null;
    
    if (!profile) {
        await logout(request);
        return null;
    }

    return profile;
};

export const useOptionalProfile = () => {
    const data = useMatchesData("root");
    if (!data || !isProfile(data.profile as Profile)) {
        return undefined;
    }
    return data.profile as Profile;
};

export function useProfile() {
    const maybeUser = useOptionalProfile();
    if (!maybeUser) {
        throw new Error(
            "No profile found in root loader.",
        );
    }
    return maybeUser;
}

export const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
};

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

export const ampToObj = (
    string: string | null | undefined,
): Notification | undefined => {
    if (!string) return undefined;

    const strings = string.split(";");
    return {
        type: strings[0] as Notification["type"],
        title: strings[1],
        description: strings[2],
    };
};

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
            errors: errors.issues.reduce(
                (acc: ActionErrors<ActionInput>, curr) => {
                    const key = curr.path[0] as keyof ActionInput;
                    acc[key] = curr.message;
                    return acc;
                },
                {},
            ),
        };
    }
}
