import React, { useState, useEffect } from "react";
import { Plus, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/Dexain";
import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";

const ProductSelectionCard = ({
  selectedProducts,
  setSelectedProducts,
  manufacturerData,
  checkedItems,
  onCheckboxChange
}) => {
  // State for expanded products
  const [expandedProducts, setExpandedProducts] = useState(
    selectedProducts.reduce((acc, product) => {
      acc[product] = true; // Start with all products expanded
      return acc;
    }, {})
  );

  // State for product selection dropdown
  const [currentProductSelection, setCurrentProductSelection] = useState("");

  // Sample data for all available products
  const allProductOptions = [
    "A-1234-00 Candesartan 8mg",
    "A-1235-00 Candesartan 16mg",
    "B-5678-00 Paracetamol 500mg",
    "C-9101-00 Amoxicillin 500mg"
  ];

  // Available product options (excluding already selected ones)
  const availableProductOptions = allProductOptions.filter(
    product => !selectedProducts.includes(product)
  );

  // Reset product selection when available options change
  useEffect(() => {
    // If current selection is no longer in available options, reset it
    if (currentProductSelection && !availableProductOptions.includes(currentProductSelection)) {
      setCurrentProductSelection("");
    }
  }, [availableProductOptions, currentProductSelection]);

  const handleToggleExpand = (product) => {
    setExpandedProducts(prev => ({
      ...prev,
      [product]: !prev[product]
    }));
  };

  const handleRemoveProduct = (product, e) => {
    e.stopPropagation();
    // Remove the product from selectedProducts
    setSelectedProducts(selectedProducts.filter(id => id !== product));

    // Clean up expanded state
    const newExpandedState = { ...expandedProducts };
    delete newExpandedState[product];
    setExpandedProducts(newExpandedState);
  };

  // Add product to selection
  const handleAddProduct = () => {
    if (!currentProductSelection) return;

    // Add product to state with initial expanded state (true)
    setSelectedProducts([...selectedProducts, currentProductSelection]);
    setExpandedProducts(prev => ({
      ...prev,
      [currentProductSelection]: true
    }));

    // Reset selection
    setCurrentProductSelection("");
  };

  return (
    <div className="flex flex-col">
      {/* Fixed height container with scroll */}
      <div className="h-[450px] overflow-y-auto pr-2">
        <div className="flex flex-col gap-4">
          {selectedProducts.map((product) => (
            <ProductCard
              key={product}
              product={product}
              isExpanded={expandedProducts[product]}
              manufacturerData={manufacturerData}
              checkedItems={checkedItems}
              onToggleExpand={() => handleToggleExpand(product)}
              onRemove={(e) => handleRemoveProduct(product, e)}
              onCheckboxChange={onCheckboxChange}
            />
          ))}

          {selectedProducts.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No products added. Please select a product and click Add.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionCard; 