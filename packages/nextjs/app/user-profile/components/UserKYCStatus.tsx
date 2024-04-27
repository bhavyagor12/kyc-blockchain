import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const UserKYCStatus = ({ kycStatus }: { kycStatus: string }) => {
  const { address: connectedAddress } = useAccount();
  const [selectedBankAddress, setSelectedBankAddress] = React.useState<string>("");
  const { data: banksArray } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getAllBankAddresses",
  });

  const { data: customerInfo } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getCustomerInfo",
    args: [connectedAddress],
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

  const { writeContractAsync: applyKyc } = useScaffoldWriteContract("KYCVerification");
  console.log("bankInfo", bankInfo, selectedBankAddress, banksArray);
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
                <label htmlFor="bank" className="block text-lg font-semibold mb-2">
                  Bank name
                </label>
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

              <button
                className="btn btn-primary mt-2"
                onClick={() => {
                  if (
                    !customerInfo?.aadharIPFS ||
                    !customerInfo?.panIPFS ||
                    !customerInfo?.photoIPFS ||
                    !selectedBankAddress
                  ) {
                    throw new Error("Please upload all files");
                  }
                  applyKyc({
                    functionName: "sendDocsForKyc",
                    args: [
                      customerInfo?.aadharIPFS as string,
                      customerInfo?.panIPFS as string,
                      customerInfo?.photoIPFS as string,
                      selectedBankAddress as string,
                    ],
                  });
                }}
              >
                Apply for KYC
              </button>
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
