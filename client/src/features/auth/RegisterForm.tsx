import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertCircle, IconLoader } from "@tabler/icons-react";
import { type ReactElement } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAppModalContent, setAppModalOpen } from "@/features/app/appSlice";
import { useRegisterMutation } from "@/features/auth/authApiSlice";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
  isFetchBaseQueryErrorWithMessage,
} from "@/utils/helpers";
import {
  ALLOWED_CHARS_PATTERN,
  LOWERCASE_PATTERN,
  UPPERCASE_PATTERN,
} from "@/utils/regex";

const schema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Cannot be empty" })
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, { message: "Cannot be empty" })
      .min(8, "At least 8 characters long")
      .regex(
        ALLOWED_CHARS_PATTERN,
        "Only letters, numbers or any of ! @ # $ % ^ & *"
      )
      .regex(LOWERCASE_PATTERN, "At least 1 lowercase character")
      .regex(UPPERCASE_PATTERN, "At least 1 uppercase character"),
    confirmPassword: z.string().min(1, { message: "Cannot be empty" }),
    name: z.string().min(1, { message: "Cannot be empty" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type FormData = z.infer<typeof schema>;

function RegisterForm(): ReactElement {
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

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
      const { user } = await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
      }).unwrap();
      // TODO Open registration success modal
      reset();
      dispatch(
        setAppModalContent({
          title: `Welcome to ShopLister.app, ${user.name}`,
          message: `Registration with ${user.email} was successful! Proceed to login with your new account.`,
          actionTitle: "Proceed",
          actionHref: "/auth/login",
        })
      );
      dispatch(setAppModalOpen(true));
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
          title: "Unable to register",
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
        <div id="nameInput" className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="name"
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect="off"
            disabled={isLoading}
            {...register("name")}
          />
          <p
            id="nameErrors"
            className="flex flex-row justify-end gap-1 text-xs text-red-600"
          >
            {errors.name !== undefined ? errors.name.message : ""}
            <IconAlertCircle
              className={`h-4 w-4 ${
                errors.name === undefined ? "opacity-0" : "opacity-100"
              }`}
            />
          </p>
        </div>
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
            placeholder="Enter a password"
            type="password"
            autoCapitalize="none"
            autoComplete="none"
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
        <div id="confirmPasswordInput" className="grid gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            placeholder="Enter the password again"
            type="password"
            autoCapitalize="none"
            autoComplete="none"
            autoCorrect="off"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          <p
            id="confirmPasswordErrors"
            className="flex flex-row justify-end gap-1 text-xs text-red-600"
          >
            {errors.confirmPassword !== undefined
              ? errors.confirmPassword.message
              : ""}
            <IconAlertCircle
              className={`h-4 w-4 ${
                errors.confirmPassword === undefined
                  ? "opacity-0"
                  : "opacity-100"
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
          Register
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
