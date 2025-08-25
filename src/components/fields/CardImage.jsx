import { cn } from "@/lib/utils";
import { ComponentSlotImage } from "@/pages/Dashboard/component/ryu";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card as ShadcnCard } from "../ui/card";

const CardImage = ({
  image,
  title,
  description,
  footer,
  className,
  ...props
}) => {
  return (
    <ShadcnCard className={cn("rounded-md h-fit", className)} {...props}>
      <CardHeader className="p-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full aspect-[16/9] object-cover"
          />
        ) : (
          <ComponentSlotImage containerClassName="w-full aspect-[16/9] object-cover rounded-b-none" />
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="line-clamp-2">{description}</CardDescription>}
        </div>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </ShadcnCard>
  )
}

export default CardImage;
