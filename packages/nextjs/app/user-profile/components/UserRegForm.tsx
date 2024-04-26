import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const UserRegForm = ({
  edit,
  isReadOnly,
  customerInfo,
}: {
  edit: boolean;
  isReadOnly: boolean;
  customerInfo: {
    name: string;
    age: string;
    phoneNumber: string;
    aadharIPFS: string;
    panIPFS: string;
    photoIPFS: string;
  };
}) => {
  const { address: connectedAddress } = useAccount();
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [aadharHash, setAadharHash] = useState<string>("");
  const [panHash, setPanHash] = useState<string>("");
  const [photoHash, setPhotoHash] = useState<string>("");

  useEffect(() => {
    if (!customerInfo) return;
    setName(customerInfo.name);
    setAge(customerInfo.age);
    setPhone(customerInfo.phoneNumber);
    setAadharHash(customerInfo.aadharIPFS);
    setPanHash(customerInfo.panIPFS);
    setPhotoHash(customerInfo.photoIPFS);
  }, [customerInfo]);
  const { writeContractAsync } = useScaffoldWriteContract("KYCVerification");
  const uploadToIPFS = async (file: File, name: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify({ name }));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    };
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", options);
    const data = await response.json();
    return data.IpfsHash;
  };
  const handleChange = async () => {
    if (!aadharFile || !panFile || !photoFile) {
      throw new Error("Please upload all files");
    }
    const aadharHash = await uploadToIPFS(aadharFile, "aadhar"+connectedAddress);
    const panHash = await uploadToIPFS(panFile, "pan"+connectedAddress);
    const photoHash = await uploadToIPFS(photoFile, "photo"+connectedAddress);

    // Your submit logic here
    await writeContractAsync({
      functionName: !edit ? "addCustomer" : "updateCustomer",
      args: [name, age, phone, aadharHash, panHash, photoHash],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isReadOnly && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">{edit ? "Edit" : "Create"} Form For User:</h2>
          <Address address={connectedAddress} />
        </div>
      )}

      <div className="max-w-md mx-auto">
        <label htmlFor="name" className="block text-lg font-semibold mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          name="name"
          placeholder="Enter your name"
          className="input input-bordered"
        />
        <label htmlFor="age" className="block text-lg font-semibold mb-2 mt-4">
          Age
        </label>
        <input
          type="text"
          id="age"
          value={age}
          name="age"
          onChange={e => setAge(e.target.value)}
          className="input input-bordered"
        />
        <label htmlFor="phone" className="block text-lg font-semibold mb-2 mt-4">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="input input-bordered"
        />

        <FileUploadSection
          label="Aadhar"
          file={aadharFile}
          setFile={setAadharFile}
          hash={aadharHash}
          setHash={setAadharHash}
        />
        <FileUploadSection label="PAN" file={panFile} setFile={setPanFile} hash={panHash} setHash={setPanHash} />
        <FileUploadSection
          label="Photo"
          file={photoFile}
          setFile={setPhotoFile}
          hash={photoHash}
          setHash={setPhotoHash}
        />

        {!isReadOnly && (
          <button className="btn btn-success w-full mt-8" onClick={handleChange}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

const FileUploadSection = ({
  label,
  file,
  setFile,
  hash,
}: {
  label: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  hash: string;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="mt-6">
      <label htmlFor={label} className="block text-lg font-semibold mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4 mt-2">
        {hash ? (
          <div className="flex flex-col items-center">
            <img
              src={`https://amber-causal-cougar-937.mypinata.cloud/ipfs/${hash}`}
              alt={`${label} from IPFS`}
              className="rounded-lg"
              width={"250px"}
            />
            <label htmlFor={label} className="text-lg font-semibold mt-2">
              Update {label}
            </label>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="file-input mt-1" />
          </div>
        ) : (
          <>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="file-input" />
            <span className="text-sm text-gray-500">No file chosen</span>
          </>
        )}
      </div>
    </div>
  );
};

export { UserRegForm };
