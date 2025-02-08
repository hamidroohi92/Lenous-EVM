import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import OrderbookABI from '@/app/_libs/utils/abis/Orderbook.json';
import TransactionInfo from "./TransactionInfo";
import { OrderToPlace } from "@/app/types/order";
import { OrderErrors } from "./PlaceOrder";
import { useSelector } from "react-redux";
// import { ORDERBOOK_ADDRESS } from '@/app/_libs/utils/constants/contractAddresses';

interface Props {
  order: OrderToPlace;
  setOrder: (order: OrderToPlace) => void;
  errors: OrderErrors;
  setErrors: (errors: OrderErrors) => void;
}

const precentageList = [25, 50, 75, 100];

const MarketOrder: React.FC<Props> = ({
  order,
  setOrder,
  errors,
  setErrors,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [percent, setPercent] = useState<number>(25);
  const [lastFocus, setLastFoucs] = useState<number>(0);
  const selectedAsset = useSelector((state: any) => state.trade.selectedAsset);
  const prices = useSelector((state: any) => state.trade.prices);

  // Initialize contract instance
  // const contract = new ethers.Contract(
  //   ORDERBOOK_ADDRESS,
  //   OrderbookABI,
  //   signer || provider
  // );

  // const submitMarketOrder = async () => {
  //   const parsedAmount = ethers.utils.parseUnits(amount.toString(), 6);
  //   const gasLimit = ethers.utils.hexlify(1000000);
  //   const isBuyOrder = actionType == 'buy' ? true : false;

  //   try {
  //     const tx = await contract.placeMarketOrder(
  //       parsedAmount,
  //       isBuyOrder,
  //       leverage,
  //       marginType,
  //       { gasLimit }
  //     );

  //     await tx.wait();
  //     console.log('Market order placed successfully!');
  //   } catch (error) {
  //     console.error('Transaction failed:', error);
  //   }
  // };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm text-neutral-light font-medium "
        >
          Unit
        </label>
        <input
          id="amount"
          type="text"
          value={
            lastFocus === 0
              ? order.unit
              : (
                  +order.amount /
                  (selectedAsset.name === "Bitcoin"
                    ? prices.btcPrice
                    : selectedAsset.name === "Ethereum"
                    ? prices.ethPrice
                    : prices.solPrice)
                ).toFixed(4)
          }
          onChange={(e) => {
            const inputValue = e.target.value;
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (regex.test(inputValue)) {
              console.log(
                (
                  (selectedAsset.name === "Bitcoin"
                    ? prices.btcPrice
                    : selectedAsset.name === "Ethereum"
                    ? prices.ethPrice
                    : prices.solPrice) * +inputValue
                ).toFixed(2)
              );
              console.log(inputValue);
              setOrder({
                ...order,
                unit: inputValue,
                amount: (
                  (selectedAsset.name === "Bitcoin"
                    ? prices.btcPrice
                    : selectedAsset.name === "Ethereum"
                    ? prices.ethPrice
                    : prices.solPrice) * +inputValue
                ).toFixed(2),
              });
            }
          }}
          onFocus={() => {
            setLastFoucs(0);
          }}
          className="mt-1 block w-full  px-4 py-3  rounded-2xl text-neutral-light bg-white-bg-05 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Enter the amount"
        />
        {errors.unit && (
          <p className="text-bad-situation text-sm py-1">{errors.unit}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="totalPrice"
          className="block text-sm text-neutral-light font-medium "
        >
          Amount
        </label>
        <input
          id="totalPrice"
          type="text"
          value={
            lastFocus === 1
              ? order.amount
              : (
                  (selectedAsset.name === "Bitcoin"
                    ? prices.btcPrice
                    : selectedAsset.name === "Ethereum"
                    ? prices.ethPrice
                    : prices.solPrice) * +order.unit
                ).toFixed(4)
          }
          onChange={(e) => {
            const inputValue = e.target.value;
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (regex.test(inputValue)) {
              setOrder({
                ...order,
                amount: inputValue,
                unit: (
                  +inputValue /
                  (selectedAsset.name === "Bitcoin"
                    ? prices.btcPrice
                    : selectedAsset.name === "Ethereum"
                    ? prices.ethPrice
                    : prices.solPrice)
                ).toFixed(4),
              });
            }
          }}
          onFocus={() => {
            setLastFoucs(1);
          }}
          className="mt-1 block w-full  px-4 py-3  rounded-2xl text-neutral-light bg-white-bg-05 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Enter the amount"
        />
        {errors.amount && (
          <p className="text-bad-situation text-sm py-1">{errors.amount}</p>
        )}
      </div>

      <div className="flex gap-1 border-neutral-light border-b pb-8">
        {precentageList.map((item) => (
          <div
            key={item}
            onClick={() => {
              setPercent(item);
            }}
            className={
              "h-[36px] px-3 text-neutral-light rounded-[18px] flex-grow flex-shrink-0 flex items-center justify-center text-center cursor-pointer " +
              (item === percent
                ? "bg-green-linear-gradient text-primary "
                : "border-solid border-[1px] border-white-bg-15")
            }
          >
            <span>{item}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOrder;
