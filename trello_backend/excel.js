const XLSX = require('xlsx');

const lists = [
    {
        "id": "BRUGAV-BMEPXMYEHcPP7K",
        "text": "For Bear",
        "tasks": [
            {
                "id": "Ij9DJD0uP25HeYSyRdV_O",
                "text": "Wood",
                "price": "25 AED",
                "quantity": 600,
                // other fields...
            },
            // other tasks...
        ],
    },
    // other lists...
];

lists.forEach(list => {
    // Convert tasks to an array of arrays (for the worksheet)
    const tasksData = list.tasks.map(task => [
        task.id,
        task.text,
        task.price,
        task.quantity,
        // ...other fields
    ]);

    // Add headers to the data
    tasksData.unshift(['ID', 'Text', 'Price', 'Quantity', /*... other headers */]);

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet(tasksData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write to file
    XLSX.writeFile(wb, `${list.text}.xlsx`);
});
