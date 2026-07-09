"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoClose } from "react-icons/io5";
import { FiUpload, FiFileText } from "react-icons/fi";
import Papa from "papaparse";
import PreviewTable from "./PreviewTable";
import { uploadCSV } from "@/services/api";
import ResultTable from "./ResultTable";

export default function UploadModal() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      alert("Please upload a valid CSV file.");
      return;
    }

    const file = acceptedFiles[0];

    setSelectedFile(file);
    setResult(null);
    setError("");
    setIsConfirmed(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors?.length) {
          setError("The selected CSV could not be parsed cleanly. Please verify the file and try again.");
          setCsvData([]);
          setHeaders([]);
          return;
        }

        setCsvData(results.data);
        setHeaders(results.meta.fields || []);
      },
      error: () => {
        setError("The selected CSV could not be parsed. Please try another file.");
        setCsvData([]);
        setHeaders([]);
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError("");

      const response = await uploadCSV(selectedFile);

      setResult(response);
      setIsConfirmed(true);
    } catch (err) {
      setError(err.message || "Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}

        <div className="flex items-start justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold">Import Leads via CSV</h2>

            <p className="text-xs text-gray-500 mt-1">
              Upload a CSV file to bulk import leads.
            </p>
          </div>

          <IoClose size={20} className="cursor-pointer text-gray-500" />
        </div>

        {/* Upload */}

        <div className="p-5">
          {result ? (

<ResultTable result={result} />

) : !selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl py-6 px-5 text-center cursor-pointer transition
      ${
        isDragActive
          ? "border-teal-500 bg-teal-50"
          : "border-gray-300 hover:border-teal-500"
      }`}
            >
              <input {...getInputProps()} />

              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-xl border bg-white shadow-sm flex items-center justify-center">
                  <FiUpload size={24} className="text-teal-600" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-4">
                {isDragActive ? "Drop the CSV here" : "Drop your CSV file here"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">or click to browse</p>

              <div className="inline-flex items-center gap-2 mt-4 bg-gray-100 rounded-full px-3 py-1 text-xs">
                Supported: .csv (Max 5MB)
              </div>

              <p className="text-[11px] leading-5 text-gray-500 mt-4 max-w-md mx-auto">
                The importer is designed for arbitrary column names and layouts.
                It will intelligently map your columns to CRM fields after previewing the file.
              </p>
            </div>
          ) : (
            <PreviewTable
              file={selectedFile}
              headers={headers}
              rows={csvData.slice(0, 20)}
              onRemove={() => {
                setSelectedFile(null);
                setCsvData([]);
                setHeaders([]);
                setResult(null);
                setError("");
                setIsConfirmed(false);
              }}
            />
          )}
        </div>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        {!result && selectedFile && !loading && (
          <div className="px-5 pb-5">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">Preview ready</p>
              <p className="mt-1">
                Review the uploaded rows above, then confirm to send the data to the AI-powered import pipeline.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}

{!result && (
  <div className="flex gap-3 p-5 border-t">
    <button
      onClick={() => {
        setSelectedFile(null);
        setCsvData([]);
        setHeaders([]);
        setError("");
        setIsConfirmed(false);
      }}
      className="flex-1 border rounded-lg py-2.5 text-sm font-semibold"
    >
      Cancel
    </button>

    <button
      onClick={handleUpload}
      disabled={!selectedFile || loading || isConfirmed}
      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white
      ${
        loading
          ? "bg-gray-400 cursor-wait"
          : selectedFile && !isConfirmed
          ? "bg-orange-500 hover:bg-orange-600"
          : "bg-orange-300 cursor-not-allowed"
      }`}
    >
      {loading ? "Processing..." : isConfirmed ? "Import Confirmed" : "Confirm Import"}
    </button>
  </div>
)}

        {/* {result && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p>
              Successfully imported
              <strong>{result.summary.imported}</strong>
              records
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
