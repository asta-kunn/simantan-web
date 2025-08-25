import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Card, Accordion, Table } from "@/components/Dexain";

import { FaListUl, FaRegFolderOpen } from "react-icons/fa";

const projectStatusData = [
  {
    id: 1,
    epiNo: "EPI-P-0001",
    product: "A-1235-00 Candesartan 16mg",
    category: "Packaging Material",
    subcategory: "Packaging Design",
    site: "PT Beta Pharmacon",
    status: "Started",
    registrationType: "Registration Variation",
    ccNo: "CC00001",
    packagingMaterial:
      "E-61444-04 DOOS CANDESARTAN CILEXETIL TABLET 16 MG 3X10'S",
    title: "Perubahan pengajuan desain logo halal",
  },
  {
    id: 2,
    epiNo: "EPI-P-0002",
    product: "A-1235-00 Candesartan 8mg",
    category: "Packaging Material",
    subcategory: "Packaging Design",
    site: "PT Dexa Medica",
    status: "In Progress",
    registrationType: "Registration Variation",
    ccNo: "CC00002",
    packagingMaterial:
      "E-61444-05 DOOS CANDESARTAN CILEXETIL TABLET 8 MG 3X10'S",
    title: "Perubahan pengajuan desain 2",
  },
  {
    id: 3,
    epiNo: "EPI-P-0003",
    product: "A-1235-00 Candesartan 4mg",
    category: "Packaging Material",
    subcategory: "Packaging Design",
    site: "PT Beta Pharmacon",
    status: "Terminated",
    registrationType: "Registration Variation",
    ccNo: "CC00003",
    packagingMaterial:
      "E-61444-06 DOOS CANDESARTAN CILEXETIL TABLET 32 MG 3X10'S",
    title: "Perubahan pengajuan desain 3",
  },
  {
    id: 4,
    epiNo: "EPI-P-0004",
    product: "A-1235-00 Candesartan 5mg",
    category: "Packaging Material",
    subcategory: "Packaging Design",
    site: "PT Dexa Medica",
    status: "Completed",
    registrationType: "Registration Variation",
    ccNo: "CC00004",
    packagingMaterial:
      "E-61444-07 DOOS CANDESARTAN CILEXETIL TABLET 64 MG 3X10'S",
    title: "Perubahan pengajuan desain 4",
  },
];

const columnsProjectStatus = [
  { accessorKey: "epiNo", header: "PLM Project ID" },
  { accessorKey: "product", header: "Finished Product" },
  { accessorKey: "category", header: "EPI Category" },
  { accessorKey: "subcategory", header: "EPI Sub Category" },
  { accessorKey: "site", header: "Manufacturing Site" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let color = "text-gray-700";
      if (status === "Started") color = "text-gray-700 font-semibold";
      if (status === "In Progress") color = "text-blue-600 font-semibold";
      if (status === "Terminated")
        color = "text-primary-normal-600 font-semibold";
      if (status === "Completed") color = "text-green-600 font-semibold";
      return <span className={color}>{status}</span>;
    },
  },
];

const fetchDummyData = () =>
  Promise.resolve({
    startRequest: [
      {
        id: 1,
        epiRequest: "EPI-R-0001",
        category: "Packaging Material",
        subcategory: "Packaging Design",
        title: "Perubahan pengajuan desain logo halal",
        projects: [
          {
            epiNo: "EPI-P-0003",
            product: "A-1235-00 Candesartan 8mg",
            site: "PT Beta Pharmacon",
            registrationType: "Registration Variation",
            ccNo: "CC00001",
            packagingMaterial:
              "E-61444-04 DOOS CANDESARTAN CILEXETIL TABLET 16 MG 3X10'S",
          },
          {
            epiNo: "EPI-P-0004",
            product: "A-1235-00 Candesartan 16mg",
            site: "PT Dexa Medica",
            registrationType: "Registration Variation",
            ccNo: "CC00002",
            packagingMaterial:
              "E-61444-05 DOOS CANDESARTAN CILEXETIL TABLET 8 MG 3X10'S",
          },
        ],
      },
      {
        id: 2,
        epiRequest: "EPI-R-0002",
        category: "Raw Material",
        subcategory: "Material Specification/Testing Method",
        title: "Perubahan pengajuan desain 2",
        projects: [
          {
            epiNo: "EPI-P-0001",
            product: "A-1235-00 Candesartan 16mg",
            site: "PT Beta Pharmacon",
            registrationType: "Registration Variation",
            ccNo: "CC00003",
            packagingMaterial:
              "E-61444-06 DOOS CANDESARTAN CILEXETIL TABLET 32 MG 3X10'S",
          },
        ],
      },
    ],
    closeProject: [
      {
        id: 3,
        epiRequest: "EPI-R-0003",
        category: "Formula",
        subcategory: "Formulation Change",
        title: "Perubahan formula produk",
        projects: [
          {
            epiNo: "EPI-P-0005",
            product: "A-1235-00 Candesartan 32mg",
            site: "PT Dexa Medica",
            registrationType: "Registration Variation",
            ccNo: "CC00004",
            packagingMaterial:
              "E-61444-07 DOOS CANDESARTAN CILEXETIL TABLET 64 MG 3X10'S",
          },
        ],
      },
    ],
  });

