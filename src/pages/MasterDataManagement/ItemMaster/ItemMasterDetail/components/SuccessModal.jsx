import { Info, Divider } from "@/components/Dexain";
import { memo } from "react";
// Confirmation modal content component
export const SuccessModal = memo(({ successData }) => (
  <div className="bg-slate-100 p-4 rounded-lg max-h-[30vh] overflow-y-auto">
    <div className="grid grid-cols-1 gap-4">
      {/* Info standar */}
      <Info label="Finished Product Description" value={successData.ITEM_MASTER_DESCRIPTION} />
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-rows gap-4">
          <Info label="NIE/MA Holder" value={successData.MARKETING_AUTHORIZATION_HOLDER} />
          <Info label="Country" value={successData.COUNTRY} />
        </div>
        <Info
          className="font-medium text-gray-600"
          label="Manufacturing Site"
          value={
            <ul className="list-disc list-inside pl-2 mt-1">
              {successData.MANUFACTURING_SITE.map((site, index) => (
                <li key={index} className="text-md text-gray-800">
                  {site}
                </li>
              ))}
            </ul>
          }
        />
      </div>
      <Divider />
      {/* Active Ingredients sebagai daftar bullet points */}
      <div>
        <Info
          className="font-medium text-gray-600"
          label="Active Ingredients"
          value={
            <ul className="list-disc list-inside pl-2 mt-1">
              {successData.ACTIVE_INGREDIENTS.map((ingredient, index) => (
                <li key={index} className="text-md text-gray-800">
                  {ingredient}
                </li>
              ))}
            </ul>
          }
        />
      </div>
    </div>
  </div>
));
