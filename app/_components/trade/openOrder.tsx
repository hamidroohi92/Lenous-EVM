import {
  calculateAveEnt,
  calculatePnl,
  convertFrom12,
  convertFrom18,
  convertToNumber,
} from "@/app/_libs/utils/calculator";
import { ORDERBOOK_CONTRACT_ADDRESS } from "@/app/_libs/utils/constants/contractAddresses";
import { tokenList } from "@/app/_libs/utils/constants/TokenList";
import { useEthersSigner } from "@/app/_libs/utils/ethers";
import { formatNumber } from "@/app/_libs/utils/formatter";
import { ethers } from "ethers";
import Image from "next/image";
import { useSelector } from "react-redux";
import { baseSepolia } from "viem/chains";
import TradeABI from "../../_libs/ABIs/order-book.json";
import data from "../../_libs/utils/constants/supportedTokens.json";

export interface orderToShow {
  id: string;
  market: OrderMarket;
  side: string;
  amount: number;
  unit: string;
  avgEntry: number;
  markPrice: number;
  liqPrice: number;
  marginPosition: number;
  marginUnit: string;
  marginRate: number;
  tp: number;
  sl: number;
}

interface OrderMarket {
  logo: string;
  title: string;
  type: string;
  leverage: number;
}

export default function OpenOrder({ order }: any) {
  const prices = useSelector((state: any) => state.trade.prices);

  const signer = useEthersSigner({ chainId: baseSepolia.id });

  const contract = new ethers.Contract(
    ORDERBOOK_CONTRACT_ADDRESS,
    TradeABI.abi,
    signer
  );

  //Cheliki look here
  const handleCloseOrder = async () => {
    console.log(contract);
    console.log(order);
    console.log(order.asset, order.id);
    await contract
      .cancelOrder(order.asset, order.id, {
        gasPrice: ethers.utils.parseUnits("200", "gwei"),
        gasLimit: 10000,
      })
      .then((res: any) => console.log(res))
      .catch((err: any) => {
        console.log(err);
      });
  };

  // const marketPrice = prices.btcPrice;
  const marketPrice =
    order.asset === data.tokens[0].address
      ? prices.btcPrice
      : order.asset === data.tokens[1].address
      ? prices.ethPrice
      : prices.solPrice;

  const orderToShow: orderToShow = {
    id: order.orderId,
    market: {
      logo:
        order.asset === data.tokens[0].address
          ? tokenList[5].img
          : order.asset === data.tokens[1].address
          ? tokenList[0].img
          : tokenList[1].img,
      title:
        order.asset === data.tokens[0].address
          ? "Bitcoin"
          : order.asset === data.tokens[1].address
          ? "Ethereum"
          : "Solona",
      type: order.marginType,
      leverage: +parseFloat(order.leverage).toFixed(1),
    },
    side: order.isBuyOrder === "true" ? "Long" : "Short",
    amount: order.amount,
    avgEntry: order.price,
    markPrice: marketPrice,
    liqPrice:
      order.price / order.amount -
      ((1 / order.leverage) * order.price) / order.amount,
    marginPosition: 2000,
    marginRate: 20,
    marginUnit: "USD",
    unit:
      order.asset === data.tokens[0].address
        ? "BTC"
        : order.asset === data.tokens[1].address
        ? "ETH"
        : "SOL",

    tp: order.tp,
    sl: order.sl,
  };
  return (
    <>
      <tr>
        <td className="py-4">
          <div className="flex items-center gap-2">
            <Image
              src={orderToShow.market.logo}
              alt={orderToShow.market.title}
              width={40}
              height={40}
              className="w-[40px] h-[40px] object-contain"
            />
            <div>
              <h3>{orderToShow.market.title}</h3>
              <div className="flex items-center gap-1">
                <p>{orderToShow.market.type}</p>
                <p>{orderToShow.market.leverage}x</p>
              </div>
            </div>
          </div>
        </td>
        <td className="py-4">{orderToShow.side}</td>
        <td className="py-4">{orderToShow.amount + " " + orderToShow.unit}</td>
        <td className="py-4">{orderToShow.avgEntry}</td>
        <td className="py-4">
          {orderToShow.markPrice ? formatNumber(orderToShow.markPrice) : "0"}
        </td>
        <td className="text-yellow py-4">{orderToShow.liqPrice}</td>
        <td className="py-4">
          <div>
            <p>
              {formatNumber(orderToShow.marginPosition) +
                " " +
                orderToShow.marginUnit}
            </p>
            <p>{orderToShow.marginRate + "%"}</p>
          </div>
        </td>

        <td className="py-4">
          <div>
            <p>{orderToShow.tp + " / " + orderToShow.sl}</p>
          </div>
        </td>
        <td
          onClick={handleCloseOrder}
          className="text-bad-situation underline cursor-pointer py-4"
        >
          <p>Close</p>
        </td>
      </tr>
    </>
  );
}
