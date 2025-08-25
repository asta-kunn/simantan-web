import { Accordion, Badge, Button, Info, Separator, Skeleton } from "@/components/Dexain";
import { TablePagination } from "@/components/fields/Table/components/TablePagination";
import { userRole } from "@/constants/role.constant";
import { useGetUsers } from "@/hooks/master-data/useMasterData";
import { useUIStore } from "@/stores/uiStore";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { usePostAssignTask } from "../../hooks/useNewRegTask";
import AssignTaskForm from "./AssignTaskForm";
import TaskAccordionTable from "./TaskAccordionTable";

const PAGE_SIZE = 10;

const NewTaskContent = ({
  data,
  currentPage,
  onCurrentPage,
  onChangeTab,
  onRefetch,
  isLoading
}) => {
  const { addStack, closeStack, clearStacks } = useUIStore();
  const { users: picRaOpsUsers, isLoading: isLoadingPicRaOpsUsers } = useGetUsers({ ROLE_CODE: userRole.RA_OFFICER });
  const { postAssignTask, isLoadingPostAssignTask } = usePostAssignTask();

  const [accordionValue, setAccordionValue] = useState("");
  const selectedPicRaOpsUserRef = useRef({ NAME: "N/A", EMAIL: "N/A" });

  const handleFirstPage = () => onCurrentPage(1);
  const handleLastPage = () => onCurrentPage(totalPages);
  const handlePreviousPage = () => onCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => onCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  const handleAssignTask = (data) => {
    addStack({
      title: "Send Assignment to PIC RA?",
      description: "Please review again because this action cannot be undone.",
      variant: "warning",
      content: (
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <Info label="PCF No" value={data.PCF_NO} containerClassName="col-span-full" />
            <Info label="Finished Product Description" value={data.FINISHED_PRODUCT_DESCRIPTION} containerClassName="col-span-full" />
            <Info label="NIE/MA Holder" value={data.NIE_MA_HOLDER} />
            <Info label="Manufacturing Site" value={data.MANUFACTURING_SITE} />
          </div>
          <Separator className="my-4" />
          <Info label="PIC RA Officer" value={(
            <div className="flex flex-col gap-1">
              <p>{selectedPicRaOpsUserRef.current.NAME}</p>
              <p className="text-sm text-primary-normal">{selectedPicRaOpsUserRef.current.EMAIL}</p>
            </div>
          )} />
        </div>
      ),
      onConfirm: async () => {
        const response = await postAssignTask(data);
        onRefetch();
        clearStacks();

        addStack({
          title: "Successfully Sent Assignment to PIC RA",
          description: "Well done! the form will continue to the next step.",
          variant: "success",
          content: (
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <Info label="Submission ID" value={response} />
                <Info label="PCF No" value={data.PCF_NO} />
                <Info label="Finished Product Description" value={data.FINISHED_PRODUCT_DESCRIPTION} containerClassName="col-span-full" />
                <Info label="NIE/MA Holder" value={data.NIE_MA_HOLDER} />
                <Info label="Manufacturing Site" value={data.MANUFACTURING_SITE} />
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <Info label="PIC RA Officer" value={(
                  <div className="flex flex-col gap-1">
                    <p>{selectedPicRaOpsUserRef.current.NAME}</p>
                    <p className="text-sm text-primary-normal">{selectedPicRaOpsUserRef.current.EMAIL}</p>
                  </div>
                )} />
                <Info label="Assign Date" value={dayjs().format("DD MMM YYYY")} />
              </div>
            </div>
          ),
          footer: (
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => closeStack()}>
                Back to List New Task
              </Button>
              <Button onClick={() => {
                closeStack();
                onChangeTab("SUBMISSION_MONITORING");
              }}>
                Go to Submission Monitoring
              </Button>
            </div>
          ),
        });
      },
      onCancel: () => closeStack(),
    });
  };

  const openTaskAssignmentForm = (payload) => addStack({
    size: "3xl",
    title: "Assign Task to PIC",
    content: (
      <AssignTaskForm
        data={payload}
        picRaOpsUsers={picRaOpsUsers}
        selectedPicRaOpsUserRef={selectedPicRaOpsUserRef}
        onSubmit={(formData) => handleAssignTask({ ...formData, ...payload })}
        disabled={isLoadingPicRaOpsUsers}
        stackMethods={{ addStack, closeStack, clearStacks }}
      />
    ),
  });

  return (
    <div>
      {isLoading ? (
        <Skeleton className="w-full h-[40vh]" />
      ) : currentPageData.length > 0 ? currentPageData.map((item) => {
        return (
          <Accordion
            key={item.PCF_NO}
            accordionId={item.PCF_NO}
            type="multiple"
            value={accordionValue}
            onValueChange={setAccordionValue}
            openItemClassName="border-primary-normal rounded-t-md"
            openHeaderClassName="bg-primary-soft rounded-t-md"
            separator
            title={
              <div className="flex items-center">
                <p>{item.PCF_NO}</p>
                <Badge
                  color="primary"
                  variant="filled"
                  size="sm"
                  className="bg-secondary-normal text-white px-2.5 py-0.5 ml-3"
                >
                  {item.FINISHED_PRODUCTS.length} Finished Product(s)
                </Badge>
              </div>
            }
          >
            <TaskAccordionTable
              pcfNo={item.PCF_NO}
              data={item.FINISHED_PRODUCTS}
              onAssignTask={openTaskAssignmentForm}
              disabled={isLoadingPicRaOpsUsers || isLoadingPostAssignTask}
            />
          </Accordion>
        )
      }) : (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-neutral-gray text-lg font-medium">
            No results data
          </span>
        </div>
      )}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        filteredData={data}
        handleFirstPage={handleFirstPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handleLastPage={handleLastPage}
      />
    </div>
  )
};

export default NewTaskContent;