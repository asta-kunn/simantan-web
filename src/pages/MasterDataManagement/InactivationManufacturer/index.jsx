import { Fragment } from "react"
import InactivePresenter from "./components/InactivePresenter"
import useStateHandler from "./hooks/useStateHandler"
import useActionHandler from "./hooks/useActionHandler"
import useFetchDataTable from "./hooks/useFetchDataTable"
import useFetchItemFGOption from "./hooks/useFetchItemFGOption"
import useStateFormHandler from "./hooks/useStateFormHandler"
import useFetchDetailInactiveManufacture from "./hooks/useFetchDetailInactiveManufacture"
import useInsertInactiveManufacture from "./hooks/useInsertInactiveManufacture"
import useValidateLoginInactiveInitialForm from "./hooks/useValidateLoginInactiveInitialForm"

const InactivationManufacturer = () => {

  //state
  const { 
    filterForm, 
    setFilterForm, 
    tabValue, 
    setTabValue, 
    isOpen, 
    setIsOpen, 
    selectedItemFG, 
    setSelectedItemFG,
    isOpenDetail,
    setIsOpenDetail,
    setLoading,
    loading,
    setDetailTask,
    user,
    isOpenValidateLogin,
    setIsOpenValidateLogin,
  } = useStateHandler();

  const { manufacturer, setManufacturer, itemMaterial, setItemMaterial, inactiveDate, setInactiveDate } = useStateFormHandler()

  //api
  const { data, refetch, pagination, setPagination, fetchDataLoading, goToNextPage, goToPreviousPage, goToFirstPage, goToLastPage } = useFetchDataTable({tabValue, filterForm});
  const { itemFGOption } = useFetchItemFGOption();
  const { detailItemA, manufactureList, rawMaterial, rawmatOptions, setRawmatOptions } = useFetchDetailInactiveManufacture(isOpenDetail.item_fg);
  const { saveData } = useInsertInactiveManufacture({setLoading, setIsOpenDetail, setIsOpen, setManufacturer, setItemMaterial, setInactiveDate, setSelectedItemFG, refetch, setPagination});
  const { submitValidateUser } = useValidateLoginInactiveInitialForm({saveData, setLoading, setManufacturer, setItemMaterial, setInactiveDate, manufacturer, selectedItemFG, itemMaterial, inactiveDate});

  //handler
  const { 
      searchSubmit, handleAddManufacturer, handleSubmit, handleChangeManufacturer, handleChangeFG, onView,
      control, setValue, errors, reset, handleSubmitSchema,
    } = useActionHandler({ 
    filterForm, setFilterForm, setIsOpen, isOpen,
    setIsOpenDetail, setManufacturer, 
    setRawmatOptions, rawMaterial, 
    setItemMaterial, setInactiveDate, manufacturer,
    selectedItemFG, itemMaterial, inactiveDate, saveData, setLoading, setDetailTask, tabValue, pagination, setPagination
  });

  return (
    <Fragment>
        <InactivePresenter 
          data={data}
          pagination={pagination}
          searchSubmit={searchSubmit}
          tabValue={tabValue}
          setTabValue={setTabValue}
          setPagination={setPagination}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleAddManufacturer={handleAddManufacturer}
          itemFGOption={itemFGOption}
          selectedItemFG={selectedItemFG}
          setSelectedItemFG={setSelectedItemFG}
          manufacturer={manufacturer}
          handleChangeManufacturer={handleChangeManufacturer}
          itemMaterial={itemMaterial}
          setItemMaterial={setItemMaterial}
          inactiveDate={inactiveDate}
          setInactiveDate={setInactiveDate}
          isOpenDetail={isOpenDetail}
          setIsOpenDetail={setIsOpenDetail}
          handleSubmit={handleSubmit}
          handleSubmitSchema={handleSubmitSchema(() => { setIsOpenValidateLogin(prev => !prev) })}
          detailItemA={detailItemA}
          manufactureList={manufactureList}
          rawmatOptions={rawmatOptions}
          handleChangeFG={handleChangeFG}
          handleInsert={() => { setIsOpenValidateLogin(prev => !prev) }}
          loading={loading}
          onView={onView}
          fetchDataLoading={fetchDataLoading}
          user={user}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          goToFirstPage={goToFirstPage}
          goToLastPage={goToLastPage}
          control={control}
          setValue={setValue}
          errors={errors}
          reset={reset}
          isOpenValidateLogin={isOpenValidateLogin}
          setIsOpenValidateLogin={setIsOpenValidateLogin}
          submitValidateLogin={submitValidateUser}
        />
    </Fragment>
  )
}

export default InactivationManufacturer
