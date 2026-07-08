"use client";

import { FiFileText } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function PreviewTable({
  file,
  headers,
  rows,
  onRemove,
}) {
  return (
    <div>

      {/* File Card */}

      <div className="flex items-center justify-between border rounded-xl p-4 mb-4 bg-white">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
            <FiFileText className="text-teal-700 text-xl"/>
          </div>

          <div>

            <p className="font-semibold text-sm">
              {file.name}
            </p>

            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>

          </div>

        </div>

        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500"
        >
          <IoClose size={20}/>
        </button>

      </div>

      {/* Table */}

      <div className="border rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <div className="max-h-72 overflow-y-auto">

            <table className="min-w-full text-sm">

              <thead className="sticky top-0 bg-gray-100">

                <tr>

                  {headers.map(header=>(
                    <th
                      key={header}
                      className="px-4 py-3 text-left whitespace-nowrap border-b font-semibold"
                    >
                      {header}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {rows.map((row,index)=>(

                  <tr
                    key={index}
                    className="hover:bg-gray-50"
                  >

                    {headers.map(header=>(

                      <td
                        key={header}
                        className="px-4 py-3 border-b whitespace-nowrap"
                      >
                        {row[header]}
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