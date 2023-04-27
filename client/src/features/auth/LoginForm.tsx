import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertCircle, IconLoader } from "@tabler/icons-react";
import { type ReactElement } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { redirect } from "react-router-dom";
import { z } from "zod";

import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAppModalContent, setAppModalOpen } from "@/features/app/appSlice";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { setCredentials } from "@/features/auth/authSlice";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
  isFetchBaseQueryErrorWithMessage,
} from "@/utils/helpers";

const schema = z.object({
  email: z.string().min(1, "Cannot be empty").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Cannot be empty")
    .min(8, "At least 8 characters long"),
});

type FormData = z.infer<typeof schema>;

function LoginForm(): ReactElement {
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { accessToken } = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setCredentials({ accessToken }));
      reset();
      redirect("/dashboard");
    } catch (error) {
      let errorMessage = JSON.stringify(error);

      if (isFetchBaseQueryErrorWithMessage(error)) {
        errorMessage = error.data.message;
      } else if (isFetchBaseQueryError(error)) {
        errorMessage =
          "error" in error ? error.error : JSON.stringify(error.data);
      } else if (isErrorWithMessage(error)) {
        errorMessage = error.message;
      }

      dispatch(
        setAppModalContent({
          title: "Unable to login",
          message: errorMessage,
        })
      );
      dispatch(setAppModalOpen(true));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)();
      }}
    >
      <div className="grid gap-1">
        <div id="emailInput" className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email address"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...register("email")}
          />
          <p
            id="emailErrors"
            className="flex flex-row justify-end gap-1 text-xs text-red-600"
          >
            {errors.email !== undefined ? errors.email.message : ""}
            <IconAlertCircle
              className={`h-4 w-4 ${
                errors.email === undefined ? "opacity-0" : "opacity-100"
              }`}
            />
          </p>
        </div>
        <div id="passwordInput" className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            autoCapitalize="none"
            autoComplete="current-password"
            autoCorrect="off"
            disabled={isLoading}
            {...register("password")}
          />
          <p
            id="passwordErrors"
            className="flex flex-row justify-end gap-1 text-xs text-red-600"
          >
            {errors.password !== undefined ? errors.password.message : ""}
            <IconAlertCircle
              className={`h-4 w-4 ${
                errors.password === undefined ? "opacity-0" : "opacity-100"
              }`}
            />
          </p>
        </div>
        <Button
          id="loginBtn"
          disabled={isLoading}
          type="submit"
          className="mt-2"
        >
          {isLoading && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
          Log In
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
