import { cn } from "@/lib/utils";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/fields/Button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as ShadcnCard,
} from "../ui/card";

export const Card = memo(
  ({
    children,
    title,
    description,
    headerActionElement,
    buttonLabel = "Label",
    buttonIcon: ButtonIcon = PlusIcon,
    text = "Action",
    footer = null,
    className,
    ...props
  }) => {
    const renderHeaderAction = () => {
      switch (headerActionElement) {
        case "text":
          return (
            <a href="#" className="font-bold text-sm text-primary-normal">
              {text}
            </a>
          );
        case "button":
          return (
            <Button size={buttonLabel ? "default" : "icon"}>
              <ButtonIcon className={buttonLabel ? "mr-2" : ""} />
              {buttonLabel && buttonLabel}
            </Button>
          );
        case "more":
          return <MoreVerticalIcon className="w-4 h-4 text-muted-foreground" />;
        default:
          return null;
      }
    };

    return (
      <ShadcnCard className={cn("rounded-md", className)} {...props}>
        {(title || description) && (
          <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-dashed border-gray-300">
            <div className="space-y-1.5">
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {renderHeaderAction()}
          </CardHeader>
        )}

        <CardContent className="p-4">{children}</CardContent>

        {footer && <CardFooter className="px-4">{footer}</CardFooter>}
      </ShadcnCard>
    );
  }
);
