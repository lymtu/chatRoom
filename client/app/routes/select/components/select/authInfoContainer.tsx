import LinkBtn from "~/components/linkBtn";
import { useState } from "react";
import { addMsg } from "~/lib/store/msgStore";
import { Link } from "react-router";

export default function Info({ isAuth }: { isAuth: boolean | string }) {
  const [auth, setAuth] = useState(isAuth);
  return (
    <div className="md:w-1/2 text-center">
      <h2 className="text-3xl">Chose one room</h2>
      <section className="my-10 md:my-6">
        {auth ? (
          <span>
            <span>Hello,</span>
            <span className="group relative cursor-pointer">
              <span className="mx-2 text-2xl font-bold">{auth}</span>
              <button
                onClick={() => {
                  fetch("/api/signout?name=" + auth).then((res) => {
                    if (typeof res === "string") {
                      addMsg({
                        type: "error",
                        msg: res,
                      });
                      return;
                    }
                    addMsg({
                      type: "success",
                      msg: "You have been signed out.",
                    });
                    setAuth(false);
                  });
                }}
                className="md:absolute md:left-full md:right-0 md:top-1/2 text-xl leading-0 cursor-pointer -translate-y-1/2 md:scale-0 group-hover:scale-100 group-hover:translate-x-full md:hover:underline text-blue-500 text-nowrap duration-150"
              >
                sign out
              </button>
            </span>
          </span>
        ) : (
          <>
            <p>You may not be authenticated.</p>
            <p>
              Try{" "}
              <Link
                className="hover:underline duration-150 text-blue-500"
                to={"/signin"}
              >
                sign in
              </Link>{" "}
              .
            </p>
          </>
        )}
      </section>

      <LinkBtn className="text-nowrap" to={"/"}>
        &lt;- come back
      </LinkBtn>
    </div>
  );
}
