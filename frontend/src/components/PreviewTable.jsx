"use client";

import { useMemo, useRef, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function PreviewTable({
  file,
  headers,
  rows,
  onRemove,
}) {
  const ROW_HEIGHT = 42;
  const CONTAINER_HEIGHT = 280;
  const listRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const rowCount = rows.length;
  const visibleCount = Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + 3;

  const { startIndex, visibleRows, paddingTop, paddingBottom } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 1);
    const end = Math.min(rowCount, start + visibleCount);
    const visible = rows.slice(start, end);
    const top = start * ROW_HEIGHT;
    const bottom = Math.max(0, rowCount * ROW_HEIGHT - top - visible.length * ROW_HEIGHT);

    return {
      startIndex: start,
      visibleRows: visible,
      paddingTop: top,
      paddingBottom: bottom,
    };
  }, [rows, rowCount, scrollTop, visibleCount]);

  const handleScroll = (event) => {
    setScrollTop(event.target.scrollTop);
  };

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

          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${CONTAINER_HEIGHT}px` }}
            onScroll={handleScroll}
            ref={listRef}
          >

            <table className="min-w-full text-sm">

              <thead className="sticky top-0 bg-gray-100 z-10">

                <tr>

                  {headers.map((header) => (
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
                {paddingTop > 0 && (
                  <tr style={{ height: `${paddingTop}px` }}>
                    <td colSpan={headers.length} />
                  </tr>
                )}

                {visibleRows.map((row, index) => (
                  <tr key={startIndex + index} className="hover:bg-gray-50">
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="px-4 py-3 border-b whitespace-nowrap"
                        style={{ height: `${ROW_HEIGHT}px` }}
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}

                {paddingBottom > 0 && (
                  <tr style={{ height: `${paddingBottom}px` }}>
                    <td colSpan={headers.length} />
                  </tr>
                )}
              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}