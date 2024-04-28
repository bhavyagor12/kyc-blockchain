"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserCreateBankAccount from "./components/UserCreateBankAccount";
import UserKYCStatus from "./components/UserKYCStatus";
import { UserRegForm } from "./components/UserRegForm";
import { Switch } from "@mui/material";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Profile } from "~~/components/Profile";
import StringTable from "~~/components/StringTable";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const processStatus = (status: number): string => {
  if (status === 0) return "Pending";
  if (status === 1) return "Verified";
  if (status === 2) return "Rejected";
  if (status === 3) return "Under review";
  return "Pending";
};

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const { data: customerInfo, refetch } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getCustomerInfo",
    args: [connectedAddress],
  });
  const { writeContractAsync } = useScaffoldWriteContract("KYCVerification");
  const [edit, setEdit] = useState<boolean>(false);
  useEffect(() => {
    refetch();
  }, [connectedAddress, refetch]);
  console.log(customerInfo?.status);
  return (
    <div className="bg-base-300 w-full h-full">
      <h1 className="text-center">
        <span className="block text-2xl mb-2">Welcome to your Customer Profile</span>
      </h1>
      {!customerInfo || customerInfo?.name === "" ? (
        <UserRegForm edit={false} isReadOnly={false} />
      ) : (
        <>
          Edit <Switch onChange={() => setEdit(!edit)} value={edit} />
          {edit ? (
            <UserRegForm edit={edit} isReadOnly={false} customerInfo={customerInfo} />
          ) : (
            <div className="flex items-start justify-center gap-2">
              <Profile user="User" data={customerInfo} address={connectedAddress as string} />
              <div className="flex flex-col gap-2 w-full">
                <UserKYCStatus kycStatus={processStatus(customerInfo.status)} />
                <StringTable
                  title="Bank Accounts"
                  strings={customerInfo.banksAccounts as string[]}
                  onRowClick={address => {
                    if (!window.confirm("Are you sure you want to remove this bank account?")) {
                      router.push(`/bank/${address}`);
                      return;
                    }
                    writeContractAsync({
                      functionName: "removeBankAccount",
                      args: [address],
                    });
                    /* Do nothing */
                  }}
                />
                {customerInfo.status === 1 && <UserCreateBankAccount />}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
