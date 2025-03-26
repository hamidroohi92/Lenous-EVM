import { tokenList } from "@/app/_libs/utils/constants/TokenList";
import { Order_Type, OrderToPlace } from "@/app/types/order";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAccount, useBalance } from "wagmi";
import { sepolia } from "viem/chains";
import { TOKEN_CONTRACT_ADDRESS } from "@/app/_libs/utils/constants/contractAddresses";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleDeposit: () => void;
  amount: number;
  setAmount: (amount: number) => void;
}

export default function DepositModal({
  visible,
  handleClose,
  handleDeposit,
  amount,
  setAmount,
}: Props) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "32px 24px",
      width: "600px",
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

  const { address } = useAccount();
  const { data, error, isLoading } = useBalance({
    address: address, // Replace with your address
    token: TOKEN_CONTRACT_ADDRESS, // USDC token address on Base Sepolia
    chainId: sepolia.id,
  });

  const [percent, setPercent] = useState<number | string>(0);

  const percentList: (string | number)[] = [25, 50, 75, "max"];

  const schema = yup
    .object({
      amount: yup.number().positive().required(),
    })
    .required();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      amount: 0,
    });
    setPercent(0);
  }, [visible]);

  return (
    <Modal
      isOpen={visible}
      onRequestClose={handleClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="flex flex-col font-poppins italic h-full font-light">
        <h2 className="text-white text-xl font-light">Deposit</h2>
        <p className="text-neutral-light mt-3">
          USDC deposits from <Link href={"/"}>select chains</Link> have the
          lowest fees. Other deposits may have additional third-party fees.
        </p>

        <div className="flex items-center justify-between text-white mt-10 text-xl">
          <h3>Available</h3>
          {isLoading ? "..." : <p>{data ? data.formatted : "0"} USDC</p>}
        </div>
        <div className="bg-white-bg-05 rounded-2xl text-3xl text-neutral-light flex items-center py-3 px-8 mt-3">
          <input
            {...register("amount")}
            type="text"
            value={amount === 0 ? "" : amount}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numericValue = inputValue.replace(/[^0-9]/g, "");
              setAmount(+numericValue);
            }}
            placeholder="Amount"
            className="bg-transparent font-poppins italic flex-grow"
          />
          <span className="flex-shrink-0">USDC</span>
        </div>
        <p className="text-bad-situation text-sm mt-1">
          {errors.amount?.message}
        </p>
        {data && amount > +data?.formatted && (
          <p className="text-bad-situation text-sm mt-1">
            insufficient Balance
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {percentList.map((item: string | number) => (
            <button
              key={item}
              onClick={() => {
                if (data) {
                  if (item === "max") {
                    reset({
                      amount: +data?.formatted,
                    });
                  } else {
                    reset({
                      amount: (+item * +data.formatted) / 100,
                    });
                  }
                }
                setPercent(item);
              }}
              className={`w-[24%] text-center h-9 rounded-2xl text-neutral-light text-xl ${
                item === percent
                  ? "bg-green-linear-gradient border-none"
                  : "bg-transparent border-neutral-light border-solid border-[1px]"
              }`}
            >
              {item + (typeof item === "number" ? "%" : "")}
            </button>
          ))}
        </div>
        <div className="mt-10 bg-white-bg-05 rounded-2xl py-4 px-8 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-neutral-light">
              Expected Deposit Amount
              <span className="bg-platform-bg-gradient rounded-2xl text-white py-1 px-3 bold ml-2 text-sm">
                USDC
              </span>
            </h2>
            <p className="text-lg text-white font-bold">-</p>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-neutral-light">
              Equity
              <span className="bg-platform-bg-gradient rounded-2xl text-white py-1 px-3 bold ml-2 text-sm">
                USDC
              </span>
            </h2>
            <p className="text-lg text-white font-bold">-</p>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-neutral-light">
              Buying Power
              <span className="bg-platform-bg-gradient rounded-2xl text-white py-1 px-3 bold ml-2 text-sm">
                USDC
              </span>
            </h2>
            <p className="text-lg text-white font-bold">-</p>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-neutral-light">
              Max Slippage
              <span className="bg-platform-bg-gradient rounded-2xl text-white py-1 px-3 bold ml-2 text-sm">
                USDC
              </span>
            </h2>
            <p className="text-lg text-white font-bold">0.00%</p>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-neutral-light">
              Estimated Time
              <span className="bg-platform-bg-gradient rounded-2xl text-white py-1 px-3 bold ml-2 text-sm">
                USDC
              </span>
            </h2>
            <p className="text-lg text-white font-bold">{"<"} 30 minutes</p>
          </div>
        </div>

        <button
          // disabled={!data || amount > +data?.formatted}
          onClick={handleSubmit(handleDeposit)}
          className="bg-platform-bg-gradient text-white text-2xl h-[60px] rounded-2xl font-poppins italic mt-3 font-bold disabled:opacity-70"
        >
          Deposit Funds
        </button>
      </div>
    </Modal>
  );
}
