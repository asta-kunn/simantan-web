import { Toaster } from "sonner";
import Loading from "../common/Loading";
import { ConfirmationModal } from "./ConfirmationModal";
import { Modal } from "./Modal";
import { ProgressModal } from "./ProgressModal";
import { Sheet } from "./Sheet";
import { Stacks } from "./Stacks";

export const UIProvider = ({ children }) => {
  return (
    <>
      <Stacks />
      <Modal />
      <ProgressModal />
      <ConfirmationModal />
      <Sheet />
      <Toaster position="top-center" duration={3000} />
      <Loading />
      {children}
    </>
  );
};
