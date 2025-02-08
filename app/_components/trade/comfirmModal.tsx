import { tokenList } from "@/app/_libs/utils/constants/TokenList";
import { Order_Type, OrderToPlace } from "@/app/types/order";
import Image from "next/image";
import Modal from "react-modal";
import { useSelector } from "react-redux";

interface Props {
  visible: boolean;
  handleClose: () => void;
  order: OrderToPlace;
  handleConfirm: () => void;
}

export default function ConfirmModal({
  visible,
  handleClose,
  order,
  handleConfirm,
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
      width: "800px",
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

  const selectedAsset = useSelector((state: any) => state.trade.selectedAsset);

  return (
    <Modal
      isOpen={visible}
      onRequestClose={handleClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="flex flex-col font-poppins italic h-full">
        <h2 className="text-white text-lg font-light">Order Details</h2>
        {order.type === Order_Type.Limit ? (
          <>
            <div className="flex items-center gap-3">
              <Image
                src={tokenList[1].img}
                alt={tokenList[1].name}
                width={200}
                height={200}
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col my-4">
                <h2 className="text-white text-xl">{selectedAsset?.symbol}</h2>
                <p className="text-neutral-light">{order.type}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Limit Price</h4>
                <p className="text-lg text-white">{order.price}</p>
              </div>
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Amount</h4>
                <p className="text-lg text-white">{order.amount}</p>
              </div>
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Margin Mode</h4>
                <p className="text-lg text-white">{order.margin}</p>
              </div>
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Liverage</h4>
                <p className="text-lg text-white">{order.leverage}x</p>
              </div>
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Time in Force</h4>
                <p className="text-lg text-white">
                  {order.hasTime ? "Good Til Time" : "Immediate Or Cancel"}
                </p>
              </div>
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Time</h4>
                <p className="text-lg text-white">
                  {new Date(order.expiration).toLocaleString()}
                </p>
              </div>
              <div className="w-[48%] flex flex-col gap-2">
                <h3 className="text-primary text-xl font-medium">
                  Take Profit
                </h3>
                <div className="flex flex-col justify-between bg-white-bg-05 w-full px-4 py-2.5 rounded-2xl font-poppins italic">
                  <h4 className="text-neutral-light">Price:</h4>
                  <p className="text-white text-lg">{order.takeProfitPrice}</p>
                </div>
              </div>
              <div className="w-[48%] flex flex-col gap-1">
                <h3 className="text-bad-situation text-xl font-medium">
                  Stop Loss
                </h3>
                <div className="flex flex-col justify-between bg-white-bg-05 w-full px-4 py-2.5 rounded-2xl font-poppins italic">
                  <h4 className="text-neutral-light">Price:</h4>
                  <p className="text-white text-lg">{order.stopLossPrice}</p>
                </div>
              </div>
            </div>
            <div className="bg-white-bg-05 flex flex-col gap-4 rounded-2xl px-4 py-2.5 mt-12 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-neutral-light">Order Fee: </h4>
                <p className="text-white">--</p>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-neutral-light">Order Fee: </h4>
                <p className="text-white">--</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Image
                src={tokenList[1].img}
                alt={tokenList[1].name}
                width={200}
                height={200}
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col my-4">
                <h2 className="text-white text-xl">{selectedAsset?.symbol}</h2>
                <p className="text-neutral-light">{order.type}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex flex-col w-[100%]">
                <h4 className="text-sm text-neutral-light">Amount</h4>
                <p className="text-lg text-white">{order.amount}</p>
              </div>
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Margin Mode</h4>
                <p className="text-lg text-white">{order.margin}</p>
              </div>
              <div className="flex flex-col w-[48%]">
                <h4 className="text-sm text-neutral-light">Liverage</h4>
                <p className="text-lg text-white">{order.leverage}x</p>
              </div>
            </div>
            <div className="bg-white-bg-05 flex flex-col gap-4 rounded-2xl px-4 py-2.5 mt-12 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-neutral-light">Order Fee: </h4>
                <p className="text-white">--</p>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-neutral-light">Order Fee: </h4>
                <p className="text-white">--</p>
              </div>
            </div>
          </>
        )}
        <button
          onClick={handleConfirm}
          className="bg-platform-bg-gradient text-white text-2xl h-[60px] rounded-2xl font-poppins italic"
        >
          Confirm {order.type[0].toUpperCase() + order.type.substring(1)} Order
        </button>
      </div>
    </Modal>
  );
}
