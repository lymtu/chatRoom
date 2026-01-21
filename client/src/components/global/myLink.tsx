import Link, { LinkProps } from "next/link";

export function MyLink({
  className,
  children,
  href,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & LinkProps) {
  return (
    <Link
      href={href}
      className={"hover:underline text-blue-500 " + className}
      {...props}
    >
      {children}
    </Link>
  );
}
