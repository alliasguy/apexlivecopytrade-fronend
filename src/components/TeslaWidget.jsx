// TeslaWidget.jsx
import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from '../context/ThemeContext';

const SYMBOLS = [
  ["Apple", "AAPL|1D"],
  ["Google", "GOOGL|1D"],
  ["Microsoft", "MSFT|1D"],
  ["CME_MINI:NQ1!|1D"],
  ["COINBASE:BTCUSD|1D"],
  ["TVC:US02Y|1D"],
  ["FX:USDJPY|1D"],
  ["NASDAQ:TSLA|1D"],
  ["NASDAQ:NVDA|1D"],
  ["SP:SPX|1D"],
  ["OPRA:AA250404C22.5|1D"],
  ["BINANCE:ETHUSDT|1D"],
  ["BINANCE:XRPUSDT|1D"],
  ["NASDAQ:TQQQ|1D"],
  ["AMEX:SPY|1D"],
  ["NYSE:BABA|1D"],
  ["PEPPERSTONE:NAS100|1D"],
];

const TeslaWidget = ({ backgroundColor }) => {
  const containerRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    // TradingView bakes colorTheme/backgroundColor into the widget at
    // creation time - there's no way to re-theme it live, so a theme
    // change has to tear down and recreate the whole embed.
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '<div class="tradingview-widget-container__widget"></div><div class="tradingview-widget-copyright"></div>';

    const config = {
      symbols: SYMBOLS,
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: theme,
      autosize: false,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      headerFontSize: "medium",
      backgroundColor: theme === 'dark' ? (backgroundColor || "rgba(17, 17, 24, 1)") : "rgba(255, 255, 255, 1)",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
    };

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
  }, [theme]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
      </div>
    </div>
  );
};

export default memo(TeslaWidget);
