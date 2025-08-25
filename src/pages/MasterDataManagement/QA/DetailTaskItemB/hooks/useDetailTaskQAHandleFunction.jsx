import ApprovalHistory from '../components/approval-history'

const useDetailTaskQAHandleFunction = ({
  setOpenTableHistory,
  openSheet,
  setDialog,
  setNotes,
  submitValidateLogin,
  setRawmatList,
  setManufacturePopup,
  mutateHistory,
  dataApproval,
  dialog,
  setDisableButton,
}) => {
  const handleOpenTableHistory = () => {
    setOpenTableHistory(prev => !prev)
  }

  const handleOpenSheet = () => {
    openSheet({
      title: "Approval History",
      description: "View detailed approval history for this item.",
      width: "md",
      children: (
        <ApprovalHistory dataApproval={dataApproval} />
      )
    })
  }

  const onSubmitItem = (type) => {
    try {
      setDialog({ ...dialog, approve: true, type: type })
    } catch (error) {
      console.log(error)
    }
  }


  const handleSubmitItem = async (values) => {
    setDisableButton(true);
    try {
      setNotes(values.notes);
      await submitValidateLogin({
        email: values.email,
        password: values.password,
        notes: values.notes
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchHistory = async (e) => {
    try {
      setManufacturePopup({ ...e })
      await mutateHistory({ manufId: e.data });
    } catch (error) {
      console.log(error, 'ERROR')
    }
  }

  const handleChangeDataTable = ({
    accordion_id,
    child_id,
    subchild_id,
    value
  }) => {
    setRawmatList(prevData => {
      const newData = [...prevData];

      const itemIndex = newData.findIndex(item => (item.id) === (accordion_id));
      if (itemIndex === -1) return prevData;


      const childIndex = newData[itemIndex].children.findIndex(child => Number(child.id) === Number(child_id));
      if (childIndex === -1) return prevData;


      const subchildIndex = newData[itemIndex].children[childIndex].subchild.findIndex(subchild => Number(subchild.change_value.id) === Number(subchild_id));
      if (subchildIndex === -1) return prevData;

      const updatedSubchild = [...newData[itemIndex].children[childIndex].subchild];

      updatedSubchild[subchildIndex] = {
        ...updatedSubchild[subchildIndex],
        change_value: {
          ...updatedSubchild[subchildIndex].change_value,
          ...value,
          address: `${value.address_line1}, ${value.address_line2 ?? ""}, ${value.postal_code}, ${value.city}, ${value.country}`
        }
      };

      newData[itemIndex].children[childIndex] = {
        ...newData[itemIndex].children[childIndex],
        subchild: updatedSubchild
      };

      return newData;
    })
  }

  return{
    handleChangeDataTable,
    handleOpenTableHistory,
    handleOpenSheet,
    onSubmitItem,
    handleSubmitItem,
    handleFetchHistory,
  }
}

export default useDetailTaskQAHandleFunction
