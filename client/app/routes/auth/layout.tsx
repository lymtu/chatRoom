import { Outlet, NavLink } from "react-router";

export default function Layout() {
  return (
    <div className="flex h-screen">
      <div className="duration-150 flex flex-col shadow p-5 w-fit m-auto bg-gray-100 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center justify-around">
          <NavLink
            to={"/signin"}
            className={({ isActive }) =>
              `w-24 text-center ${
                isActive ? "text-2xl font-bold" : "hover:underline duration-150"
              }`
            }
          >
            Sign in
          </NavLink>
          <h2 className="text-xl text-gray-500">or</h2>
          <NavLink
            to={"/signup"}
            className={({ isActive }) =>
              `w-24 text-center ${
                isActive ? "text-2xl font-bold" : "hover:underline duration-150"
              }`
            }
          >
            Sign up
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
