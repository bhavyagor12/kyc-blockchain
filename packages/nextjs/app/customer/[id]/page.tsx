"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import type { NextPage } from "next";
import { Profile } from "~~/components/Profile";
import StringTable from "~~/components/StringTable";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const CustomerPage: NextPage = () => {
  const params = useParams();
  const { id } = params;
  const { data: customerInfo, refetch } = useScaffoldReadContract({
    contractName: "KYCVerification",
    functionName: "getCustomerInfo",
    args: [id as string],
  });
  useEffect(() => {
    refetch();
  }, [id, refetch]);
  return (
    <div className="flex flex-col gap-2 bg-base-300 w-full h-full">
      <h1 className="text-center">
        <span className="block text-2xl mb-2">Welcome to {customerInfo?.name} Profile</span>
      </h1>
      <Profile user="Customer" data={customerInfo} address={id as string} />
      <StringTable
        title="Bank Accounts"
        strings={customerInfo?.banksAccounts as string[]}
        onRowClick={() => {
          console.log("Do nothing");
        }}
      />
    </div>
  );
};

export default CustomerPage;
