import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

function Public(): ReactElement {
  const navigate = useNavigate();

  return (
    <main className="flex h-screen items-center bg-gray-100 py-16 dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-md justify-center p-6">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          onClick={() => {
            navigate("/login");
          }}
        >
          Log in
        </button>
      </div>
    </main>
  );
}

export default Public;
