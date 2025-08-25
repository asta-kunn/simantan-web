import { forwardRef } from "react";
import { Input } from "@/components/ui/input";

// Destructure props dan pasangkan ref langsung ke elemen <input>
const InputText = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={`${className}`}
      {...props}
    />
  );
});


export { InputText };
