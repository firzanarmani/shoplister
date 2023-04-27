import { type ReactElement } from "react";
import { Link } from "react-router-dom";

import RegisterForm from "@/features/auth/RegisterForm";

function Register(): ReactElement {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div id="heading" className="flex flex-col space-y-2 text-center">
        <h1 id="title" className="text-2xl font-semibold tracking-tight">
          {`Join ShopLister.app`}
        </h1>
        <p id="subtitle" className="text-sm text-muted-foreground">
          {`Already have an account?`}
          <Link
            to="/auth/login"
            className="ml-1 text-foreground hover:underline"
          >{`Log in here!`}</Link>
        </p>
      </div>
      <div className="grid gap-6">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
