import { type ReactElement, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { usePrefetch } from "@/features/lists/listsApiSlice";
import useAuth from "@/hooks/useAuth";

function Prefetch(): ReactElement {
  const { email } = useAuth();
  const prefetchLists = usePrefetch("getLists", { force: true });
  useEffect(() => {
    prefetchLists({ email });
  }, []);

  return <Outlet />;
}

export default Prefetch;
