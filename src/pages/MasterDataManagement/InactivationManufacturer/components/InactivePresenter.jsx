import { Card, Tabs } from "@/components/Dexain"
import { SearchContainer } from "../InactiveManufactureSearch"
import { TableContainer } from "./table-container"
import { Fragment } from "react"
import HeaderPresenter from "./header-section"
import DialogInactiveManufacture from "./dialog-inactive-manufacture"
import DialogDetailInactiveManufacture from "./dialog-detail-inactive-manufacture"
import { motion } from "framer-motion"
import DialogValidateLogin from "./dialog-login"


const InactivePresenter = (
    {   
        searchSubmit,
        tabValue,
        setTabValue,
        handleAddManufacturer,
        isOpen,
        isOpenDetail,
        itemFGOption,
        selectedItemFG,
        setSelectedItemFG,
        manufacturer,
        handleChangeManufacturer,
        itemMaterial,
        setItemMaterial,
        inactiveDate,
        setInactiveDate,
        setIsOpenDetail,
        handleSubmitSchema,
        detailItemA,
        manufactureList,
        rawmatOptions,
        setIsOpen,
        handleChangeFG,
        handleInsert,
        loading,
        data,
        pagination,
        onView,
        fetchDataLoading,
        user,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage,
        resetForm,
        control,
        setValue,
        errors,
        reset,
        isOpenValidateLogin,
        setIsOpenValidateLogin,
        submitValidateLogin,
        handleSubmit
    }
) => {

    return (
        <motion.div 
            className="p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >

            {/* Header Section */}
            <Fragment>
                <HeaderPresenter openSheet={handleAddManufacturer} user={user} />
            </Fragment>

            {/* Dialog Inactive Manufacture */}
            <DialogInactiveManufacture
                isOpen={isOpen}
                onClose={handleAddManufacturer}
                itemFGOption={itemFGOption}
                selectedItemFG={selectedItemFG}
                setSelectedItemFG={setSelectedItemFG}
                handleSubmit={handleSubmit}
            />
            
            {/* Dialog Validate Login */}
            <DialogValidateLogin
                isOpen={isOpenValidateLogin}
                onClose={() => { setIsOpenValidateLogin(prev => !prev) }}
                setIsOpenDetail={() => { setIsOpenValidateLogin(prev => !prev) }}
                detailItemA={[]}
                isView={true}
                loading={loading}
                onSubmit={submitValidateLogin}
            />

            {/* Dialog Detail Inactive Manufacture */}
            <DialogDetailInactiveManufacture
                isOpen={isOpenDetail.isOpen}
                onClose={handleAddManufacturer}
                setIsOpenDetail={setIsOpenDetail}
                manufacturer={manufacturer}
                handleChangeManufacturer={handleChangeManufacturer}
                itemMaterial={itemMaterial}
                setItemMaterial={setItemMaterial}
                inactiveDate={inactiveDate}
                setInactiveDate={setInactiveDate}
                detailItemA={detailItemA}
                manufactureList={manufactureList}
                rawmatOptions={rawmatOptions}
                setIsOpen={setIsOpen}
                handleChangeFG={handleChangeFG}
                handleInsert={handleInsert}
                loading={loading}
                resetForm={resetForm}
                control={control}
                setValue={setValue}
                errors={errors}
                handleSubmitSchema={handleSubmitSchema}
                reset={reset}

            />

            {/* Tabs Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
                <Tabs style="pill" value={tabValue} onValueChange={(value) => setTabValue(value)} tabs={[{
                    value: "In Progress",
                    label: "In Progress",
                    content: (
                        <Card>
                            <SearchContainer
                                onSubmit={searchSubmit}
                                isLoading={false}
                            />
                            <TableContainer
                                data={data}
                                onView={onView}
                                pagination={pagination}
                                previousPage={goToPreviousPage}
                                nextPage={goToNextPage}
                                handleFirstPage={goToFirstPage}
                                handleLastPage={goToLastPage}
                                loading={fetchDataLoading}
                            />
                        </Card>
                    )
                }, {
                    value: "Completed",
                    label: "Completed",
                    content: (
                        <Card>
                            <SearchContainer
                                onSubmit={searchSubmit}
                                isLoading={false}
                            />
                            <TableContainer
                                data={data}
                                onView={onView}
                                pagination={pagination}
                                previousPage={goToPreviousPage}
                                nextPage={goToNextPage}
                                handleFirstPage={goToFirstPage}
                                handleLastPage={goToLastPage}
                                loading={fetchDataLoading}
                            />
                        </Card>
                    )
                }]} />
            </motion.div>

        </motion.div>
    )
}

export default InactivePresenter
