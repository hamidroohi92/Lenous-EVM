import { tokenList } from "@/app/_libs/utils/constants/TokenList";
import { useEthersSigner } from "@/app/_libs/utils/ethers";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { sepolia } from "viem/chains";
import TokenABI from "../../_libs/ABIs/TokenContract.json";
import { TOKEN_CONTRACT_ADDRESS } from "@/app/_libs/utils/constants/contractAddresses";

interface Props {
  visible: boolean;
  handleClose: () => void;
}

export default function FaucetModal({ visible, handleClose }: Props) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "32px 24px",
      width: "400px",
      background: "#ffffff26",
      backdropFilter: "blur(20px)",
      border: "none",
      "overflow-y": "hidden",
      borderRadius: "1rem",
    },
    overlay: {
      background: "#8686866e",
      overflow: "auto",
      zIndex: "20",
    },
  };

  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const signer = useEthersSigner({ chainId: sepolia.id });
  const tokenContract = new ethers.Contract(
    TOKEN_CONTRACT_ADDRESS,
    TokenABI,
    signer
  );

  const handleFaucet = async () => {
    handleClose();

    await tokenContract
      .mint(address, +amount * 10 ** 18)
      .then((res: any) => {
        setAddress("");
        setAmount("");
      })
      .catch((err: any) => {
        console.log(err);
        setAddress("");
        setAmount("");
      });
  };

  useEffect(() => {
    setAmount("");
    setAddress("");
  }, [visible]);

  return (
    <Modal
      isOpen={visible}
      onRequestClose={handleClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="flex flex-col font-poppins italic h-full">
        <h2 className="text-white text-lg font-light mb-4">
          Faucet Test Tokens
        </h2>
        <label className="font-poppins italic text-white mb-1 font-normal text-sm">
          Wallet Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          placeholder="Enter your target address"
          className="mb-4 mt-1 block w-full  px-4 py-3  rounded-2xl text-white bg-white-bg-15 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <label className="font-poppins italic text-white mb-1 font-normal text-sm">
          Amount
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          placeholder="Enter your needed amount"
          className="mb-8 mt-1 block w-full  px-4 py-3  rounded-2xl text-white bg-white-bg-15 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={handleFaucet}
          className="bg-platform-bg-gradient text-white text-2xl h-[60px] rounded-2xl font-poppins italic"
        >
          Faucet
        </button>
      </div>
    </Modal>
  );
}
