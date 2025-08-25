import React from "react";
import { Card as ShadcnCard, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CardDescription = ({ 
  className, 
  cardDescriptionTitle, 
  item = [], 
  product,
  sites = []
}) => (
  <ShadcnCard className={cn("bg-white border rounded-lg shadow", className)}>
    <CardContent className="p-4">
      <div className="font-bold text-xl mb-2 text-gray-800">{cardDescriptionTitle}</div>
      
      <div className="text-lg text-gray-700">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="font-medium">Manufacturing Site</div>
          <div className="font-medium">Packaging Material</div>
        </div>
        
        {sites.map((site, siteIndex) => {
          const isLastSite = siteIndex === sites.length - 1;
          return (
            <div 
              key={`site-${siteIndex}`} 
              className={cn(
                "grid grid-cols-2 gap-2",
                !isLastSite && "border-b border-gray-200 mb-2 pb-2"
              )}
            >
              <div className="py-2 flex items-start">
                {site.name}
              </div>
              <div className="py-2 flex flex-col gap-1">
                {site.materials && site.materials.map((material, materialIndex) => (
                  <div key={`material-${siteIndex}-${materialIndex}`}>
                    <span className="inline-block w-2 h-2 bg-black rounded-full mr-1 align-middle" />
                    {material}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </ShadcnCard>
);

export default CardDescription; 