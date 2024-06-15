import { FC, ReactNode, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/shadcn/ui/tooltip";

interface Props {
  children: ReactNode;
  tooltip?: string;
  disabled?: boolean;
}

const ToolTip: FC<Props> = ({ children, tooltip, disabled }): JSX.Element => {
  if(disabled){
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTip;