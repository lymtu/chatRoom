import { Link } from "react-router";
import ThemeSwitchButton from "~/components/themeSwitchButton";

export default function Header({
  roomName,
  className,
}: {
  roomName: string;
  className?: string;
  }) {
  
  return (
    <div
      className={
        "h-20 flex items-center justify-around border-b-2 duration-150 border-inherit " +
        className
      }
    >
      <Link
        to={"/select"}
        className="text-blue-400 dark:to-blue-500 hover:underline cursor-pointer"
      >
        &lt;- back
      </Link>
      <div className="text-center">
        <h3 className="text-lg font-bold">{roomName}</h3>
        <p className="text-sm text-gray-500">Please regulate your remarks.</p>
      </div>
      <ThemeSwitchButton contentClassName="hidden lg:inline" />
    </div>
  );
}
