"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [progress, setProgress] = useState({
    stage: "idle",
    percent: 0,
    message: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("ai-crm-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = storedTheme ? storedTheme === "dark" : prefersDark;
    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("ai-crm-theme", next ? "dark" : "light");
      return next;
    });
  };

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
      setProgress({
        stage: "uploading",
        percent: 10,
        message: "Uploading CSV to AI import pipeline...",
      });

      const response = await uploadCSV(selectedFile, ({ loaded, total }) => {
        const percent = total ? Math.min(80, Math.round((loaded / total) * 60) + 10) : 10;
        setProgress((prev) => ({
          ...prev,
          stage: "uploading",
          percent,
          message: "Uploading CSV to AI import pipeline...",
        }));
      });

      setProgress({
        stage: "processing",
        percent: 80,
        message: "AI processing started. This may take a moment...",
      });

      setResult(response);
      setIsConfirmed(true);
      setProgress({
        stage: "done",
        percent: 100,
        message: "AI processing completed successfully.",
      });
    } catch (err) {
      setError(err.message || "Import failed. Please try again.");
      setProgress({
        stage: "error",
        percent: 0,
        message: "Processing failed. Please retry.",
      });
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
            <IoClose size={20} className="cursor-pointer text-gray-500" />
          </div>
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

              <p className="text-[12px] leading-5 text-gray-500 mt-4 max-w-md mx-auto">
                Required headers: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note. Template includes default + custom CRM fields to reduce upload errors.
              </p>

              <button
  type="button"
  onClick={() => {
    const link = document.createElement("a");
    link.href = "/sample-leads.csv";
    link.download = "Sample_CRM_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
  className="mt-7 inline-flex items-center gap-2
  bg-teal-50
  hover:bg-teal-100
  text-teal-700
  px-5
  py-3
  rounded-xl
  font-medium
  transition"
>
  <FiFileText />
  Download Sample CSV Template
</button>

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
                setProgress({ stage: "idle", percent: 0, message: "" });
              }}
            />
          )}
        </div>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        {progress.stage !== "idle" && (
          <div className="px-5 pb-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{progress.stage === "uploading" ? "Uploading" : progress.stage === "processing" ? "AI Processing" : progress.stage === "done" ? "Complete" : "Error"}</p>
                  <p className="mt-1 text-xs text-slate-500">{progress.message}</p>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {progress.percent}%
                </span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          </div>
        )}

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
        setProgress({ stage: "idle", percent: 0, message: "" });
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
      {loading ? "Processing..." : isConfirmed ? "Import Confirmed" : "Upload File"}
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
