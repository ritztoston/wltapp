import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Content } from "~/components/Content";
import { authenticate } from "~/utilities/auth";

export const meta: MetaFunction = () => {
  return [{ title: "ClassMaster | Home" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  return json({ user });
};

export default function HomePage() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Content user={user} title="Dashboard">
      Home
    </Content>
  );
}
