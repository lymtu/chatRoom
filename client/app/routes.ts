import {
  type RouteConfig,
  layout,
  index,
  route,
} from "@react-router/dev/routes";

const routeList = [
  index("routes/home.tsx"),
  layout("routes/auth/layout.tsx", [
    route("signin", "routes/auth/signin.tsx"),
    route("signup", "routes/auth/signup.tsx"),
  ]),
  route("select", "routes/select/index.tsx", [
    index("routes/select/select.tsx"),
    route(":id", "routes/select/[id].tsx"),
  ]),
] satisfies RouteConfig;

const file = import.meta.glob("./routes/api/*.ts");
Object.keys(file).forEach((key) => {
  routeList.push(
    route(
      key.replace("./routes/", "").replace(".ts", ""),
      key.replace("./", "")
    )
  );
});

export default routeList;
