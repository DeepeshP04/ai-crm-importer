"use client";

import { IoClose } from "react-icons/io5";
import { FiUpload, FiFileText } from "react-icons/fi";

export default function UploadModal() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Import Leads via CSV
            </h2>

            <p className="text-gray-500 mt-1">
              Upload a CSV file to bulk import leads into your system.
            </p>
          </div>

          <button className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        {/* Upload Area */}

        <div className="px-6">

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">

            <div className="flex justify-center">

              <div className="w-20 h-20 rounded-xl border bg-white flex items-center justify-center shadow-sm">
                <FiUpload
                  size={34}
                  className="text-teal-600"
                />
              </div>

            </div>

            <h3 className="text-3xl font-bold mt-8">
              Drop your CSV file here
            </h3>

            <p className="text-gray-500 mt-2">
              or click to browse files
            </p>

            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mt-6 text-sm text-gray-600">
              <span>ⓘ</span>
              Supported file: .csv (max 5MB)
            </div>

            <p className="mt-6 text-sm text-gray-500 leading-6">
              Required headers: created_at, name, email,
              country_code, mobile_without_country_code,
              company, city, state, country, lead_owner,
              crm_status, crm_note.

              Template includes default + custom CRM fields
              to reduce upload errors.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-6 py-3 rounded-xl font-medium transition">

              <FiFileText />

              Download Sample CSV Template

            </button>

          </div>

        </div>

        {/* Footer */}

        <div className="flex gap-4 p-6">

          <button className="flex-1 border rounded-xl py-4 text-lg font-semibold hover:bg-gray-50 transition">

            Cancel

          </button>

          <button
            disabled
            className="flex-1 rounded-xl py-4 bg-orange-300 text-white text-lg font-semibold cursor-not-allowed"
          >
            Upload File
          </button>

        </div>

      </div>
    </div>
  );
}