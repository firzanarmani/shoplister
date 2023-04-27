import { IconCircle, IconMenu2 } from "@tabler/icons-react";
import { type ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { setMobileMenuOpen } from "@/features/app/appSlice";

function MobileNav(): ReactElement {
  const dispatch = useAppDispatch();
  const { mobileMenuOpen } = useAppSelector((state) => state.app);

  return (
    <Sheet
      open={mobileMenuOpen}
      onOpenChange={(open) => dispatch(setMobileMenuOpen(open))}
    >
      <SheetTrigger>
        <Button size={null} variant="ghost" className="block lg:hidden">
          <IconMenu2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent position="top" className="">
        <SheetHeader>
          <SheetTitle>ShopLister.app</SheetTitle>
          <SheetDescription>
            <div className="space-y-4 py-4">
              {/* Section 1 */}
              <div id="sidebar-section" className="px-4 py-2">
                <div id="sidebar-section-header" className="mb-2">
                  <h2
                    id="sidebar-section-header-label"
                    className="px-2 text-lg font-semibold tracking-tight"
                  >
                    Lists
                  </h2>
                </div>
                <div id="sidebar-section-content" className="space-y-1">
                  <NavLink to="/dashboard/lists/">
                    {({ isActive, isPending }) => (
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                      >
                        <IconCircle className="mr-2 h-2 w-2" />
                        Listen Now
                      </Button>
                    )}
                  </NavLink>
                </div>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
