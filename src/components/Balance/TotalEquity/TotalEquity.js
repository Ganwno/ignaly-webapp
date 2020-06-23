import React, { useEffect, useState } from "react";
import "./TotalEquity.scss";
import { Box } from "@material-ui/core";
import TotalEquityGraph from "./TotalEquityGraph";
import TitleBar from "./TitleBar";
import EquityFilter from "./EquityFilter";
import EquityGraphLabels from "./GraphLabels";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultDailyBalanceEntity} dailyBalance Daily balance.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const TotalEquity = ({ dailyBalance }) => {
  const [list, setList] = useState(dailyBalance.balances);
  const [balance, setBalance] = useState({ totalBTC: 0, totalUSDT: 0 });

  const filterBalance = () => {
    let currentDate = new Date().getDate();
    let obj = { ...balance };
    let data = dailyBalance.balances.length
      ? dailyBalance.balances.find((item) => new Date(item.date).getDate() === currentDate)
      : { totalBTC: 0, totalUSDT: 0 };
    obj.totalBTC = data.totalBTC;
    obj.totalUSDT = data.totalUSDT;
    setBalance(obj);
  };

  useEffect(() => {
    setList(dailyBalance.balances);
    filterBalance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyBalance.balances]);

  /**
   * @typedef {import("../../../store/initialState").UserEquityEntity} UserEquityEntity
   * @param {Array<UserEquityEntity>} data
   */

  const handleChange = (data) => {
    setList(data);
  };

  return (
    <Box
      alignItems="flex-start"
      className="totalEquity"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box
        alignItems="flex-start"
        className="equityHeader"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
      >
        <TitleBar balance={balance} />
        <EquityFilter list={list} onChange={handleChange} />
      </Box>
      <TotalEquityGraph list={list} />
      <EquityGraphLabels list={list} />
    </Box>
  );
};

export default TotalEquity;
