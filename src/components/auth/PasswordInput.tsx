"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Cs_PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [cs_visible, cs_setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={cs_visible ? "text" : "password"} className="pr-10" />
      <button
        type="button"
        onClick={() => cs_setVisible((value) => !value)}
        aria-label={cs_visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
      >
        {cs_visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
