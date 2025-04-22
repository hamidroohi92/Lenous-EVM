import {
  LP_CONTRACT_ADDRESS,
  LP_TOKEN_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
} from "@/app/_libs/utils/constants/contractAddresses";
import { useEthersSigner } from "@/app/_libs/utils/ethers";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { baseSepolia, sepolia } from "viem/chains";
import LpABI from "../../_libs/ABIs/LiquidityPool.json";
import TokenABI from "../../_libs/ABIs/TokenContract.json";
import { handleGetNonce } from "@/app/dataRequests/userDataRequests";
import { useAccount } from "wagmi";
import {
  getTokenPrice,
  handleGetSignatureForDeposit,
} from "@/app/dataRequests/lpDataRequests";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

interface Duration {
  label: string;
  value: number;
}
const durationList: Duration[] = [
  {
    value: 30,
    label: "1 Month",
  },
  {
    value: 60,
    label: "2 Months",
  },
  {
    value: 90,
    label: "3 Months",
  },
  {
    value: 120,
    label: "6 Months",
  },
];

export default function StakeModal({ isOpen, handleClose }: Props) {
  const { address } = useAccount();
  const [duration, setDuration] = useState<number>(2);
  const [amount, setAmount] = useState<string>("");
  const [lpAmount, setLpAmount] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [lpBalance, setLpBalance] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      getTokenPrice()
        .then((res) => {
          setTokenAmount(+amount / res.data.tokenPrice);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  }, [amount]);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "32px 24px",
      width: "800px",
      height: "650px",
      background: "#ffffff26",
      backdropFilter: "blur(20px)",
      border: "none",
      "overflow-y": "hidden",
    },
    overlay: {
      background: "#8686866e",
      overflow: "auto",
      zIndex: "20",
    },
  };

  const signer = useEthersSigner({ chainId: sepolia.id });

  const handleGetLpBalance = async () => {
    console.log("check balance");
    const contract = new ethers.Contract(
      LP_CONTRACT_ADDRESS,
      LpABI.abi,
      signer
    );

    const balances = await contract.balances(address);
    console.log("lp balances", parseInt(balances._hex, 16));
    setLpBalance(parseInt(balances._hex, 16) / 10 ** 18);
  };

  const handleStake = async () => {
    if (address) {
      handleClose();
      const contract = new ethers.Contract(
        LP_CONTRACT_ADDRESS,
        LpABI.abi,
        signer
      );

      const tokenContract = new ethers.Contract(
        LP_TOKEN_CONTRACT_ADDRESS,
        TokenABI.abi,
        signer
      );
      const deadline = new Date().getTime() + 5 * 60 * 1000;
      let signature;

      // await handleGetSignatureForDeposit(
      //   +amount,
      //   +tokenAmount,
      //   deadline,
      //   address.toString()
      // ).then((res) => {
      //   signature = res.data.signature;
      // });
      // if (signature) {
      const approveTx = await tokenContract.approve(
        LP_CONTRACT_ADDRESS,
        BigInt(amount) * BigInt(10 ** 18)
      );

      await approveTx.wait();

      console.log(BigInt(amount) * BigInt(10 ** 18));
      await contract
        .provideLiquidity(
          BigInt(amount) * BigInt(10 ** 18),
          1

          // ethers.utils.parseUnits(tokenAmount.toString(), 18).toString(),
          // deadline,
          // signature
        )
        .then((res: any) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      // }
    }
  };

  useEffect(() => {
    setLpAmount(+amount * 0.1);
  }, [amount]);

  useEffect(() => {
    setAmount("");
    if (isOpen) {
      handleGetLpBalance();
    }
  }, [isOpen]);

  return (
    <Modal
      onRequestClose={handleClose}
      isOpen={isOpen}
      ariaHideApp={false}
      style={customStyles}
    >
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold text-white font-poppins">
          Add Liquidity
        </h1>{" "}
        <div>
          <h2 className="text-md mb-2 font-medium text-white font-poppins">
            You have already deposited ${lpBalance} into LP
          </h2>
          <div className="font-poppins italic flex items-center gap-3 w-full">
            <div className="flex items-center justify-between bg-white-bg-05 py-2 px-6 rounded-2xl w-[75%]">
              <div>
                <p className="text-neutral-light text-md">USDC</p>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const regex = /^[0-9]*\.?[0-9]*$/;
                    if (regex.test(inputValue)) {
                      setAmount(inputValue);
                    }
                  }}
                  placeholder="Amount"
                  className="bg-transparent text-white text-2xl font-poppins italic flex-grow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="https://cdn.moralis.io/eth/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] object-contain"
                  alt="USDC Token"
                />
                <p className="text-white">USDC</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white-bg-05 py-2 px-6 rounded-2xl w-[25%] flex-shrink-0">
              <div>
                <p className="text-neutral-light text-md">LP Token</p>
                <p className="text-neutral-light text-2xl">
                  {tokenAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between font-poppins italic">
          <h3 className="text-2xl text-white">Duration</h3>
          <div className="flex items-center gap-2">
            {durationList.map((item: Duration) => (
              <div
                key={item + "leverage"}
                onClick={() => {
                  setDuration(item.value);
                }}
                className={`flex items-center justify-center py-2 px-5 rounded-4xl cursor-pointer w-fit ${
                  item.value === duration
                    ? "bg-[#4E8AFF80]"
                    : "border-sold border-[1px] border-neutral-light bg-transparent"
                }`}
              >
                <p
                  className={`text-sm ${
                    item.value === duration
                      ? "text-white"
                      : "text-neutral-light"
                  }`}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white-bg-05 rounded-2xl py-4 px-6 flex flex-col gap-4 font-poppins italic">
          <div className="flex justify-between items-center">
            <p className="text-neutral-light flex items-center gap-2 text-md">
              Fee
              <span className="bg-[#2775CA40] text-white py-[6px] px-[12px] rounded-2xl block text-sm">
                USDC
              </span>
            </p>
            <p className="text-white ">-</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-neutral-light">Max Slippage</p>
            <p className="text-white ">0.00%</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-neutral-light">Estimated Time</p>
            <p className="text-white ">{"<"} 30 minutes</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-neutral-light">Account Leverage</p>
            <p className="text-white ">-</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-[#EAB3081a] rounded-4xl font-poppins italic py-3 px-6 flex items-center gap-2">
            <span className="bg-[url('/icons/warningIcon.svg')] bg-no-repeat bg-center block w-[28px] h-[28px] bg-contain" />
            <p className="text-white">
              This Pool is on High Risk, Reference site about Lorem Ipsum{" "}
            </p>
          </div>
          <button
            onClick={() => {
              handleStake();
            }}
            className="bg-[#4E8AFF80] text-white italic font-poppins rounded-4xl py-4"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
