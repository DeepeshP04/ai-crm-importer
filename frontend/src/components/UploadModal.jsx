"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoClose } from "react-icons/io5";
import { FiUpload, FiFileText } from "react-icons/fi";

export default function UploadModal() {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert("Please upload a valid CSV file.");
      return;
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop,
  });

  return (
    <div className="min-h-screen bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-start justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold">
              Import Leads via CSV
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Upload a CSV file to bulk import leads.
            </p>
          </div>

          <IoClose
            size={20}
            className="cursor-pointer text-gray-500"
          />
        </div>

        {/* Upload */}

        <div className="p-5">

          <div
            {...getRootProps()}
            className={`
            border-2
            border-dashed
            rounded-xl
            py-6
            px-5
            text-center
            cursor-pointer
            transition

            ${
              isDragActive
                ? "border-teal-500 bg-teal-50"
                : "border-gray-300 hover:border-teal-500"
            }
          `}
          >
            <input {...getInputProps()} />

            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-xl border bg-white shadow-sm flex items-center justify-center">
                <FiUpload
                  size={24}
                  className="text-teal-600"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-4">
              {isDragActive
                ? "Drop the CSV here"
                : "Drop your CSV file here"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              or click to browse
            </p>

            <div className="inline-flex items-center gap-2 mt-4 bg-gray-100 rounded-full px-3 py-1 text-xs">
              Supported: .csv (Max 5MB)
            </div>

            {selectedFile && (
              <div className="mt-5 p-3 rounded-lg bg-green-50 border border-green-200 text-left">

                <p className="font-medium text-green-700">
                  Selected File
                </p>

                <p className="text-sm mt-1">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>

              </div>
            )}

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

            <button
              className="mt-5 inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg text-sm"
            >
              <FiFileText />
              Download Sample CSV
            </button>

          </div>

        </div>

        {/* Footer */}

        <div className="flex gap-3 p-5 border-t">

          <button className="flex-1 border rounded-lg py-2.5 text-sm font-semibold">
            Cancel
          </button>

          <button
            disabled={!selectedFile}
            className={`
              flex-1
              rounded-lg
              py-2.5
              text-sm
              font-semibold
              text-white

              ${
                selectedFile
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-orange-300 cursor-not-allowed"
              }
            `}
          >
            Upload File
          </button>

        </div>

      </div>
    </div>
  );
}