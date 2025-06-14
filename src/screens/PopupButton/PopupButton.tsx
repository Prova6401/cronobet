import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";

export const PopupButton = (): JSX.Element => {
  return (
    <Button
      variant="link"
      className="inline-flex items-center gap-[3px] p-0 py-[13px] h-auto text-lg text-[#007aff] font-semibold"
    >
      <span className="[font-family:'SF_Pro-Semibold',Helvetica] leading-[18px]">
        Label
      </span>
      <ChevronDownIcon className="h-4 w-4" />
    </Button>
  );
};
