import React from "react";
import { Address } from "./scaffold-eth";
import { useAccount } from "wagmi";

const Profile = ({ user, data }: { user: string; data: any }) => {
  const { address: connectedAddress } = useAccount();
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{user} Profile</h1>
      <Address address={connectedAddress} />
      <div className="grid grid-cols-2 gap-y-2">
        {Object.entries(data).map(([key, value]) => (
          <p key={key} className="text-gray-700">
            <span className="font-semibold">{key}:</span> {value}
          </p>
        ))}{" "}
      </div>
    </div>
  );
};

export { Profile };
