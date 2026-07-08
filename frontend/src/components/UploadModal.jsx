"use client";

import { IoClose } from "react-icons/io5";
import { FiUpload, FiFileText } from "react-icons/fi";

export default function UploadModal() {
  return (
    <div className="min-h-screen bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Import Leads via CSV
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Upload a CSV file to bulk import leads into your system.
            </p>
          </div>

          <button className="text-gray-400 hover:text-gray-700 transition">
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="border-2 border-dashed border-gray-300 rounded-xl py-6 px-5 text-center hover:border-teal-500 transition cursor-pointer">

            {/* Upload Icon */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center justify-center">
                <FiUpload
                  size={24}
                  className="text-teal-600"
                />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              Drop your CSV file here
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>

            {/* Supported File */}
            <div className="inline-flex items-center gap-2 mt-4 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600">
              <span>ⓘ</span>
              Supported file: <strong>.csv</strong> (max 5MB)
            </div>

            {/* Description */}
            <p className="text-[11px] leading-5 text-gray-500 mt-4 max-w-md mx-auto">
              Required headers:
              <br />
              created_at, name, email, country_code,
              mobile_without_country_code,
              company, city, state, country,
              lead_owner, crm_status, crm_note.
              <br />
              Template includes default + custom CRM
              fields to reduce upload errors.
            </p>

            {/* Download Button */}
            <button
              className="mt-5 inline-flex items-center gap-2
              bg-teal-50
              hover:bg-teal-100
              text-teal-700
              px-4
              py-2
              rounded-lg
              text-sm
              font-medium
              transition"
            >
              <FiFileText size={16} />
              Download Sample CSV Template
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100">

          <button
            className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            disabled
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white bg-orange-300 cursor-not-allowed"
          >
            Upload File
          </button>

        </div>

      </div>
    </div>
  );
}