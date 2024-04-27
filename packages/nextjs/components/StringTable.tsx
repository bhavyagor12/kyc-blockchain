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
  const filteredStrings = strings?.filter(
    string => string !== "" && string !== "0x0000000000000000000000000000000000000000",
  );
  return (
    <div className="overflow-x-auto bg-base-100">
      <table className="table-auto w-full border ">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-primary-900">{title}</th>
          </tr>
        </thead>
        <tbody>
          {filteredStrings?.length > 0 ? (
            filteredStrings.map((string, index) => (
              <tr key={index} className="cursor-pointer hover:bg-base-100 " onClick={() => onRowClick(string)}>
                <td className="border px-4 py-2 text-center">
                  {string.length > 10 ? string.slice(0, 6) + "..." + string.slice(-4) : string}
                </td>
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
