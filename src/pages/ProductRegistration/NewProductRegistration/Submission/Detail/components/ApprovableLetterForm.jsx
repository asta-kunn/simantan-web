import { Button, DatePicker, Form, Input, Select, Uploader } from "@/components/Dexain";
import { Separator } from "@/components/ui/separator";
import { useGetCommitmentTypes, useGetDevelopmentCategories, useGetMAHolders, useGetPharmaceuticalForms, useGetProductCategories } from "@/hooks/master-data/useMasterData";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { approvalTypes, projectTaskCode, shelfLifeOptions } from "../../../constants/general";

const AdditionalCommitmentsField = ({ options, isLoading }) => {
  const { control } = useFormContext();
  const fieldMethod = useFieldArray({
    control,
    name: "ADDITIONAL_COMMITMENTS",
  });

  return (
    <Fragment>
      <label className="text-base font-medium inline-block mb-1.5">Additional Commitments</label>
      <div className="p-4 bg-muted rounded-lg border border-border">
        <div className="grid grid-cols-12 gap-2 text-base font-medium">
          <div className="col-span-6">Commitment Type</div>
          <div className="col-span-3">Due Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Action</div>
        </div>
        {fieldMethod?.fields?.map((field, index) => {
          const isLastItem = fieldMethod?.fields?.length === 1;
          return (
            <div key={field.id} className="grid grid-cols-12 gap-x-2">
              <div className="col-span-6 mt-1.5">
                <Select
                  name={`ADDITIONAL_COMMITMENTS.${index}.COMMITMENT_TYPE`}
                  searchable
                  options={options}
                  disabled={isLoading}
                />
              </div>
              <div className="col-span-3">
                <DatePicker name={`ADDITIONAL_COMMITMENTS.${index}.DUE_DATE`} />
              </div>
              <div className="col-span-2 mt-1.5">
                <Select
                  name={`ADDITIONAL_COMMITMENTS.${index}.STATUS`}
                  options={[
                    { label: "Open", value: "Open" },
                    { label: "Close", value: "Close" },
                  ]}
                />
              </div>
              <div className="col-span-1 mx-auto mt-3">
                <Trash2
                  className={cn(
                    "size-5",
                    isLastItem
                      ? "cursor-not-allowed text-muted-foreground"
                      : "cursor-pointer text-danger-normal"
                  )}
                  onClick={() => {
                    if (!isLastItem) {
                      fieldMethod?.remove(index);
                    }
                  }}
                />
              </div>
            </div>
          )
        })}
        <Button
          className="mt-2"
          type="button"
          size="sm"
          variant="outline"
          color="primary"
          icon={<Plus className="size-4" />}
          onClick={() => fieldMethod?.append({
            COMMITMENT_TYPE: "NONE",
            DUE_DATE: null,
            STATUS: null,
          })}
        >
          Add More
        </Button>
      </div>
    </Fragment>
  );
};

const AdditionalDatePickers = ({ taskCode }) => {
  const { watch } = useFormContext();
  const alApprovalDate = watch("AL_APPROVAL_DATE") || null;
  const nieApprovalDate = watch("NIE_MA_APPROVAL_DATE") || null;

  return (
    <Fragment>
      {taskCode === projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT && (
        <div className="grid grid-cols-2 gap-3 col-span-2">
          <DatePicker
            name="AL_APPROVAL_DATE"
            label="AL Approval Date"
            required
            maxDate={dayjs().toDate()}
          />
          <DatePicker
            name="AL_EXPIRY_DATE"
            label="AL Expiry Date"
            required
            minDate={alApprovalDate}
            disabled={!alApprovalDate}
          />
        </div>
      )}
      {taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT && (
        <div className="grid grid-cols-2 gap-3 col-span-2">
          <DatePicker
            name="NIE_MA_APPROVAL_DATE"
            label="NIE/MA Approval Date"
            required
            maxDate={dayjs().toDate()}
          />
          <DatePicker
            name="NIE_MA_EXPIRY_DATE"
            label="NIE/MA Expiry Date"
            required
            minDate={nieApprovalDate}
            disabled={!nieApprovalDate}
          />
        </div>
      )}
    </Fragment>
  )
}

