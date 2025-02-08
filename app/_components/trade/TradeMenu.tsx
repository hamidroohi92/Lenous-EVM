"use client";
import React from "react";
import Icon from "../UI/icon";
import StopLimit from "./StopLimit";
import { useState } from "react";
import PlaceOrder from "./PlaceOrder";
import OrderBook from "./OrderBook";
import TokenList from "./tokenList";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAsset } from "@/app/redux/slices/tradeSlice";

export default function TradeMenu() {
  const [activeMenu, setActiveMenu] = useState(0);
  const selectedAsset = useSelector((state: any) => state.trade.selectedAsset);
  const dispatch = useDispatch();

  const menuItems = [
    {
      id: 2,
      name: "market",
      icon: "market",
      content: <PlaceOrder />,
      active: true,
    },

    {
      id: 4,
      name: "Order Book",
      icon: "orderBook",
      content: <OrderBook />,
      active: true,
    },

    {
      id: 6,
      name: "Margin Ratio",
      icon: "marginRatio",
      content: <div>Margin Ratio Component</div>,
      active: false,
    },
    {
      id: 7,
      name: "Assets",
      icon: "assets",
      content: <div>Assets Component</div>,
      active: false,
    },
    {
      id: 8,
      name: "Help",
      icon: "help",
      content: <div>Help Component</div>,
      active: false,
    },
  ];

  return (
    <>
      <div className="bg-dark-gray">
        {activeMenu ? (
          <div className="w-full h-15 p-4">
            <TokenList
              asset={selectedAsset}
              setAsset={(asset) => dispatch(setSelectedAsset(asset))}
            />
          </div>
        ) : (
          <></>
        )}

        <div
          className={`activeMenu relative h-[538px] overflow-y-auto overflow-x-hidden customScroll ${
            activeMenu != 0 ? "w-[400px] pt-4 p-4" : ""
          } bg-dark-gray `}
        >
          {menuItems.find((item) => item.id === activeMenu)?.content}
        </div>
      </div>

      <div className="w-24 bg-light-gray py-9 flex justify-center">
        <div className="inline">
          {menuItems.map((item, index) => (
            <div
              className={`flex justify-end pointer-cursor mb-9 ${
                item.active ? "opacity-100" : "opacity-50"
              }`}
              key={item.id}
              onClick={() => {
                item.active ? setActiveMenu(item.id) : () => {};
              }}
            >
              {/* <div className="text-white pr-2">{item.name}</div> */}
              <Icon name={item.icon} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
