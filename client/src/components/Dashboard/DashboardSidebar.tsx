import {
  IconAlertTriangle,
  IconCircle,
  IconLoader,
  IconPlus,
  IconReload,
} from "@tabler/icons-react";
import { type ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetListsQuery } from "@/features/lists/listsApiSlice";
import useAuth from "@/hooks/useAuth";

function DashboardSidebar(): ReactElement {
  const { email } = useAuth();
  const {
    data: lists,
    isFetching,
    isError,
    isSuccess,
  } = useGetListsQuery(
    { email },
    {
      pollingInterval: 30000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let listButton, listContent;

  if (isFetching && lists === undefined) {
    listButton = null;
    listContent = (
      <div className="flex w-full flex-col items-center justify-center text-sm">
        <IconLoader className="h-4 w-4 animate-spin" />
        <span className="text-xs text-muted-foreground">Please wait</span>
      </div>
    );
  }

  if (isError) {
    listButton = (
      <Button
        variant="outline"
        size={null}
        className="group/add-list gap-x-1 px-2 transition"
      >
        <span className="hidden text-xs group-hover/add-list:flex">Reload</span>
        <IconAlertTriangle className="flex h-3 w-3 animate-pulse group-hover/add-list:hidden" />
        <IconReload className="hidden h-3 w-3 animate-spin ease-in-out group-hover/add-list:flex" />
      </Button>
    );
    listContent = (
      <div className="flex w-full flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">{`Couldn't load your lists`}</span>
      </div>
    );
  }

  if (isSuccess) {
    listButton = (
      <Button
        variant="outline"
        size={null}
        className="group/add-list gap-x-1 px-2 transition"
      >
        <span className="hidden text-xs group-hover/add-list:flex">Add</span>
        <IconPlus className="h-3 w-3" />
      </Button>
    );
    listContent = (
      <ScrollArea className="h-[300px]">
        <div className="space-y-1">
          {lists.ids.map((id) => (
            <NavLink key={id} to={`/dashboard/lists/${id}`}>
              {({ isActive, isPending }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  <IconCircle className="mr-2 h-2 w-2" />
                  {lists.entities[id]?.name}
                </Button>
              )}
            </NavLink>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="space-y-4 py-4 pb-12">
      <div id="sidebar-section" className="px-4 py-2">
        <div
          id="sidebar-section-header"
          className="mb-2 flex flex-row justify-between"
        >
          <NavLink id="sidebar-section-header-label" to="/dashboard/lists" end>
            <Button variant="link" size={null}>
              <h2 className="px-2 text-lg font-semibold tracking-tight">
                Lists
              </h2>
            </Button>
          </NavLink>
          {listButton}
        </div>
        {listContent}
      </div>
    </div>
  );
}

export default DashboardSidebar;
