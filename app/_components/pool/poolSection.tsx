"use client";

import { useState } from "react";
import PoolChart from "./poolChart";
import PoolStats from "./poolStats";
import StakeModal from "./stakeModal";

export default function PoolSection({
  openDepositModal,
}: {
  openDepositModal: () => void;
}) {
  return (
    <div className="mt-[100px] flex gap-[2vw]">
      <div className="flex-grow">
        <PoolChart />
      </div>
      <div className="w-[26vw] flex-shrink-0">
        <PoolStats openModal={openDepositModal} />
      </div>
    </div>
  );
}
