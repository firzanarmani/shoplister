import jwtDecode from "jwt-decode";
import { useAppSelector } from "../app/hooks";

function useAuth(): { email: string; name: string } {
  const token = useAppSelector((state) => state.auth.token);

  if (token !== null) {
    const { email, name } = jwtDecode<{ email: string; name: string }>(token);

    return { email, name };
  }

  return { email: "", name: "" };
}

export default useAuth;
