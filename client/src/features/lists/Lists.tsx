import { type ReactElement } from "react";
import { useGetListsQuery } from "./listsApiSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import List from "./List";

function Lists(): ReactElement {
  const {
    data: lists,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useGetListsQuery(skipToken);

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    if ("status" in error) {
      const errMessage =
        "error" in error ? error.error : JSON.stringify(error.data);
      content = (
        <div>
          <div>An error has occurred:</div>
          <div>{errMessage}</div>
        </div>
      );
    } else {
      content = <div>{error.message}</div>;
    }
  }

  if (isSuccess) {
    const { ids } = lists;

    const tableContent =
      ids.length > 0
        ? ids.map((listId) => <List key={listId} listId={listId} />)
        : null;
    content = <div>{tableContent}</div>;
  }

  return <div>{content}</div>;
}

export default Lists;
