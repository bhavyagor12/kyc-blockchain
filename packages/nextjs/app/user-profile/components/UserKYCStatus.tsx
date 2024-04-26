import React, { useEffect } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const UserKYCStatus = ({ kycStatus }: { kycStatus: string }) => {
  const [selectedBankAddress, setSelectedBankAddress] = React.useState<string>("");
  const { data: banksArray } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getAllBankAddresses",
  });

  const { data: bankInfo, refetch } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getBankInfo",
    args: [selectedBankAddress],
  });

  useEffect(() => {
    if (!banksArray) return;
    setSelectedBankAddress(banksArray[0]);
  }, [banksArray]);
  useEffect(() => {
    if (!selectedBankAddress || selectedBankAddress === "") return;

    refetch();
  }, [selectedBankAddress, refetch]);
  console.log(banksArray, bankInfo);
  return (
    <>
      {banksArray && bankInfo ? (
        <>
          <div className="bg-base-300 w-full h-full">
            <h1 className="text-center">
              <span className="block text-2xl mb-2">KYC Status</span>
              <span className="block text-lg mb-2">{kycStatus}</span>
            </h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-center w-full">
                <select
                  onChange={e => setSelectedBankAddress(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  {banksArray.map((bank: string, index: number) => (
                    <option key={index} value={bank}>
                      {bankInfo.name}
                    </option>
                  ))}
                </select>{" "}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-96">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}
    </>
  );
};

export default UserKYCStatus;
