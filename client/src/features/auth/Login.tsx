import { IconBrandTelegram } from "@tabler/icons-react";
import { type ReactElement } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import LoginForm from "@/features/auth/LoginForm";

function Login(): ReactElement {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div id="heading" className="flex flex-col space-y-2 text-center">
        <h1 id="title" className="text-2xl font-semibold tracking-tight">
          {`Log in to ShopLister.app`}
        </h1>
        <p id="subtitle" className="text-sm text-muted-foreground">
          {`Don't have an account yet?`}
          <Link
            to="/auth/register"
            className="ml-1 text-foreground hover:underline"
          >{`Join us here!`}</Link>
        </p>
      </div>
      <div className="grid gap-6">
        <LoginForm />
        <div id="divider" className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          id="tgLoginBtn"
          disabled
          variant="outline"
          type="button"
          // disabled={isLoading}
        >
          {/* {isLoading ? (
            <IconLoader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <IconBrandTelegram className="mr-2 h-4 w-4" />
          )} */}
          <IconBrandTelegram className="mr-2 h-4 w-4" /> Telegram
        </Button>
      </div>
    </div>
  );
}

export default Login;
