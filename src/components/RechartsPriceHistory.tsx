import React from 'react';
import { PriceHistoryChart, PriceHistoryChartProps } from './PriceHistoryChart';

export interface RechartsPriceHistoryProps extends PriceHistoryChartProps {}

export const RechartsPriceHistory: React.FC<RechartsPriceHistoryProps> = (props) => {
  return <PriceHistoryChart {...props} />;
};

export default RechartsPriceHistory;
