import React, { memo, useState, useEffect } from "react";

// Utils
import { cn } from "@/lib/utils";

export const ImagePreview = memo(({ blob, className }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!blob) {
      setPreviewUrl(null);
      return;
    }

    // Create object URL for the blob
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    // Clean up by revoking object URL when component unmounts
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  if (!previewUrl) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      <img
        src={previewUrl}
        alt="Preview"
        className="max-w-full h-auto rounded-lg"
      />
    </div>
  );
});