import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./authApiSlice";
import { useRef, type ReactElement } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ALLOWED_CHARS_PATTERN,
  LOWERCASE_PATTERN,
  UPPERCASE_PATTERN,
} from "../../utils/regex";
import { IconExclamationCircle } from "@tabler/icons-react";

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

function Register(): ReactElement {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const modalRef = useRef(null);

  const {
    register,
    handleSubmit,
    setError,
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
      console.log(user);
    } catch (e: any) {
      setError("root", { message: e.data.message });
      window.HSOverlay.open(modalRef.current);
    }
  };

  return (
    <main className="flex h-screen items-center bg-gray-100 py-16 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-md p-6">
        <div
          id="card"
          className="mt-7 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="p-4 sm:p-7">
            <div id="cardTitle" className="text-center">
              <h1
                id="title"
                className="block text-2xl font-bold text-gray-800 dark:text-white"
              >
                {`Join ShopLister`}
              </h1>
              <p
                id="subtitle"
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              >
                {`Already have an account? `}
                <a
                  className="cursor-pointer font-medium text-blue-600 decoration-2 hover:underline"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  {`Log in here`}
                </a>
              </p>
            </div>

            <div id="cardContent" className="mt-5">
              <form
                id="registerForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSubmit(onSubmit)();
                }}
              >
                <div className="grid gap-y-4">
                  <div id="nameGroup">
                    <label
                      id="nameLabel"
                      htmlFor="name"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Name
                    </label>
                    <div id="nameInputGroup" className="relative">
                      <input
                        id="nameInput"
                        type="name"
                        className="block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        aria-describedby="name-error"
                        aria-invalid={
                          errors.email !== undefined ? "true" : "false"
                        }
                        {...register("name")}
                      />
                      <div
                        id="nameErrorIcon"
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {errors.name !== undefined ? (
                          <IconExclamationCircle size={20} />
                        ) : null}
                      </div>
                    </div>
                    {errors.name !== undefined ? (
                      <p id="nameErrors" className="mt-2 text-xs text-red-600">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </div>

                  <div id="emailGroup">
                    <label
                      id="emailLabel"
                      htmlFor="email"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Email address
                    </label>
                    <div id="emailInputGroup" className="relative">
                      <input
                        id="emailInput"
                        type="email"
                        className="block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        aria-describedby="email-error"
                        aria-invalid={
                          errors.email !== undefined ? "true" : "false"
                        }
                        {...register("email")}
                      />
                      <div
                        id="emailErrorIcon"
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {errors.email !== undefined ? (
                          <IconExclamationCircle size={20} />
                        ) : null}
                      </div>
                    </div>
                    {errors.email !== undefined ? (
                      <p id="emailErrors" className="mt-2 text-xs text-red-600">
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div id="passwordGroup">
                    <label
                      id="passwordLabel"
                      htmlFor="password"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Password
                    </label>

                    <div id="passwordInputGroup" className="relative">
                      <input
                        id="passwordInput"
                        type="password"
                        className="block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        aria-describedby="password-error"
                        aria-invalid={
                          errors.password !== undefined ? "true" : "false"
                        }
                        {...register("password")}
                      />
                      {errors.password !== undefined ? (
                        <div
                          id="passwordErrorIcon"
                          className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <IconExclamationCircle size={20} />
                        </div>
                      ) : null}
                    </div>
                    {errors.password !== undefined ? (
                      <p
                        id="passwordErrors"
                        className="mt-2 text-xs text-red-600"
                      >
                        {errors.password.message}
                      </p>
                    ) : null}
                  </div>

                  <div id="confirmPasswordGroup">
                    <label
                      id="confirmPasswordLabel"
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Confirm Password
                    </label>

                    <div id="confirmPasswordInputGroup" className="relative">
                      <input
                        id="confirmPasswordInput"
                        type="password"
                        className="block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        aria-describedby="confirm-password-error"
                        aria-invalid={
                          errors.confirmPassword !== undefined
                            ? "true"
                            : "false"
                        }
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword !== undefined ? (
                        <div
                          id="confirmPasswordErrorIcon"
                          className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <IconExclamationCircle size={20} />
                        </div>
                      ) : null}
                    </div>
                    {errors.confirmPassword !== undefined ? (
                      <p
                        id="confirmPasswordErrors"
                        className="mt-2 text-xs text-red-600"
                      >
                        {errors.confirmPassword.message}
                      </p>
                    ) : null}
                  </div>

                  <button
                    id="submitButton"
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                          role="status"
                          aria-label="loading"
                        ></span>
                        Loading
                      </>
                    ) : (
                      "Log in"
                    )}
                  </button>

                  <div
                    id="hs-error-modal"
                    ref={modalRef}
                    className="hs-overlay fixed left-0 top-0 z-[60] hidden h-full w-full overflow-y-auto overflow-x-hidden"
                  >
                    <div className="m-3 mt-0 flex min-h-[calc(100%-3.5rem)] items-center justify-center opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 sm:mx-auto sm:w-full sm:max-w-lg">
                      <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
                        <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
                          <h3 className="font-bold text-gray-800 dark:text-white">
                            Problem encountered
                          </h3>
                          <button
                            type="button"
                            className="hs-dropdown-toggle inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-500 transition-all hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                            data-hs-overlay="#hs-error-modal"
                          >
                            <span className="sr-only">Close</span>
                            <svg
                              className="h-3.5 w-3.5"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="overflow-y-auto p-4">
                          <p className="text-gray-800 dark:text-gray-400">
                            {errors.root?.message}
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-x-2 border-t px-4 py-3 dark:border-gray-700">
                          <button
                            type="button"
                            className="hs-dropdown-toggle inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-3 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
                            data-hs-overlay="#hs-error-modal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
