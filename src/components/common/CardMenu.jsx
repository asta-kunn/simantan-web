import { memo } from "react";

import { Badge } from "@/components/fields/Badge";
import { Card } from "@/components/ui/card";

export const CardMenu = memo(
  ({
    title,
    onClick,
    icon,
    totalTask,
    badgeClassName = "bg-warning-normal text-white",
  }) => {
    return (
      <Card
        className="bg-white rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-500 h-32 hover:border-primary-normal hover:bg-gray-100"
        onClick={onClick}
      >
        <div className="p-6 space-y-2">
          <div className="flex items-start gap-0">
            <div className="w-1/2 flex justify-start">
              <div className="text-primary-normal">{icon}</div>
            </div>
            {totalTask !== undefined && totalTask > 0 ? (
              <div className="w-full flex justify-end">
                <Badge variant="outline" className={badgeClassName}>
                  {totalTask} Task(s) Need Action
                </Badge>
              </div>
            ) : null}
          </div>
          <div className="flex">
            <b className="font-semibold text-gray-900 mb-2">{title}</b>
          </div>
        </div>
      </Card>
    );
  }
);
