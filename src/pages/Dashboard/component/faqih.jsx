import MainCard from "@/components/common/MainCard";
import { Button } from "@/components/Dexain";
import { Accordion } from "@/components/fields/Accordion";
import Card from "@/components/common/Card";
import CardDescription from "@/components/common/CardDescription";
import {
  FaCheck,
  FaPlus,
  FaUser,
  FaEye,
  FaEnvelope,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import { Badge } from "@/components/fields/Badge";
import { Input } from "@/components/fields/Input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Table } from "@/components/fields/Table/index";
import { Divider } from "@/components/fields/Divider";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const faqih = () => {
  const columns = [
    { accessorKey: "plmId", header: "PLM Project ID", caption: "ID Project" },
    {
      accessorKey: "product",
      header: "Finished Product",
      caption: "Nama Produk",
    },
    {
      accessorKey: "category",
      header: "EPI Category",
      caption: "Kategori EPI",
    },
    {
      accessorKey: "subcategory",
      header: "EPI Subcategory",
      caption: "Subkategori EPI",
    },
    {
      accessorKey: "site",
      header: "Manufacturing Site",
      caption: "Site Produksi",
    },
    {
      accessorKey: "created",
      header: "Created Date",
      caption: "Tanggal Dibuat",
    },
    {
      accessorKey: "modified",
      header: "Modified Date",
      caption: "Tanggal Diubah",
    },
    { accessorKey: "status", header: "Status", caption: "Status Proyek" },
  ];

  const filterableColumns = [
    { id: "plmId", header: "PLM Project ID", type: "text" },
    {
      id: "product",
      header: "Finished Product",
      type: "select",
      options: [
        "A-1235-00 Candesartan 16mg",
        "A-1235-00 Candesartan 8mg",
        "Other Products",
      ],
    },
    {
      id: "category",
      header: "EPI Category",
      type: "checkbox",
      options: ["Packaging Material", "Raw Material", "Formula"],
    },
    {
      id: "subcategory",
      header: "EPI Subcategory",
      type: "checkbox",
      options: ["Packaging Design", "Composition", "Manufacturing Process"],
    },
    {
      id: "site",
      header: "Manufacturing Site",
      type: "checkbox",
      options: ["PT Beta Pharmacon", "PT Dexa Medica", "Other Sites"],
    },
    { id: "created", header: "Created Date", type: "date" },
    { id: "modified", header: "Modified Date", type: "datetime" },
    {
      id: "status",
      header: "Status",
      type: "checkbox",
      options: ["Completed", "In Progress", "Pending"],
    },
  ];

  const data = [
    {
      plmId: "EPI-P-0001",
      product: "A-1235-00 Candesartan 16mg",
      siteTitle: "Manufacturing Site",
      category: "Packaging Material",
      subcategory: "Packaging Design",
      site: "PT Beta Pharmacon",
      created: "2023-05-10",
      modified: "2023-05-15T14:30:00",
      status: "Completed",
      material: "E-61442-04 DOOS CANDESARTAN CILEXETIL TABLET 16 MG 3X10'S",
    },
    {
      plmId: "EPI-P-0002",
      product: "A-1235-00 Candesartan 8mg",
      siteTitle: "Manufacturing Site",
      category: "Packaging Material",
      subcategory: "Packaging Design",
      site: "PT Dexa Medica",
      created: "2023-06-20",
      modified: "2023-06-25T10:15:00",
      status: "Completed",
      material: "E-61442-04 DOOS CANDESARTAN CILEXETIL TABLET 8 MG 3X10'S",
    },
  ];

  const epiCategory = "Packaging Material";
  const epiSubCategory = "Packaging Design";
  const titleBody = "Perubahan pengajuan desain logo halal";
  const titleBodyBadge = "Completed";

  // Complex example with multiple sites and materials
  const complexExample = {
    product: "B-5678-00 Amlodipine 10mg",
    sites: [
      {
        name: "PT Beta Pharmacon",
        materials: [
          "E-11111-04 DOOS AMLODIPINE TABLET 10 MG 3X10'S",
          "E-22222-02 STRIP AMLODIPINE TABLET 10 MG",
        ],
      },
      {
        name: "PT GWE Manufacturing",
        materials: [
          "E-33333-01 LABEL AMLODIPINE 10 MG",
          "E-44444-03 INSERT LEAFLET AMLODIPINE",
        ],
      },
      {
        name: "PT Medika Jaya",
        materials: [
          "E-55555-02 BOX AMLODIPINE 10 MG",
          "E-66666-01 CARTON AMLODIPINE 10 MG",
          "E-77777-03 SEALER AMLODIPINE 10 MG",
        ],
      },
    ],
  };

  return (
    <>
      {/* MainCard with Card */}
      <MainCard
        title={epiCategory}
        subtitle={epiSubCategory}
        badgeTitle={epiCategory}
        badgeSubtitle={epiSubCategory}
        titleBody={titleBody}
        titleBodyBadge={titleBodyBadge}
        titleBodyBadgeColor="green"
      >
        <Card
          title="Finished Products"
          variant="dark"
          className="mb-2"
          scrollable
          maxHeight="250px"
        >
          <div className="flex flex-col gap-3">
            {data.map((item, idx) => (
              <CardDescription
                key={item.plmId}
                product={complexExample.product}
                sites={complexExample.sites}
              />
            ))}
          </div>
        </Card>
      </MainCard>

      {/* Accordion  */}
      <Accordion
        title={
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <span className="text-primary-normal font-bold">A-10965-00</span>
              <span className="mx-2 font-bold text-primary-normal">-</span>
              <span className="text-primary-normal font-bold">
                CANDESARTAN CILEXETIL TABLET 16 MG
              </span>
              <Badge className="ml-3" color="yellow">
                3 Change control(s)
              </Badge>
            </div>
            <div className="flex items-center space-x-40 text-base text-gray-700 mt-2">
              <span>
                <span className="font-semibold">MAH :</span> PT Beta Pharmacon
              </span>
              <span>
                <span className="font-semibold">MFG Site :</span> PT Dexa Medica
              </span>
              <span>
                <span className="font-semibold">Country :</span> Indonesia
              </span>
            </div>
          </div>
        }
        rightHeaderItems={[
          <Badge color="red">4 Projects</Badge>,
          <span className="text-primary-normal-600 font-semibold cursor-pointer">
            Start Project
          </span>,
        ]}
        defaultOpen={false}
        separator={true}
      >
        <div className="p-2 text-sm text-gray-700">
          Detail produk dan informasi lainnya...
        </div>
      </Accordion>

      <MainCard
        title="Finished Products"
        subtitle="Packaging Design"
        badgeTitle="Packaging Material"
        badgeSubtitle="Packaging Design"
        titleBody="Perubahan pengajuan desain logo halal"
      />

      <Card
        title="Project Information"
        variant="dark"
        className="mb-4"
        scrollable
        maxHeight="200px"
      />
      <Card
        title="Project Information"
        variant="dark"
        className="mb-4"
        scrollable
        maxHeight="200px"
      />

      <CardDescription
        className="mb-4"
        product={complexExample.product}
        sites={complexExample.sites}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={data}
        filterableColumns={filterableColumns}
        pagination={true}
        searchable={true}
        actionType="dots"
        actionVariant="icon"
        headerSize="md"
        bodySize="lg"
        bodyAlign="left"
        bodyVariant="disable"
        actions={[
          {
            label: "View",
            icon: <GoEye />,
            onClick: (row) => alert(JSON.stringify(row, null, 2)),
          },
          {
            label: "Edit",
            icon: <FaRegEdit />,
            onClick: (row) => alert(JSON.stringify(row, null, 2)),
          },
          {
            label: "Delete",
            icon: <FaRegTrashAlt />,
            onClick: (row) => alert(JSON.stringify(row, null, 2)),
          },
        ]}
        onRowClick={(row) => console.log("Row clicked:", row)}
      />

      {/* Divider Showcase */}
      <div className="my-8 space-y-4">
        <Divider style="solid" labelAlignment="center" label="Solid Center" />
        <Divider style="solid" labelAlignment="left" label="Solid Left" />
        <Divider style="solid" labelAlignment="right" label="Solid Right" />
        <Divider style="dash" labelAlignment="center" label="Dash Center" />
        <Divider style="dash" labelAlignment="left" label="Dash Left" />
        <Divider style="dash" labelAlignment="right" label="Dash Right" />
        <Divider style="solid" labelAlignment="center" />
        <Divider style="dash" labelAlignment="center" />
        <Divider
          style="solid"
          labelAlignment="center"
          label="Custom ClassName"
          className="my-1 text-primary-normal"
          dividerStyle={{ borderColor: "red" }}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Filled Buttons */}
        <div className="flex gap-2">
          <Button
            variant="filled"
            color="primary"
            icon={<FaCheck />}
            iconPosition="right"
          >
            Click me
          </Button>
          <Button
            variant="filled"
            color="secondary"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="filled"
            color="success"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="filled"
            color="info"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="filled"
            color="warning"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="filled"
            color="danger"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="filled"
            color="disable"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="filled"
            color="tertiary"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
        </div>

        {/* Outline Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            color="primary"
            icon={<FaCheck />}
            iconPosition="right"
          >
            Click me
          </Button>
          <Button
            variant="outline"
            color="secondary"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="outline"
            color="success"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="outline"
            color="info"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="outline"
            color="warning"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="outline"
            color="danger"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="outline"
            color="disable"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="outline"
            color="tertiary"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
        </div>

        {/* Soft Buttons */}
        <div className="flex gap-2">
          <Button
            variant="soft"
            color="primary"
            icon={<FaCheck />}
            iconPosition="right"
          >
            Click me
          </Button>
          <Button
            variant="soft"
            color="secondary"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="soft"
            color="success"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="soft"
            color="info"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="soft"
            color="warning"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="soft"
            color="danger"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="soft"
            color="disable"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
          <Button
            variant="soft"
            color="tertiary"
            icon={<FaPlus />}
            iconPosition="left"
          >
            Click me
          </Button>
        </div>
      </div>

      {/* Badge */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2 flex-wrap items-center">
          <Badge color="primary" size="md">
            Primary
          </Badge>
          <Badge color="secondary" size="md">
            Secondary
          </Badge>
          <Badge color="success" size="md">
            Success
          </Badge>
          <Badge color="info" size="md">
            Info
          </Badge>
          <Badge color="warning" size="md">
            Warning
          </Badge>
          <Badge color="danger" size="md">
            Danger
          </Badge>
          <Badge color="disable" size="md">
            Disable
          </Badge>
        </div>

        {/* Outline Badge */}
        <div className="flex gap-2 flex-wrap items-center">
          <Badge color="primary" variant="outline" size="md">
            Primary
          </Badge>
          <Badge color="secondary" variant="outline" size="md">
            Secondary
          </Badge>
          <Badge color="success" variant="outline" size="md">
            Success
          </Badge>
          <Badge color="info" variant="outline" size="md">
            Info
          </Badge>
          <Badge color="warning" variant="outline" size="md">
            Warning
          </Badge>
          <Badge color="danger" variant="outline" size="md">
            Danger
          </Badge>
          <Badge color="disable" variant="outline" size="md">
            Disable
          </Badge>
        </div>

        {/* Soft Badge */}
        <div className="flex gap-2 flex-wrap items-center">
          <Badge color="primary" variant="soft" size="md">
            Primary
          </Badge>
          <Badge color="secondary" variant="soft" size="md">
            Secondary
          </Badge>
          <Badge color="success" variant="soft" size="md">
            Success
          </Badge>
          <Badge color="info" variant="soft" size="md">
            Info
          </Badge>
          <Badge color="warning" variant="soft" size="md">
            Warning
          </Badge>
          <Badge color="danger" variant="soft" size="md">
            Danger
          </Badge>
          <Badge color="disable" variant="soft" size="md">
            Disable
          </Badge>
        </div>

        {/* Label Badge */}
        <div className="flex gap-2 flex-wrap items-center">
          <Badge color="primary" variant="label" size="md">
            Primary
          </Badge>
          <Badge color="secondary" variant="label" size="md">
            Secondary
          </Badge>
          <Badge color="success" variant="label" size="md">
            Success
          </Badge>
          <Badge color="info" variant="label" size="md">
            Info
          </Badge>
          <Badge color="warning" variant="label" size="md">
            Warning
          </Badge>
          <Badge color="danger" variant="label" size="md">
            Danger
          </Badge>
          <Badge color="disable" variant="label" size="md">
            Disable
          </Badge>
        </div>
      </div>

      {/* Accordion  */}
      <Accordion
        title="EPI Request"
        rightHeaderItems={[
          <Badge color="red">4 Projects</Badge>,
          <span className="text-primary-normal-600 font-semibold cursor-pointer">
            Start Project
          </span>,
        ]}
        defaultOpen={true}
      >
        <Table
          columns={columns}
          data={data}
          filterableColumns={filterableColumns}
          pagination={true}
          searchable={true}
          actions={[
            {
              label: "View",
              onClick: (row) => alert(JSON.stringify(row, null, 2)),
            },
          ]}
          actionType="dots"
          onRowClick={(row) => console.log("Row clicked:", row)}
        />
      </Accordion>

      <div className="bg-gray-100 p-6 rounded-md mb-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Right Header None */}
          <div>
            <Accordion title="Accordion Item (none)">
              This is a description
            </Accordion>
            <Accordion title="Accordion Item (icon)" icon={<FaRegStar />}>
              This is a description
            </Accordion>

            <Accordion
              title={
                <div className="text-primary-normal font-extrabold text-xl">
                  Custom Title Accordion
                </div>
              }
              icon={<FaRegStar />}
            >
              Accordion (div custom)
            </Accordion>
          </div>

          {/* Right Header Action */}
          <div>
            <Accordion
              title="Accordion Item (action)"
              rightHeaderItems={[
                <span className="text-primary-normal-600 font-semibold">
                  Action
                </span>,
              ]}
            >
              This is a description
            </Accordion>
            <Accordion
              title="Accordion Item (action + icon)"
              icon={<FaRegStar />}
              rightHeaderItems={[
                <span className="text-primary-normal-600 font-semibold">
                  Action
                </span>,
              ]}
            >
              This is a description
            </Accordion>
          </div>

          {/* Right Header Badge */}
          <div>
            <Accordion
              title="Accordion Item (badge)"
              rightHeaderItems={[
                <span className="bg-[#B32017] text-white rounded-full px-3 py-1 text-xs font-bold">
                  Badge
                </span>,
              ]}
            >
              This is a description
            </Accordion>
            <Accordion
              title="Accordion Item (badge + icon)"
              icon={<FaRegStar />}
              rightHeaderItems={[
                <span className="bg-[#B32017] text-white rounded-full px-3 py-1 text-xs font-bold">
                  Badge
                </span>,
              ]}
            >
              This is a description
            </Accordion>
          </div>
        </div>
      </div>

      {/* Accordion action dan badge */}
      <div className="bg-gray-100 p-6 rounded-md mb-8">
        <div className="grid grid-cols-2 gap-8">
          <Accordion
            title="Accordion Item (Action + Badge)"
            rightHeaderItems={[
              <span
                className="text-primary-normal-600 font-semibold cursor-pointer"
                onClick={() => alert("Action clicked!")}
              >
                Action
              </span>,
              <Badge color="red">Badge</Badge>,
            ]}
          >
            This is a description
          </Accordion>
          <Accordion
            title="Accordion Item (All)"
            icon={<FaRegStar />}
            rightHeaderItems={[
              <span
                className="text-primary-normal font-semibold cursor-pointer"
                onClick={() => alert("Action clicked!")}
              >
                Action
              </span>,
              <Badge color="gray">Badge</Badge>,
            ]}
          >
            <Table columns={columns} data={data} pagination={false} />
          </Accordion>
        </div>
      </div>

      {/* Showcase Input */}
      <div className="flex flex-col gap-4 mb-8">
        <Input
          label="Default Input"
          name="input1"
          placeholder="Default Input"
        />
        <Input
          label="Input with Info"
          info="Tooltip info di sini"
          required={true}
          name="input2"
          placeholder="Input with Info"
        />
        <Input
          label="Input with Prefix"
          prefix={<FaUser />}
          name="input3"
          placeholder="Input with Prefix"
        />
        <Input
          label="Input with Suffix"
          suffix={<FaCheck />}
          name="input4"
          placeholder="Input with Suffix"
        />
        <Input
          label="Input with AddOn"
          suffix={<FaEye />}
          name="input5"
          placeholder="Input with AddOn"
        />
        <Input
          label="Input Full Combo"
          info="Info lengkap"
          prefix={<FaEnvelope />}
          // suffix={<FaCheck />}
          // suffix={".COM"}
          suffix={<FaEye />}
          caption="Contoh kombinasi semua fitur input"
          name="input7"
          placeholder="Input Full Combo"
          required={true}
        />

        {/* input with prefix and suffix string disabled with value */}
        <Input
          label="Input with Prefix and Suffix String"
          prefix={"https://"}
          suffix={".com"}
          name="input4"
          placeholder="Input with Suffix"
          disabled={true}
          value={"https://www.google.com"}
        />

        {/* input with prefix and suffix string */}
        <Input
          label="Input with Prefix and Suffix String"
          prefix={"https://"}
          suffix={".com"}
          name="input4"
          placeholder="Input with Suffix"
          // disabled={true}
        />

        {/* formik input */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        >
          <Form>
            <Input
              label="Email"
              name="email"
              placeholder="Email"
              required={true}
              suffix={".com"}
              prefix={<FaUser />}
              caption="Contoh kombinasi semua fitur input"
            />
            <Input
              label="Password"
              name="password"
              placeholder="Password"
              info="Password harus lebih dari 8 karakter"
              required={true}
            />
            <Button type="submit" variant="filled" color="primary">
              Submit
            </Button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default faqih;
