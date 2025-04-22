export default function HeroSection({
  openDepositModal,
  openWithdrawModal,
}: {
  openDepositModal: () => void;
  openWithdrawModal: () => void;
}) {
  return (
    <div className="flex justify-between h-[400px] py-[71px]">
      <div className="flex flex-col gap-[12px]">
        <h2 className="font-inter text-7xl font-thin text-white tracking-[-8px]">
          Lenous Financail System
        </h2>
        <h1 className="font-inter text-7xl font-thin text-[#4E8AFF] tracking-[-8px]">
          USDC Liquidity Pool
        </h1>
        <p className="mt-auto text-xl text-white font-poppins">
          a way to trade cryptocurrencies and tokens on a decentralized exchange
          (DEX) <br />
          without the need for a central intermediary{" "}
        </p>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div className="flex gap-12 font-poppins">
          <div className="flex flex-col items-end gap-3">
            <h3 className="text-lg font-bold text-white">Totla Value Locked</h3>
            <p className="text-4xl text-white font-thin italic">$2.93 B</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <h3 className="text-lg font-bold text-white">Lenous Volume</h3>
            <p className="text-4xl text-white font-thin italic">$41.01 B</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openDepositModal}
            className="bg-[#4E8AFF33] text-white text-[24px] h-[56px] rounded-[20px] px-4 border-[3px] border-solid border-[#4E8AFF1a]"
          >
            Add Liquidity
          </button>
          <button
            onClick={openWithdrawModal}
            className="bg-transparent text-white text-[24px] h-[56px] rounded-[20px] px-4 border-[3px] border-solid border-[#4E8AFF]"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
