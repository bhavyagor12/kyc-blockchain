import React, { useEffect } from "react";
import { Profile } from "~~/components/Profile";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const UserCreateBankAccount = () => {
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

  const { writeContractAsync: createBankAccount } = useScaffoldWriteContract("KYCVerification");
  return (
    <div className="bg-base-100 rounded-md">
      {banksArray && bankInfo ? (
        <>
          <div className="bg-base-100 w-full h-full rounded-md">
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="bank" className="block text-lg font-semibold mb-2">
                  Bank name
                </label>
                <select onChange={e => setSelectedBankAddress(e.target.value)} className="select">
                  {banksArray.map((bank: string, index: number) => (
                    <option key={index} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                <Profile user="Bank" data={bankInfo} address={selectedBankAddress as string} />
              </div>

              <button
                className="btn btn-primary m-2"
                onClick={() =>
                  createBankAccount({
                    functionName: "openBankAccount",
                    args: [selectedBankAddress],
                  })
                }
              >
                Open Bank Account
              </button>
            </div>
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

export default UserCreateBankAccount;
