import { type ReactElement } from "react";

function Inbox(): ReactElement {
  const content = (
    <div className="grid w-full animate-pulse gap-3 px-6 py-4 md:flex md:items-center md:justify-between">
      <div className="h-7 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
      <div className="inline-flex h-[38px] w-[150px] items-center justify-center gap-2 rounded-md border border-transparent bg-gray-200 px-3 py-2 text-sm dark:bg-gray-700"></div>
    </div>
  );

  return (
    <>
      <div className="mx-auto max-w-[85rem] p-4 sm:px-6 lg:p-4">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              {content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inbox;
