import React from "react";

const StringTable = ({
  strings,
  onRowClick,
  title,
}: {
  strings: string[];
  onRowClick: (string: string) => void;
  title: string;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">{title}</th>
          </tr>
        </thead>
        <tbody>
          {strings?.length > 0 ? (
            strings.map((string, index) => (
              <tr key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => onRowClick(string)}>
                <td className="border px-4 py-2">{string}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center py-4">No entry found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StringTable;
