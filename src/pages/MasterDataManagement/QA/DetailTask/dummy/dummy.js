const exampleData = [
    {
        id: "1",
        title: "Active Ingredients",
        children: [
            {
                id: "1-1", name: "C-30001-01 / Paracetamol", subchild: [
                    { id: 111, manufacturing_code: "RM ID KFS 01", manufacturing_source: "Kimia Farma", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 211, manufacturing_code: "RM ID KFS 02", manufacturing_source: "Alfamart", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 311, manufacturing_code: "RM ID KFS 03", manufacturing_source: "Circle K", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: false },
                ]
            },
            {
                id: "1-2", name: "C-49383-Atrovastation", subchild: [
                    { id: 1111, manufacturing_code: "RM ID KFS 01", manufacturing_source: "Kimia Farma", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 2111, manufacturing_code: "RM ID KFS 02", manufacturing_source: "Alfamart", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 3111, manufacturing_code: "RM ID KFS 03", manufacturing_source: "Circle K", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                ]
            },
        ],
    },
    {
        id: "12",
        title: "Exception Material",
        children: [
            {
                id: "1-1", name: "D-39493 Sugar", subchild: [
                    { id: 12425, manufacturing_code: "RM ID KFS 01", manufacturing_source: "Kimia Farma", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 211312, manufacturing_code: "RM ID KFS 02", manufacturing_source: "Alfamart", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 33232, manufacturing_code: "RM ID KFS 03", manufacturing_source: "Circle K", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                ]
            },
            {
                id: "1-2", name: "C-49383-Atrovastation", subchild: [
                    { id: 11, manufacturing_code: "RM ID KFS 01", manufacturing_source: "Kimia Farma", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 21, manufacturing_code: "RM ID KFS 02", manufacturing_source: "Alfamart", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 31, manufacturing_code: "RM ID KFS 03", manufacturing_source: "Circle K", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                ]
            },
        ],
    },
    {
        id: "124",
        title: "Packaging Material",
        children: [
            {
                id: "1-1", name: "D-39493 Sugar", subchild: [
                    { id: 12425, manufacturing_code: "RM ID KFS 01", manufacturing_source: "Kimia Farma", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 211312, manufacturing_code: "RM ID KFS 02", manufacturing_source: "Alfamart", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 33232, manufacturing_code: "RM ID KFS 03", manufacturing_source: "Circle K", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                ]
            },
            {
                id: "1-2", name: "C-49383-Atrovastation", subchild: [
                    { id: 11, manufacturing_code: "RM ID KFS 01", manufacturing_source: "Kimia Farma", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 21, manufacturing_code: "RM ID KFS 02", manufacturing_source: "Alfamart", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                    { id: 31, manufacturing_code: "RM ID KFS 03", manufacturing_source: "Circle K", address: "Jl. Imam Bonjol no 18, 15143, Tangerang, Indonesia", new_address: "", isChecked: true },
                ]
            },
        ],
    },
];

const filterOptions = [
    { value: "Variation", label: "Variation" },
    { value: "Notification", label: "Notification" },
    { value: "No Registration", label: "No Registration" },
];

const tableInformation = [
    { id: 1, title: "Recipe Version", value: "V.5" },
    { id: 2, title: "Formula Version", value: "V.5" },
    { id: 3, title: "AVL Version", value: "V.5" },
]

export { exampleData, filterOptions, tableInformation };
