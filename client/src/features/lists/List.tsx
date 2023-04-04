import { type ReactElement } from "react";
import { selectListsById } from "./listsApiSlice";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { type EntityId } from "@reduxjs/toolkit";

function List({ listId }: { listId: EntityId }): ReactElement {
  const list = useAppSelector((state) => selectListsById(state, listId));

  const navigate = useNavigate();

  if (list !== undefined) {
    const handleEdit = (): void => {
      navigate(`/dashboard/lists/${listId}`);
    };

    return (
      <div onClick={handleEdit}>
        {list.name}
        {list.details !== undefined ? ` ${list.details}` : null}
      </div>
    );
  }

  return <></>;
}

export default List;
