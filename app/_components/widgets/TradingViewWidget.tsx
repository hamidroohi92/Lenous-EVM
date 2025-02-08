"use client";
import React, { useEffect, useRef, memo } from "react";
import { useSelector } from "react-redux";

const TradingViewWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedAsset = useSelector((state: any) => state.trade.selectedAsset);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      container_id: "technical-analysis-chart-demo",
      width: "100%",
      height: "100%",
      autosize: true,
      symbol:
        selectedAsset.name === "Bitcoin"
          ? "BTCUSDT"
          : selectedAsset.name === "Solana"
          ? "SOLUSD"
          : "ETHEREUM", // Set default symbol to a crypto pair
      interval: "D",
      timezone: "exchange",
      theme: "Dark",
      style: "1",
      withdateranges: true,
      allow_symbol_change: true,
      save_image: false,
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",

      // Add below settings to restrict to crypto markets
      symbol_search_request: {
        type: "crypto",
      },
      symbol_search_results: {
        type: "crypto",
      },
      symbol_search_preset: {
        type: "crypto",
      },
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = ""; // Clean up the container when the component is unmounted
      }
    };
  }, [selectedAsset]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        id="technical-analysis-chart-demo"
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </div>
  );
};

export default memo(TradingViewWidget);
