import jwtDecode from "jwt-decode";
import { useAppSelector } from "../app/hooks";

function useAuth(): { isLoggedIn: boolean; email: string; name: string } {
  const token = useAppSelector((state) => state.auth.token);

  if (token !== null) {
    const { email, name } = jwtDecode<{ email: string; name: string }>(token);

    return { isLoggedIn: true, email, name };
  }

  return { isLoggedIn: false, email: "", name: "" };
}

export default useAuth;
