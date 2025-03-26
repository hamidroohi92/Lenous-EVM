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
import TradeABI from "../../_libs/ABIs/OrderBook.json";
import data from "../../_libs/utils/constants/supportedTokens.json";

export interface orderToShow {
  id: string;
  market: OrderMarket;
  side: string;
  amount: number;
  unit: string;
  avgEntry: number;
  markPrice: number;
  marginPosition: number;
  marginUnit: string;
  marginRate: number;
  cmlPnl: number;
  cmlUnit: string;
  pnlPercentage: number;
  tp: any;
  sl: any;
  date: string;
  status: string;
}

interface OrderMarket {
  logo: string;
  title: string;
  type: string;
  leverage: number;
}

export default function HistoryRecord({ order }: any) {
  const prices = useSelector((state: any) => state.trade.prices);
  console.log(order.isBuyOrder);

  const signer = useEthersSigner({ chainId: baseSepolia.id });

  const contract = new ethers.Contract(
    ORDERBOOK_CONTRACT_ADDRESS,
    TradeABI.abi,
    signer
  );

  const handleCloseOrder = async () => {
    // console.log(order.order_id, order.asset_id);
    await contract
      .cancelOrder(order.asset_id, order.order_id, {
        gasPrice: ethers.utils.parseUnits("200", "gwei"),
        gasLimit: ethers.utils.hexlify(50000),
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
  const pnl = order.realizedPnl;

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
    marginPosition: order.usedMargin,
    marginRate: 1 / order.leverage,
    cmlPnl: +pnl.toFixed(4),
    pnlPercentage: +((pnl / order.usedMargin) * 100).toFixed(2),
    marginUnit: "USD",
    cmlUnit: "USD",
    unit:
      order.asset === data.tokens[0].address
        ? "BTC"
        : order.asset === data.tokens[1].address
        ? "ETH"
        : "SOL",

    tp: order.tp,
    sl: order.sl,
    status: order.status,
    date: order.date,
  };

  console.log(orderToShow.side);
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
        <td className="py-4">{orderToShow.avgEntry.toFixed(4)}</td>
        <td className="py-4">
          {orderToShow.markPrice ? formatNumber(orderToShow.markPrice) : "0"}
        </td>
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
          <div
            className={
              orderToShow.cmlPnl > 0 ? "text-primary" : "text-bad-situation"
            }
          >
            <p>
              {(orderToShow.cmlPnl > 0 ? "+" : "") +
                orderToShow.cmlPnl +
                " " +
                orderToShow.cmlUnit}
            </p>
            <p>
              {(orderToShow.pnlPercentage > 0 ? "+" : "") +
                orderToShow.pnlPercentage +
                "%"}
            </p>
          </div>
        </td>
        <td className="py-4">
          <div>
            <p>{orderToShow.tp + " / " + orderToShow.sl}</p>
          </div>
        </td>
        <td className="py-4">
          <p>{new Date(orderToShow.date).toLocaleString()}</p>
        </td>
        <td className="py-4">
          <p>{orderToShow.status}</p>
        </td>
      </tr>
    </>
  );
}
