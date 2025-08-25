import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook untuk submit validasi login pada Task Item B.
 * @param {Object} params
 * @param {Function} params.validateFormLogin - service function untuk validasi login
 * @param {Object} params.dialog - state dialog
 * @param {Function} params.setDialog - setter untuk dialog
 * @param {Function} params.archiveItemB - service function untuk archive
 * @param {Function} params.submitItemB - service function untuk submit
 * @param {String|Number} params.detailId - id detail item
 * @param {String} params.notes - catatan
 * @param {Object} params.detailItemB - detail item B
 * @param {Array} params.rawmatList - list raw material
 * @param {Object} params.title - mapping informasi
 * @param {Function} params.setDisableButton - setter untuk disable button
 * @returns {Object} { submitValidateLogin }
 */
const useSubmitValidateLogin = ({
  validateFormLogin,
  dialog,
  setDialog,
  archiveTask,
  submitTask,
  detailId,
  notes,
  detailItemB,
  rawmatList,
  title,
  setDisableButton,
}) => {
  const { mutate: submitValidateLogin } = useMutation({
    mutationFn: validateFormLogin,
    onSuccess: async (data) => {
      try {
        if (data.success) {
          console.log(dialog, 'DIALOG');
          if (dialog.type === 'ARCHIVE') {
            setDialog({ ...dialog, approve: false });
            await archiveTask({
              formula_id: detailId,
              notes: notes,
              item_fg_number: detailItemB['ITEM_FG_NUMBER']
            });
            return;
          }

          const modify_array = [];
          rawmatList.forEach(item => {
            if (item['children'].length < 1) return;
            modify_array.push(item);
          });
          setDialog({ ...dialog, approve: false });
          await submitTask({
            formulaId: detailId,
            notes: notes,
            mapping_information: title,
            item_fg_number: detailItemB['ITEM_FG_NUMBER'],
            manufacturer: modify_array
          });
        } else {
          toast.error("Invalid email or password", {
            description: "Please check your email and password",
            duration: 2000,
            action: {
              label: "Reload",
              onClick: () => window.location.reload(),
            },
            style: {
              background: "#fff3cd",
              color: "#856404",
              border: "1px solid #ffeeba"
            }
          });
          return;
        }
      } catch (error) {
        console.log(error, 'ERROR');
      }
    },
    onError: () => {
      setDisableButton(prev => !prev);
    }
  });

  return { submitValidateLogin };
};

export default useSubmitValidateLogin;
