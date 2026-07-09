"use client";

export default function ResultTable({ result }) {
  const records = result.records || [];

  const columns = [
    { key: "created_at", label: "Created At" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "country_code", label: "Country Code" },
    {
      key: "mobile_without_country_code",
      label: "Mobile Number",
    },
    { key: "company", label: "Company" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "lead_owner", label: "Lead Owner" },
    { key: "crm_status", label: "CRM Status" },
    { key: "crm_note", label: "CRM Note" },
    { key: "data_source", label: "Data Source" },
    { key: "possession_time", label: "Possession Time" },
    { key: "description", label: "Description" },
  ];

  return (
    <div className="space-y-6">

      {/* Summary */}

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Total Records</p>
          <h2 className="text-3xl font-bold text-blue-700">
            {result.summary.totalRows}
          </h2>
        </div>

        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Successfully Parsed</p>
          <h2 className="text-3xl font-bold text-green-600">
            {result.summary.imported}
          </h2>
        </div>

        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Skipped Records</p>
          <h2 className="text-3xl font-bold text-red-600">
            {result.summary.skipped}
          </h2>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Returned Records</p>
          <h2 className="text-3xl font-bold text-purple-700">
            {records.length}
          </h2>
        </div>

      </div>

      {/* Result Table */}

      <div className="border rounded-xl overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <div className="max-h-[600px] overflow-y-auto">

            <table className="min-w-[1800px] w-full text-sm">

              <thead className="sticky top-0 bg-gray-100 z-10">

                <tr>

                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left border-b font-semibold whitespace-nowrap"
                    >
                      {column.label}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {records.map((record, index) => (

                  <tr
                    key={index}
                    className="hover:bg-gray-50"
                  >

                    {columns.map((column) => (

                      <td
                        key={column.key}
                        className={`px-4 py-3 border-b align-top ${
                          column.key === "crm_note" ||
                          column.key === "description"
                            ? "min-w-[300px] whitespace-pre-wrap"
                            : "whitespace-nowrap"
                        }`}
                      >
                        {record[column.key] || "-"}
                      </td>

                    ))}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}