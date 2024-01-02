import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { Content } from "~/components/Content";
import { authenticate } from "~/utilities/auth";

export const meta: MetaFunction = () => {
  return [{ title: "ClassMaster | Home" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate(request);

  return null;
};

export default function HomePage() {
  return <Content title="Dashboard">Home</Content>;
}