const ProjectManagement = () => {
  //define state
  const navigate = useNavigate();
  const [data, setData] = useState({ startRequest: [], closeProject: [] });
  const getInitialTab = () => localStorage.getItem("plm_activeTab") || "myTask";
  const getInitialSubTab = () =>
    localStorage.getItem("plm_activeSubTab") || "startRequest";
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [activeSubTab, setActiveSubTab] = useState(getInitialSubTab);
  // State untuk menyimpan selected EPI per accordion
  const [selectedEpi, setSelectedEpi] = useState({});

  //use effect
  useEffect(() => {
    fetchDummyData().then(setData);
  }, []);

  useEffect(() => {
    localStorage.setItem("plm_activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("plm_activeSubTab", activeSubTab);
  }, [activeSubTab]);

  // Handler untuk main tab
  const handleMainTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "myTask") {
      setActiveSubTab((prev) => prev || "startRequest");
    }
  };

  // Handler untuk sub tab
  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
  };

  // Handler untuk checkbox
  const handleCheckboxChange = (accordionId, epiNo, checked, rowData) => {
    setSelectedEpi((prev) => {
      const prevSelected = prev[accordionId] || [];
      let newSelected;
      if (checked) {
        newSelected = [...prevSelected, rowData];
      } else {
        newSelected = prevSelected.filter((item) => item.epiNo !== epiNo);
      }
      return { ...prev, [accordionId]: newSelected };
    });
  };

  // Handler untuk navigasi ke detail project
  const handleViewProject = (row, requestData) => {
    const completeProjectData = {
      ...row,
      category: requestData.category || row.category,
      subcategory: requestData.subcategory || row.subcategory,
      title: requestData.title || row.title,
    };
    localStorage.setItem(
      "selectedProjectData",
      JSON.stringify(completeProjectData)
    );

    navigate(`/epi/project-management/detail?projectId=${row.epiNo}`);
  };

  // Tab utama sticky
  const mainTabs = [
    {
      label: (
        <div className="flex items-center">
          <FaListUl className="w-4 h-4 mr-2" />
          My Task
        </div>
      ),
      value: "myTask",
    },
    {
      label: (
        <div className="flex items-center">
          <FaRegFolderOpen className="w-4 h-4 mr-2" />
          Project Status
        </div>
      ),
      value: "projectStatus",
    },
  ];

  // Tab normal
  const subTabs = [
    {
      label: "Start Request",
      value: "startRequest",
      badge: (data.startRequest || []).length,
      badgeColor: "red",
    },
    {
      label: "Close Project",
      value: "closeProject",
      badge: (data.closeProject || []).length,
      badgeColor: "red",
    },
  ];

  // Kolom tabel dengan checkbox
  const columns = [
    {
      accessorKey: "epiNo",
      header: "EPI Request No",
      cell: ({ row }) => {
        const parentAccordion = currentData.find((epi) =>
          epi.projects.some((p) => p.epiNo === row.original.epiNo)
        );
        const accordionId = parentAccordion ? parentAccordion.id : null;
        const checked =
          selectedEpi[accordionId]?.some(
            (item) => item.epiNo === row.original.epiNo
          ) || false;
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-primary-normal"
              checked={checked}
              onChange={(e) =>
                handleCheckboxChange(
                  accordionId,
                  row.original.epiNo,
                  e.target.checked,
                  row.original
                )
              }
            />
            <span>{row.original.epiNo}</span>
          </div>
        );
      },
    },
    { accessorKey: "product", header: "Finished Product" },
    { accessorKey: "site", header: "MFG Site" },
  ];

  // Data yang akan dirender
  const currentData =
    activeTab === "myTask" ? data[activeSubTab] || [] : data[activeTab] || [];

  const filterableColumnsProjectStatus = [
    { id: "epiNo", type: "text" },
    { id: "product", type: "text" },
    { id: "category", type: "select", options: ["Packaging Material"] },
    { id: "subcategory", type: "select", options: ["Packaging Design"] },
    {
      id: "site",
      type: "select",
      options: ["PT Beta Pharmacon", "PT Dexa Medica"],
    },
    {
      id: "status",
      type: "select",
      options: ["Started", "In Progress", "Terminated", "Completed"],
    },
  ];

  return (
    <>
      {/* Sticky Tabs di bawah header */}
      <div className="mt-0">
        <Tabs
          variant="sticky"
          sticky="top"
          tabs={mainTabs}
          value={activeTab}
          onValueChange={handleMainTabChange}
        />
      </div>

      {/* Sub Tabs (tidak sticky) */}
      {activeTab === "myTask" && (
        <div className="mt-3 ml-3 mr-3">
          <Tabs
            variant="normal"
            tabs={subTabs}
            value={activeSubTab}
            onValueChange={handleSubTabChange}
          />
        </div>
      )}

      {/* Card putih membungkus semua accordion atau tabel project status */}
      <div className="mt-4 ml-3 mr-3 mb-16">
        <Card className="p-4 bg-white shadow-md">
          {activeTab === "projectStatus" ? (
            <Table
              columns={columnsProjectStatus}
              data={projectStatusData}
              actions={[
                {
                  label: (
                    <span className="text-primary-normal font-semibold">
                      View Project
                    </span>
                  ),
                  onClick: (row) => handleViewProject(row, {}),
                },
              ]}
              filterableColumns={filterableColumnsProjectStatus}
              pagination={true}
              actionType="button"
              actionVariant="icon"
              actionHeader="View"
            />
          ) : currentData.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No data</div>
          ) : (
            currentData.map((epi) => (
              <div key={epi.id} className="mb-4">
                <Accordion
                  headerTitle="EPI Request"
                  badgeLeft={
                    <span>
                      <b>{epi.epiRequest}</b> - {epi.category} -{" "}
                      {epi.subcategory}
                    </span>
                  }
                  badgeRight={`${epi.projects.length} Project(s)`}
                  buttonTitle={
                    <span>
                      {activeSubTab === "startRequest" ? (
                        <>
                          Start Project <span className="ml-1">&#9654;</span>
                        </>
                      ) : (
                        <>
                          Close Project <span className="ml-1">&#9654;</span>
                        </>
                      )}
                    </span>
                  }
                  buttonVariant="gradient"
                  defaultOpen={false}
                  bodyTitle={epi.title}
                  buttonProps={{
                    onClick: () => {
                      const selected = selectedEpi[epi.id] || [];
                      if (selected.length === 0) {
                        window.alert(
                          `Button clicked. Tidak ada EPI Request No yang dipilih.`
                        );
                      } else {
                        window.alert(
                          `Button clicked. Data terpilih:\n` +
                            selected
                              .map(
                                (item) =>
                                  `- ${item.epiNo}: ${item.product} (${item.site})`
                              )
                              .join("\n")
                        );
                      }
                      setSelectedEpi((prev) => ({ ...prev, [epi.id]: [] }));
                    },
                  }}
                >
                  <Table
                    columns={columns}
                    data={epi.projects}
                    actions={
                      activeTab === "projectStatus"
                        ? []
                        : [
                            {
                              label: (
                                <span className="text-primary-normal font-semibold">
                                  View Project
                                </span>
                              ),
                              onClick: (row) => handleViewProject(row, epi),
                            },
                          ]
                    }
                    filterableColumns={[]}
                    pagination={true}
                    actionType={
                      activeTab === "projectStatus" ? "none" : "button"
                    }
                    actionHeader="View"
                  />
                </Accordion>
              </div>
            ))
          )}
        </Card>
      </div>
    </>
  );
};

export default ProjectManagement;
