import { Info, Button, Skeleton, Table, Separator, Badge } from "@/components/Dexain";
import { Download, FileText, NotepadText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getFileName } from "@/lib/utils";
import { useFile } from "@/hooks/file/useFile";
import { useGetMarketingAuthorizationDatabaseDetail } from "../../hooks/useMarketingAuthorizationDatabase";


export const ProductRegistrationDetails = ({ version, description, accessData }) => {
  const { downloadFile, previewFile } = useFile();
  const { data, isLoading, error, isValidVersion } = useGetMarketingAuthorizationDatabaseDetail(version, description);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error || !isValidVersion) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load data</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between gap-4">
          <Info
            label="MA Document"
            labelClassName="text-md font-semibold"
            value={
              <div className="flex flex-row items-center">
                <FileText color="#B32017" />
                <span className="p-3">{data.MARKETING_AUTHORIZATION_FILE ? getFileName(data.MARKETING_AUTHORIZATION_FILE) : "No Attachment File"}</span>
              </div>
            }
          />

          {data.MARKETING_AUTHORIZATION_FILE && (
            <div className="flex gap-2">
              {accessData?.CAN_DOWNLOAD == "Y" && (
                <Button variant="outline" onClick={() => previewFile(data.MARKETING_AUTHORIZATION_FILE)}>
                  <Download color="#B32017" />
                  View & Download
                </Button>
              )}
            </div>
          )}
        </div>
        {/* Finished Product Description */}
        <Separator className="col-span-full" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <Info label="Finished Product" value={data.FINISHED_PRODUCT_DESCRIPTION || "-"} />
            <Info label="NIE/MA Product Name" value={data.REGISTRATION_PRODUCT_NAME || "-"} />
            <Info label="MA Reference CPP" value={data.MA_REFERENCE_CPP || "-"} />
            <Info
              label="Active Ingredients"
              value={
                Array.isArray(data?.ACTIVE_INGREDIENTS) && data.ACTIVE_INGREDIENTS.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {data.ACTIVE_INGREDIENTS.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-md font-semibold">-</span>
                )
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Info label="Category Development" value={data.DEVELOPMENT_CATEGORY || "-"} />
            <Info label="Manufacturing Site" value={data.MANUFACTURING_SITE || "-"} />
            <Info label="NIE/MA Holder" value={data.NIE_MA_HOLDER || "-"} />
            <Info label="RA Agent" value={data.RA_AGENT || "-"} />
            <Info label="Distributor" value={data.DISTRIBUTOR || "-"} />
            <Info label="Approval Type" value={data.APPROVAL_TYPE || "-"} />
            <Info label="NIE/MA No" value={data.NIE_MA_NO || "-"} />
            <Info label="Infotehna Doc No" value={data.INFOTEHNA_DOC_NO || "-"} />
            <Info label="PCF No" value={data.PCF_NO || "-"} />
            <Info label="Dossier No" value={data.DOSSIER_NUMBER || "-"} />
          </div>
        </div>

        <Separator className="col-span-full" />
        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-6">
          <Info label="Regulatory Product Category" value={data.REGULATORY_PRODUCT_CATEGORY || "-"} />
          <Info label="Regulatory Dosage Form" value={data.REGULATORY_DOSAGE_FORM || "-"} />
          <Info label="Regulatory Pack Size" value={data.REGULATORY_PACK_SIZE || "-"} />
          <Info label="Regulatory Shelf Life" value={data.REGULATORY_SHELF_LIFE || "-"} />
        </div>
        <Separator className="col-span-full" />
        <div className="grid grid-row-2 gap-6">
          <div>
            <Info label="Initial Registration Date" value={formatDate(data.INITIAL_REGISTRATION_DATE, "DD MMMM YYYY") || "-"} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            {" "}
            <Info label="NIE/MA Approval Date" value={formatDate(data.NIE_MA_APPROVAL_DATE, "DD MMMM YYYY") || "-"} />
            <Info label="NIE/MA Expiry Date" value={formatDate(data.NIE_MA_EXPIRY_DATE, "DD MMMM YYYY") || "-"} />
          </div>
        </div>
        <Separator className="col-span-full" />
        <div className="text-md text-gray-600">
          <Info
            label="Additional Commitment"
            value={
              <div className="text-md">
                <div className="border rounded-md overflow-hidden font-normal">
                  {Array.isArray(data?.ADDITIONAL_COMMITMENTS) && data.ADDITIONAL_COMMITMENTS.length > 0 ? (
                    data.ADDITIONAL_COMMITMENTS.map((item, index) => (
                      <div key={index} className="grid grid-cols-[2fr_1fr_auto] items-center border-t first:border-t-0">
                        <div className="px-4 py-1 border-r break-words whitespace-normal ">{item.COMMITMENT_TYPE}</div>
                        <div className="px-4 py-1 border-r whitespace-nowrap ">{formatDate(item.DUE_DATE, "DD MMMM YYYY") || "-"}</div>
                        <div className="px-6 py-1 flex items-center justify-center">
                          <Badge color={item.STATUS === "Open" ? "danger" : "info"} variant="soft">
                            <span className="text-md">{item.STATUS}</span>
                          </Badge>

                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-md text-gray-500">No additional commitments found.</div>
                  )}
                </div>
              </div>
            }
          />
        </div>

        {/* Remarks Section */}
        <div className="grid grid-cols-1 gap-6 pl-2 w-full">
          <Info
            label="Remarks"
            value={
              <div className="flex flex-row items-center p-2 rounded w-full">
                <NotepadText color="#D2DEEB" />
                <span className="p-3">{data.REMARK || "No remarks available"}</span>
              </div>
            }
          />
        </div>
      </div>
      <Separator className="col-span-full" />
    </>
  );
};
