import { Link } from "@tanstack/react-router";
import * as React from "react";

type NextLinkProps = Omit<React.ComponentProps<typeof Link>, "to"> & {
  href: string;
};

export default function NextLink({ href, ...props }: NextLinkProps) {
  return <Link to={href} {...props} />;
}
