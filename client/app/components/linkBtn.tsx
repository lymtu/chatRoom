import type { ReactNode } from "react";
import { Link } from "react-router";

export default function LinkBtn({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}): ReactNode | Promise<ReactNode> {
  return (
    <Link
      to={to}
      className={
        "duration-150 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md hover:rounded-3xl " +
        className
      }
    >
      {children}
    </Link>
  );
}
