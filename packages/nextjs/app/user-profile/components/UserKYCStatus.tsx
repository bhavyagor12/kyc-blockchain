import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { Profile } from "~~/components/Profile";
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
  return (
    <div className="bg-base-100 rounded-md">
      {banksArray && bankInfo ? (
        <>
          <div className="bg-base-100 w-full h-full rounded-md">
            <h1 className="flex items-center justify-center text-center">
              <span className="block text-2xl mb-2">KYC Status: {kycStatus}</span>
            </h1>
            {kycStatus !== "Verified" && (
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center justify-center w-full">
                  <select onChange={e => setSelectedBankAddress(e.target.value)} className="select">
                    {banksArray.map((bank: string, index: number) => (
                      <option key={index} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>{" "}
                  <div className="mt-2 w-full">
                    <Profile user="Bank" data={bankInfo} address={selectedBankAddress} />
                  </div>
                </div>

                <button
                  className="btn btn-primary m-2"
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
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-96">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}
    </div>
  );
};

export default UserKYCStatus;
