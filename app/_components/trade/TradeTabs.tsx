"use client";
import React, { useEffect, useRef, useState } from "react";
// import PositionTable from './positions/PositionTable';
import Icon from "../UI/icon";
import OpenOrderList from "./openOrderList";
import {
  getAllHistory,
  getAllOrders,
} from "@/app/dataRequests/orderDataRequests";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { setOrdersHistory, setUserOrders } from "@/app/redux/slices/tradeSlice";
import { toast } from "react-toastify";
import OpenPositionsList from "./openPositionsList";
import OrdersHistoryList from "./ordersHistoryList";

const SOCKET_URL = "http://localhost:3000"; // Replace with your Socket.IO server URL

export default function TradeTabs() {
  const tabs = [
    {
      id: 1,
      label: "Orders",
      content: "",
    },
    {
      id: 2,
      label: "Positions",
      content: "",
    },
    {
      id: 3,
      label: "History",
      content: "",
    },
  ];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(1);
  const { address } = useAccount();
  const dispatch = useDispatch();
  const [filteredByAsset, setFilteredByAsset] = useState<boolean>(false);
  const userOrders = useSelector((state: any) => state.trade.userOrders);
  const userPositions = useSelector((state: any) => state.trade.userPositions);
  const ordersHistory = useSelector((state: any) => state.trade.ordersHistory);

  useEffect(() => {
    if (address) {
      if (activeTab === 1) {
        getAllOrders(address?.toString())
          .then((res) => {
            console.log(res);
            dispatch(setUserOrders([...res.data.orders]));
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (activeTab === 3) {
        getAllHistory(address?.toString()).then((res) => {
          console.log(res);
          dispatch(setOrdersHistory([...res.data.orders]));
        });
      }
    }
  }, [activeTab, address]);

  return (
    <div className="py-8 container">
      <div className="flex justify-between">
        <div className="inline-flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pr-20 py-2 text-lg  font-medium focus:outline-none rounded-t-3xl ${
                activeTab === tab.id ? "text-primary" : "text-neutral-light"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setFilteredByAsset(!filteredByAsset);
            }}
          >
            <span
              className={`block rounded-full w-4 h-4 border-[1px] border-solid border-neutral-light ${
                filteredByAsset ? "bg-primary" : "bg-transparent"
              }`}
            />
            <p className="text-neutral-light italic">
              Filtered by Selected Asset
            </p>
          </div>
        </div>
        <div className="flex">
          <button className="text-white bg-primary border py-1 px-6 mr-4  rounded-3xl">
            filter
          </button>
          <button className="text-white flex items-center border rounded-3xl  py-1 px-4 border-white ">
            search
            <span className="pl-2">
              <Icon name="search" />
            </span>
          </button>
        </div>
      </div>
      <div className=" mt-12 min-h-[350px]">
        {address ? (
          isLoading ? (
            <p className="text-white">Loading...</p>
          ) : activeTab === 1 ? (
            <OpenOrderList orders={userOrders} />
          ) : activeTab === 2 ? (
            <OpenPositionsList orders={userPositions} />
          ) : (
            <OrdersHistoryList orders={ordersHistory} />
          )
        ) : (
          <p className="text-white">Please connect your wallet</p>
        )}
        {/* {tabs.find((item) => item.id === activeTab)?.content} */}
      </div>
    </div>
  );
}
