import React from "react";
import { Address } from "./scaffold-eth";
import CopyToClipboard from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const Profile = ({ user, data, address }: { user: string; data: any; address: string }) => {
  const [valueCopied, setValueCopied] = React.useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{user} Profile</h1>
      <Address address={address} />
      <div className="grid grid-cols-2 gap-y-2">
        {data?.name && (
          <>
            {Object.entries(data).map(([key, value]) => {
              if (key.toLowerCase().includes("address") || key === "status") return null;
              return (
                <p key={key} className="text-gray-700">
                  <span className="font-semibold">{key}:</span>{" "}
                  <span className="flex items-center gap-1">
                    {value.length > 10 ? value?.slice(0, 6) + "..." + value?.slice(-4) : value}
                    {valueCopied ? (
                      <CheckCircleIcon
                        className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
                        aria-hidden="true"
                      />
                    ) : (
                      <CopyToClipboard
                        text={value as string}
                        onCopy={() => {
                          setValueCopied(true);
                          setTimeout(() => {
                            setValueCopied(false);
                          }, 800);
                        }}
                      >
                        <DocumentDuplicateIcon
                          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
                          aria-hidden="true"
                        />
                      </CopyToClipboard>
                    )}
                  </span>
                </p>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export { Profile };
