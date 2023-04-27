import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { resetAppModalContent, setAppModalOpen } from "@/features/app/appSlice";

function AppModal(): ReactElement {
  const dispatch = useAppDispatch();
  const { appModalOpen, appModalContent } = useAppSelector(
    (state) => state.app
  );

  const navigate = useNavigate();

  return (
    <AlertDialog
      open={appModalOpen}
      onOpenChange={(open) => dispatch(setAppModalOpen(open))}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{appModalContent.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {appModalContent.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => dispatch(resetAppModalContent())}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              dispatch(resetAppModalContent());
              if (appModalContent.actionHref !== undefined) {
                navigate(appModalContent.actionHref);
              }
            }}
          >
            {appModalContent.actionTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AppModal;
