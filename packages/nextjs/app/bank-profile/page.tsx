"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KycRequest from "./components/KycRequest";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import StringTable from "~~/components/StringTable";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const filterOutEmptyStringsAnd0xAddress = (arr: string[]): string[] => {
  if (!arr) return [];
  return arr.filter(str => str !== "" && str !== "0x0000000000000000000000000000000000000000");
};

const BankProfile: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const [requestId, setRequestId] = useState<string>("");
  const { data: role, refetch: refetchRole } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getRoleOfAddress",
    args: [connectedAddress],
  });

  const { data: bankInfo } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getBankInfo",
    args: [connectedAddress],
  });
  const { data: kycRequests, refetch: refetchBankKycRequests } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getBankKycRequests",
    args: [connectedAddress],
  });
  useEffect(() => {
    refetchRole();
  }, [connectedAddress, refetchRole]);
  useEffect(() => {
    if (!connectedAddress) return;
    refetchBankKycRequests();
    setRequestId("");
  }, [connectedAddress, refetchBankKycRequests]);
  console.log(role);
  if (role !== "Bank") {
    return (
      <div className="flex flex-col gap-2 bg-base-300 w-full h-full pt-4">
        <h1 className="text-2xl font-bold text-center">You are not authorized to access this page</h1>
      </div>
    );
  }
  return (
    <div className="bg-base-300 w-full h-full">
      <h1 className="flex flex-col items-center gap-2 text-center">
        <span className="block text-2xl mb-2">Welcome to {bankInfo?.name} Bank</span>
        <Address address={connectedAddress} />
        <span>Customers: {filterOutEmptyStringsAnd0xAddress(bankInfo?.customers as string[]).length}</span>
        <StringTable
          title="Customers"
          strings={filterOutEmptyStringsAnd0xAddress(bankInfo?.customers as string[])}
          onRowClick={address => {
            router.push(`/customer/${address}`);
          }}
        />
      </h1>
      <div className="flex items-start justify-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <StringTable
            title="Open Requests For KYC"
            strings={kycRequests as string[]}
            onRowClick={string => {
              setRequestId(string);
            }}
          />
        </div>
        <KycRequest key={requestId} requestId={requestId} />
      </div>
    </div>
  );
};

export default BankProfile;
