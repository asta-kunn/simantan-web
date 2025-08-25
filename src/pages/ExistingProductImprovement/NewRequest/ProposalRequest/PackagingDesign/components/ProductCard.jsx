import React from "react";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ProductCard = ({ 
  product, 
  isExpanded, 
  manufacturerData, 
  checkedItems, 
  onToggleExpand,
  onRemove, 
  onCheckboxChange 
}) => {
  return (
    <div className="border rounded-md bg-white shadow-sm overflow-hidden">
      {/* Product Header */}
      <div
        className={cn(
          "flex items-center justify-between p-3 cursor-pointer",
          isExpanded
            ? "bg-blue-50 text-blue-700"
            : "bg-gray-50 text-gray-700"
        )}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2">
          {isExpanded
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
          }
          <span className="font-medium">{product}</span>
        </div>
        <Trash2
          onClick={onRemove}
          className="w-5 h-5 text-primary-normal hover:text--primary-normal"
        />
      </div>

      {/* Product Expandable Content */}
      {isExpanded && (
        <div className="p-4 border-t h-[400px] overflow-y-auto">
          {/* Manufacturers and their packaging types */}
          {Object.entries(manufacturerData).map(([manufacturer, items]) => (
            <div key={manufacturer} className="mb-5 last:mb-0">
              <div className="bg-gray-100 p-3 rounded-md">
                <h3 className="font-bold text-gray-800 mb-3">{manufacturer}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Checkbox 
                        id={`${product}-${item.id}`}
                        checked={checkedItems[`${product}-${item.id}`] || false}
                        onCheckedChange={() => onCheckboxChange(product, item.id)}
                        className="h-5 w-5 rounded-sm border-gray-300"
                      />
                      <label 
                        htmlFor={`${product}-${item.id}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard; 