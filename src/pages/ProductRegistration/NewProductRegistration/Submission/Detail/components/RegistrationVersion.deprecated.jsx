import { Separator } from "@/components/Dexain";
import { useFile } from "@/hooks/file/useFile";
import { useUIStore } from "@/stores/uiStore";
import { FileSearch } from "lucide-react";
import { Fragment } from "react";
import { projectTaskCode } from "../../../constants/general";
import LetterCard from "./LetterCard";

const RegistrationVersion = ({ marketingAuthorizations = [] }) => {
  const { addStack } = useUIStore();
  const { previewFile } = useFile();

  const handleOpenSheet = (marketingAuthorization) => {
    addStack({
      type: "sheet",
      size: "2xl",
      title: <b>Product Registration Details</b>,
      description: `${marketingAuthorization.FINISHED_PRODUCT_DESCRIPTION} (V.${marketingAuthorization.VERSION})`,
      content: (
        <LetterCard
          taskCode={projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT}
          data={marketingAuthorization}
          actions={{ onOpenFile: previewFile }}
          previewVersion
        />
      )
    });
  }

  if (marketingAuthorizations.length === 0) return (
    <div className="border rounded-lg p-4 mx-4 mb-4">
      <p className="text-center text-gray-500">No registration version found</p>
    </div>
  );

  return (
    <div className="p-4">
      {marketingAuthorizations.map(
        (item, i) => (
          <Fragment key={item.VERSION}>
            {i > 0 && <Separator className="my-3" />}
            <div className="flex items-center w-full gap-4">
              <div
                className="flex items-center gap-3 text-primary-normal hover:underline cursor-pointer"
                onClick={() => handleOpenSheet(item)}
              >
                <FileSearch className="size-5" />
                <p className="font-bold">V.{item.VERSION}</p>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 font-semibold text-lg">
                <p>{item.NIE_MA_NO}</p>
                <p>{item.REGULATORY_PRODUCT_CATEGORY}</p>
              </div>
            </div>
          </Fragment>
        )
      )}
    </div>
  );
};

export default RegistrationVersion;