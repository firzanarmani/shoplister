import useAuth from "../../hooks/useAuth";
import { usePrefetch } from "../lists/listsApiSlice";
import { type ReactElement, useEffect } from "react";
import { Outlet } from "react-router-dom";

function Prefetch(): ReactElement {
  const { email } = useAuth();
  const prefetchLists = usePrefetch("getLists", { force: true });
  useEffect(() => {
    prefetchLists({ email });
  }, []);

  return <Outlet />;
}

export default Prefetch;
