"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function Cs_ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = true,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<boolean>;
  destructive?: boolean;
}) {
  const [cs_open, cs_setOpen] = useState(false);
  const [cs_busy, cs_setBusy] = useState(false);

  // run action, close on success
  const cs_handleConfirm = async () => {
    cs_setBusy(true);
    const cs_done = await onConfirm();
    cs_setBusy(false);
    if (cs_done) cs_setOpen(false);
  };

  return (
    <AlertDialog open={cs_open} onOpenChange={(open) => !cs_busy && cs_setOpen(open)}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cs_busy}>Keep it</AlertDialogCancel>
          <Button variant={destructive ? "destructive" : "default"} onClick={cs_handleConfirm} disabled={cs_busy}>
            {cs_busy ? "Working..." : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
