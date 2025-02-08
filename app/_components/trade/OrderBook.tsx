import React, { useEffect, useState } from "react";
import { ethers, providers, BigNumber } from "ethers";
// import OrderbookABI from '@/app/_libs/utils/abis/Orderbook.json';
import { useWatchContractEvent } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import Icon from "../UI/icon";
import TokenSelector from "./tokenSelector";
import OrderBookTable from "./orderBookTable";
import { getAllOrders } from "@/app/dataRequests/orderDataRequests";
import { useSelector } from "react-redux";
// import { ORDERBOOK_ADDRESS } from '@/app/_libs/utils/constants/contractAddresses';

interface OrderPlacedEventArgs {
  orderId: BigNumber;
  trader: string;
  orderType: number; // Assuming OrderType is an enum with numeric values
  price: BigNumber;
  amount: BigNumber;
  stoploss: BigNumber;
  takeprofit: BigNumber;
  expiration: BigNumber;
  asset: string;
}

interface Order {
  orderId: string;
  trader: string;
  orderType: string; // 1 for buy, 2 for sell
  price: string;
  amount: string;
  total: string; // Running total in USDC
  stoploss: string;
  takeprofit: string;
  expiration: string;
  asset: string;
  progress: number; // Percentage for progress bar
}

interface OrderbookProps {
  userAddress?: string;
}

const formatNumber = (value: number, decimals: number): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };

  const formatter = new Intl.NumberFormat("en-US", options);
  let formatted = formatter.format(value);

  if (value % 1 === 0) {
    formatted = formatted.replace(/\.0+$/, ""); // Remove trailing '.0'
  }

  return formatted;
};

// const orderList = [
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
//   {
//     price: 3800,
//     size: 5.29,
//     total: 60,
//   },
// ];

const Orderbook: React.FC<OrderbookProps> = ({ userAddress }) => {
  const [amount, setAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>("ETH");
  const { allPositions } = useSelector((state: any) => state.trade);

  // useEffect(() => {
  //   getAllOrders().then((res) => {
  //     const newList = [...res.data.orders];
  //     const filteredList = newList.filter(
  //       (x) => x.symbol === selectedAsset.address
  //     );
  //     setOrderList([...filteredList]);
  //   });
  // }, [selectedAsset]);

  return (
    <div>
      <div>
        <TokenSelector
          tokenList={["ETH", "USD"]}
          amount={amount}
          setAmount={setAmount}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
        />
      </div>
      <OrderBookTable orders={allPositions} />
    </div>
  );
};

export default Orderbook;
