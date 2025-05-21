import React, { useEffect, useRef } from "react";
import { createChart, Time } from "lightweight-charts";

interface CandlestickChartProps {
  coinId: string;
  days: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ coinId, days }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    const fetchOHLC = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
        );
        const data = await response.json();

        const formattedData = data.map(
          ([timestamp, open, high, low, close]: number[]) => ({
            time: (timestamp / 1000) as Time,
            open,
            high,
            low,
            close,
          })
        );

        if (chartRef.current) {
          chartRef.current.remove();
        }

        const chart = createChart(chartContainerRef.current!, {
          layout: {
            background: { color: "#000" },
            textColor: "#ccc",
          },
          grid: {
            vertLines: { color: "#333" },
            horzLines: { color: "#333" },
          },
          width: chartContainerRef.current!.clientWidth,
          height: chartContainerRef.current!.clientHeight,
        });

        const candlestickSeries = chart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });

        candlestickSeries.setData(formattedData);

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;
      } catch (error) {
        console.error("Failed to fetch OHLC data:", error);
      }
    };

    fetchOHLC();

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [coinId, days]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default CandlestickChart;