const ApprovableLetterForm = ({ taskCode, defaultValues, schema, submitHandler, actions }) => {
  const { maHolders, isLoading: isLoadingMAHolders } = useGetMAHolders();
  const { developmentCategories, isLoading: isLoadingDevelopmentCategories } = useGetDevelopmentCategories();
  const { pharmaceuticalForms, isLoading: isLoadingPharmaceuticalForms } = useGetPharmaceuticalForms();
  const { productCategories, isLoading: isLoadingProductCategories } = useGetProductCategories();
  const { commitmentTypes, isLoading: isLoadingCommitmentTypes } = useGetCommitmentTypes();

  const FormComponents = {
    AdditionalCommitments: ({ options, isLoading }) => <AdditionalCommitmentsField options={options} isLoading={isLoading} />,
    AdditionalDatePickers: ({ taskCode }) => <AdditionalDatePickers taskCode={taskCode} />,
    ApprovalType: ({ ...props }) => (
      <Select
        name="APPROVAL_TYPE"
        label="Approval Type"
        options={approvalTypes.map(item => ({ label: item, value: item }))}
        {...props}
      />
    ),
    CategoryDevelopment: ({ options, ...props }) => (
      <Select
        name="DEVELOPMENT_CATEGORY"
        label="Development Category"
        options={options}
        required
        {...props}
      />
    ),
    Distributor: ({ ...props }) => (
      <Select
        name="DISTRIBUTOR"
        label="Distributor"
        searchable
        options={[
          { label: "PT Pfizer", value: "PT Pfizer" },
          { label: "PT AstraZeneca", value: "PT AstraZeneca" },
          { label: "PT Sanofi", value: "PT Sanofi" },
          { label: "PT Merck", value: "PT Merck" },
          { label: "PT Novartis", value: "PT Novartis" },
          { label: "PT Roche", value: "PT Roche" },
          { label: "PT GlaxoSmithKline", value: "PT GlaxoSmithKline" },
          { label: "PT Johnson & Johnson", value: "PT Johnson & Johnson" },
          { label: "PT Abbott", value: "PT Abbott" },
          { label: "PT Bayer", value: "PT Bayer" },
        ]}
        {...props}
      />
    ),
    DosageForm: ({ options, ...props }) => (
      <Select
        name="REGULATORY_DOSAGE_FORM"
        label="Regulatory Dosage Form"
        searchable
        options={options}
        required
        {...props}
      />
    ),
    DossierNumber: ({ ...props }) => (
      <Input
        name="DOSSIER_NUMBER"
        label="Dossier No"
        {...props}
      />
    ),
    FinishedProductDescription: ({ ...props }) => (
      <Input
        name="FINISHED_PRODUCT_DESCRIPTION"
        label="Product Name"
        disabled
        {...props}
      />
    ),
    InfotehnaDocNo: ({ ...props }) => (
      <Input
        name="INFOTEHNA_DOC_NO"
        label="Infotehna Doc No"
        required
        {...props}
      />
    ),
    InitialRegistrationDate: ({ ...props }) => (
      <DatePicker
        name="INITIAL_REGISTRATION_DATE"
        label="Initial Registration Approval Date"
        maxDate={dayjs().toDate()}
        {...props}
      />
    ),
    MaReferenceCpp: ({ ...props }) => (
      <Select
        name="MA_REFERENCE_CPP"
        label={taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "MA Reference CPP" : "AL Reference CPP"}
        searchable
        options={[
          { label: "Sample MA Reference 1", value: "Sample MA Reference 1" },
          { label: "Sample MA Reference 2", value: "Sample MA Reference 2" },
          { label: "Sample MA Reference 3", value: "Sample MA Reference 3" },
        ]}
        {...props}
      />
    ),
    ManufacturingSite: ({ ...props }) => (
      <Input
        name="MANUFACTURING_SITE"
        label="Manufacturing Site"
        disabled
        {...props}
      />
    ),
    MarketingAuthorHolder: ({ ...props }) => (
      <Input
        name="NIE_MA_HOLDER"
        label={taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "NIE/MA Holder" : "AL Holder"}
        disabled
        {...props}
      />
    ),
    MarketingAuthorizationFile: ({ ...props }) => (
      <Uploader
        name="MARKETING_AUTHORIZATION_FILE"
        label={taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "MA Document" : "AL Document"}
        required
        multiple={false}
        {...props}
      />
    ),
    NieMaNo: ({ ...props }) => (
      <Input
        name="NIE_MA_NO"
        label={taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "NIE/MA No" : "AL No"}
        required
        {...props}
      />
    ),
    PackSize: ({ ...props }) => (
      <Input
        name="REGULATORY_PACK_SIZE"
        label="Regulatory Pack Size"
        required
        caption="Example: Dus @ 10 pcs"
        {...props}
      />
    ),
    ProductCommitmentNo: ({ ...props }) => (
      <Input
        disabled
        name="PCF_NO"
        label="PCF No"
        {...props}
      />
    ),
    RaAgent: ({ options, ...props }) => (
      <Select
        name="RA_AGENT"
        label="RA Agent"
        searchable
        options={options}
        {...props}
      />
    ),
    RegistrationProductCategory: ({ options, ...props }) => (
      <Select
        name="REGULATORY_PRODUCT_CATEGORY"
        label="Regulatory Product Category"
        searchable
        options={options}
        required
        {...props}
      />
    ),
    RegistrationProductName: ({ ...props }) => (
      <Input
        name="REGISTRATION_PRODUCT_NAME"
        label={taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? "NIE/MA Product Name" : "AL Product Name"}
        required
        {...props}
      />
    ),
    Remark: ({ ...props }) => <Input name="REMARK" label="Remark" {...props} />,
    ShelfLife: ({ ...props }) => (
      <Select
        name="REGULATORY_SHELF_LIFE"
        label="Regulatory Shelf Life"
        options={shelfLifeOptions.map(item => ({ label: item, value: item }))}
        required
        {...props}
      />
    ),
  }

  return (
    <Form
      defaultValues={defaultValues}
      validation={schema}
      onSubmit={submitHandler}
    >
      <FormComponents.MarketingAuthorizationFile />
      <Separator className="my-4" />
      <FormComponents.FinishedProductDescription />
      <FormComponents.RegistrationProductName />
      <FormComponents.MaReferenceCpp />
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.CategoryDevelopment
          options={developmentCategories?.map(item => ({
            label: item?.CATEGORY_DEVELOPMENT_NAME,
            value: item?.CATEGORY_DEVELOPMENT_NAME,
          }))}
          disabled={isLoadingDevelopmentCategories}
        />
        <FormComponents.ManufacturingSite />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.MarketingAuthorHolder />
        <FormComponents.RaAgent
          options={maHolders?.map(item => ({
            label: item?.MARKETING_AUTHORIZATION_HOLDER_NAME,
            value: item?.MARKETING_AUTHORIZATION_HOLDER_NAME,
          }))}
          disabled={isLoadingMAHolders}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.Distributor />
        <FormComponents.ApprovalType />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.NieMaNo />
        <FormComponents.InfotehnaDocNo />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.ProductCommitmentNo />
        <FormComponents.DossierNumber />
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.RegistrationProductCategory
          options={productCategories?.map(item => ({
            label: item?.PRODUCT_CATEGORY_NAME,
            value: item?.PRODUCT_CATEGORY_NAME,
          }))}
          disabled={isLoadingProductCategories}
        />
        <FormComponents.DosageForm
          options={pharmaceuticalForms?.map(item => ({
            label: item?.PHARMACEUTICAL_FORM_NAME,
            value: item?.PHARMACEUTICAL_FORM_NAME,
          }))}
          disabled={isLoadingPharmaceuticalForms}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.PackSize />
        <FormComponents.ShelfLife />
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-3">
        <FormComponents.InitialRegistrationDate />
        <FormComponents.AdditionalDatePickers taskCode={taskCode} />
      </div>
      {taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT && (
        <Fragment>
          <Separator className="my-4" />
          <FormComponents.AdditionalCommitments
            options={[
              { label: "Select Commitment Type", value: "NONE" },
              ...(commitmentTypes?.map(item => ({
                label: item?.COMMITMENT_TYPE_NAME,
                value: item?.COMMITMENT_TYPE_NAME,
              })) || [])
            ]}
            isLoading={isLoadingCommitmentTypes}
          />
        </Fragment>
      )}
      <Separator className="my-4" />
      <FormComponents.Remark />
      <Separator className="my-4" />
      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          color="tertiary"
          onClick={actions?.closeModalForm}
        >
          Cancel
        </Button>
        <Button type="submit" color="primary">Submit</Button>
      </div>
    </Form>
  );
};

export default ApprovableLetterForm;