import { Badge, Info } from "@/components/Dexain";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, getFileName } from "@/lib/utils";
import dayjs from "dayjs";
import { Download, FileText } from "lucide-react";
import { Fragment } from "react";
import { projectTaskCode } from "../../../constants/general";

export const ViewDocumentButton = ({ fileUrl, action }) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <span className="p-2 aspect-square bg-white rounded-md text-primary-normal">
        <FileText className="size-4" />
      </span>
      <p className="text-lg text-black font-bold text-nowrap">{getFileName(typeof fileUrl === "string" ? fileUrl : "-")}</p>
    </div>
    <Button
      variant="outline"
      size="sm"
      disabled={typeof fileUrl !== "string" || !fileUrl}
      onClick={() => action(fileUrl)}
    >
      <Download className="size-4" />
      View & Download
    </Button>
  </div>
)

const LetterCard = ({ taskCode, data, actions = {}, className = "", previewVersion = false }) => {
  const labelsMap = {
    [projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT]: [
      { label: "AL Approval Date", value: data?.AL_APPROVAL_DATE ? dayjs(data?.AL_APPROVAL_DATE).format("D MMM YYYY") : "-" },
      { label: "AL Expiry Date", value: data?.AL_EXPIRY_DATE ? dayjs(data?.AL_EXPIRY_DATE).format("D MMM YYYY") : "-" },
    ],
    [projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT]: [
      { label: "NIE/MA Approval Date", value: data?.NIE_MA_APPROVAL_DATE ? dayjs(data?.NIE_MA_APPROVAL_DATE).format("D MMM YYYY") : "-" },
      { label: "NIE/MA Expiry Date", value: data?.NIE_MA_EXPIRY_DATE ? dayjs(data?.NIE_MA_EXPIRY_DATE).format("D MMM YYYY") : "-" },
    ],
  }

  return (
    <div className={cn("p-4 bg-gray-100 rounded-lg border max-w-3xl", className)}>
      {previewVersion ? (
        <div>
          <h4 className="text-lg font-semibold mb-2">Attachment</h4>
          {!data?.HPR_DOCUMENT && !data?.AL_DOCUMENT && !data?.NIE_DOCUMENT ? (
            <div className="bg-muted border p-4 rounded-lg w-full">
              <p className="text-lg text-center text-muted-foreground">No Attachment</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.HPR_DOCUMENT && <ViewDocumentButton fileUrl={data?.HPR_DOCUMENT} action={actions.onOpenFile} />}
              {data?.AL_DOCUMENT && <ViewDocumentButton fileUrl={data?.AL_DOCUMENT} action={actions.onOpenFile} />}
              {data?.NIE_DOCUMENT && <ViewDocumentButton fileUrl={data?.NIE_DOCUMENT} action={actions.onOpenFile} />}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h4 className="text-lg font-semibold mb-2">{taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "MA Document" : "AL Document"}</h4>
          <ViewDocumentButton fileUrl={data?.MARKETING_AUTHORIZATION_FILE} action={actions.onOpenFile} />
        </div>
      )}
      <Separator className="my-4" />
      <div aria-label="main-info-details" className="grid grid-cols-2 gap-4">
        {[
          { label: "Product Name", value: data?.FINISHED_PRODUCT_DESCRIPTION || "-", full: true },
          { label: taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "NIE/MA Product Name" : "AL Product Name", value: data?.REGISTRATION_PRODUCT_NAME || "-", full: true },
          { label: taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "MA Reference CPP" : "AL Reference CPP", value: data?.MA_REFERENCE_CPP || "-", full: true },
          { label: "Development Category", value: data?.DEVELOPMENT_CATEGORY || "-" },
          { label: "Manufacturing Site", value: data?.MANUFACTURING_SITE || "-" },
          { label: taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "NIE/MA Holder" : "AL Holder", value: data?.NIE_MA_HOLDER || "-" },
          { label: "RA Agent", value: data?.RA_AGENT || "-" },
          { label: "Distributor", value: data?.DISTRIBUTOR || "-" },
          { label: "Approval Type", value: data?.APPROVAL_TYPE || "-" },
          { label: taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "NIE/MA No" : "AL No", value: data?.NIE_MA_NO || "-" },
          { label: "Infotehna Doc No", value: data?.INFOTEHNA_DOC_NO || "-" },
          { label: "PCF No", value: data?.PCF_NO || "-" },
          { label: "Dossier No", value: data?.DOSSIER_NUMBER || "-" },
        ].map(({ label, value, full }) => (
          <Info key={label} label={label} value={value} containerClassName={full ? "col-span-full" : ""} />
        ))}
      </div>
      <Separator className="my-4" />
      <div aria-label="additional-info-details" className="grid grid-cols-2 gap-4">
        {[
          { label: "Regulatory Product Category", value: data?.REGULATORY_PRODUCT_CATEGORY || "-" },
          { label: "Regulatory Dosage Form", value: data?.REGULATORY_DOSAGE_FORM || "-" },
          { label: "Regulatory Pack Size", value: data?.REGULATORY_PACK_SIZE || "-" },
          { label: "Regulatory Shelf Life", value: data?.REGULATORY_SHELF_LIFE || "-" },
        ].map(({ label, value }) => (
          <Info key={label} label={label} value={value} />
        ))}
      </div>
      <Separator className="my-4" />
      <div aria-label="al-info-details" className="grid grid-cols-2 gap-4">
        <Info label="Initial Registration Date" value={data?.INITIAL_REGISTRATION_DATE ? dayjs(data?.INITIAL_REGISTRATION_DATE).format("D MMM YYYY") : "-"} containerClassName="col-span-full" />
        {labelsMap[taskCode]?.map(({ label, value, full }) => (
          <Info key={label} label={label} value={value} containerClassName={full ? "col-span-full" : ""} />
        ))}
      </div>
      {taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT &&
        data?.ADDITIONAL_COMMITMENTS?.filter(item => item.COMMITMENT_TYPE !== "NONE").length > 0 && (
          <Fragment key="additional-commitments">
            <Separator className="my-4" />
            <h4 className="text-base mb-2">Additional Commitments</h4>
            <table className="w-full border-collapse">
              <tbody className="bg-white">
                {data?.ADDITIONAL_COMMITMENTS
                  ?.map((item, index) => (
                    <tr key={index} className="text-black text-sm grid grid-cols-5 items-center">
                      <td className="p-2 border font-semibold h-10 flex items-center col-span-3">{item.COMMITMENT_TYPE}</td>
                      <td className="p-2 border font-semibold h-10 flex items-center col-span-1">{dayjs(item.DUE_DATE).format("D MMM YYYY")}</td>
                      <td className="p-2 border h-10 flex items-center justify-center col-span-1">
                        <Badge color={item.STATUS === "Open" ? "danger" : "info"} variant="soft">
                          {item.STATUS}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Fragment>
        )}
      <Separator className="my-4" />
      <div aria-label="remark-info-details" className="grid grid-cols-2 gap-4">
        <Info label="Remark" value={data?.REMARK || "-"} containerClassName="col-span-full" />
      </div>
    </div>
  )
}

export default LetterCard;