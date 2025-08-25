import React from "react";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Import Testing Tools */
import { createTestIdProps } from "@/lib/utils";

export const TableActions = ({
  row,
  actions,
  actionType,
  actionVariant,
  actionButtonVariant,
  openPopoverIds,
  setOpenPopoverIds,
  handleActionClick,
  bodySize = "md",
}) => {
  const iconSizeClass =
    bodySize === "sm"
      ? "w-3 h-3 text-xs"
      : bodySize === "lg"
        ? "w-6 h-6 text-lg"
        : "w-5 h-5 text-base";

  if (actionType === "dots") {
    return (
      <div className="flex justify-end z-[100]">
        <Popover
          open={openPopoverIds[row.id]}
          onOpenChange={(open) => {
            setOpenPopoverIds((prev) => ({
              ...prev,
              [row.id]: open,
            }));
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={`h-6 w-6 p-0 ${iconSizeClass}`}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className={iconSizeClass} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            className="w-32 p-1"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-0.5">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm px-2 py-1 h-8 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(action, row.original, row.id);
                  }}
                >
                  {action.icon && <span>{React.cloneElement(action.icon, { className: iconSizeClass })}</span>}
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  } else if (actionType === "button" && actions.length > 0) {
    return (
      <div className="flex gap-1 justify-center items-center h-full">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            variant={action.buttonVariant || 'outline'}
            className="rounded-sm text-sm px-2 py-1 h-8 flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              handleActionClick(action, row.original, row.id);
            }}
            {...createTestIdProps(`table_action_${idx}`)}
          >
            {actionVariant === "icon"
              ? (action.icon
                ? React.cloneElement(action.icon, { className: iconSizeClass })
                : <Eye className={iconSizeClass} />)
              : <>
                {action.icon && <span>{React.cloneElement(action.icon, { className: iconSizeClass })}</span>}
                <span>{action.label}</span>
              </>
            }
          </Button>
        ))}
      </div>
    );
  }
  return null;
}; 