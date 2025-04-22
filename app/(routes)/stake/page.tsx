"use client";

import HeroSection from "@/app/_components/stake/heroSection";
import PoolSection from "@/app/_components/stake/poolSection";
import StakeModal from "@/app/_components/stake/stakeModal";
import { LP_CONTRACT_ADDRESS } from "@/app/_libs/utils/constants/contractAddresses";
import { useEthersSigner } from "@/app/_libs/utils/ethers";
import { ethers } from "ethers";
import { useState } from "react";
import { baseSepolia } from "viem/chains";
import LPABI from "../../_libs/ABIs/LiquidityPool.json";

export default function Stake() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const openModal = () => {
    setShowModal(true);
  };

  const signer = useEthersSigner({ chainId: baseSepolia.id });

  const contract = new ethers.Contract(LP_CONTRACT_ADDRESS, LPABI.abi, signer);
  // console.log("lp contract", contract);

  return (
    <section className="px-[160px] pb-[172px]">
      <HeroSection openModal={openModal} />
      <PoolSection openModal={openModal} />
      <StakeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </section>
  );
}
