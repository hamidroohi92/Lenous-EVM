"use client";

import HeroSection from "@/app/_components/pool/heroSection";
import PoolSection from "@/app/_components/pool/poolSection";
import StakeModal from "@/app/_components/pool/stakeModal";
import { LP_CONTRACT_ADDRESS } from "@/app/_libs/utils/constants/contractAddresses";
import { useEthersSigner } from "@/app/_libs/utils/ethers";
import { ethers } from "ethers";
import { useState } from "react";
import { baseSepolia } from "viem/chains";
import LPABI from "../../_libs/ABIs/LiquidityPool.json";
import LpWithdrawModal from "@/app/_components/pool/lpWithdrawModal";

export default function Pool() {
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const openDepositModal = () => {
    setShowDepositModal(true);
  };
  const openWithdrawModal = () => {
    setShowWithdrawModal(true);
  };

  return (
    <section className="px-[160px] pb-[172px]">
      <HeroSection
        openDepositModal={openDepositModal}
        openWithdrawModal={openWithdrawModal}
      />
      <PoolSection openDepositModal={openDepositModal} />
      <StakeModal
        isOpen={showDepositModal}
        handleClose={() => {
          setShowDepositModal(false);
        }}
      />
      <LpWithdrawModal
        isOpen={showWithdrawModal}
        handleClose={() => {
          setShowWithdrawModal(false);
        }}
      />
    </section>
  );
}
