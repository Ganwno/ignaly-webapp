import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Box, OutlinedInput, Typography } from "@material-ui/core";
import { isNumber } from "lodash";
import { formatFloat2Dec } from "../../../utils/format";
import { formatPrice } from "../../../utils/formatters";
import useExpandable from "../../../hooks/useExpandable";
import { useFormContext } from "react-hook-form";
import { simulateInputChangeEvent } from "../../../utils/events";
import "./StopLossPanel.scss";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} StopLossPanel
 * @property {MarketSymbol} symbolData
 */

/**
 * Manual trading stop loss panel component.
 *
 * @param {StopLossPanel} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const StopLossPanel = (props) => {
  const { symbolData } = props;
  const { expanded, expandClass, expandableControl } = useExpandable();
  const { clearError, errors, getValues, register, setError, setValue, watch } = useFormContext();
  const entryType = watch("entryType");
  const strategyPrice = watch("price");
  const { limits } = symbolData;

  /**
   * Calculate price based on percentage when value is changed.
   *
   * @return {Void} None.
   */
  const stopLossPercentageChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price);
    const stopLossPercentage = parseFloat(draftPosition.stopLossPercentage);
    const stopLossPrice = (price * (100 + stopLossPercentage)) / 100;

    if (isNumber(price) && price > 0) {
      setValue("stopLossPrice", formatPrice(stopLossPrice, ""));
    } else {
      setValue("stopLossPrice", "");
    }
  };

  /**
   * Calculate percentage based on price when value is changed.
   *
   * @return {Void} None.
   */
  const stopLossPriceChange = () => {
    const draftPosition = getValues();
    const price = parseFloat(draftPosition.price);
    const stopLossPrice = parseFloat(draftPosition.stopLossPrice);
    const stopLossPercentage = (stopLossPrice / price) * 100;

    if (isNumber(price) && price > 0) {
      setValue("stopLossPercentage", formatFloat2Dec(stopLossPercentage));
    } else {
      setValue("stopLossPerentage", "");
    }
  };

  const chainedPriceUpdates = () => {
    const draftPosition = getValues();
    const stopLossPercentage = draftPosition.stopLossPercentage || 0;
    const newValue = formatFloat2Dec(Math.abs(stopLossPercentage));
    const sign = entryType === "SHORT" ? "" : "-";

    if (stopLossPercentage === 0) {
      setValue("stopLossPercentage", sign);
    } else {
      setValue("stopLossPercentage", `${sign}${newValue}`);
    }

    simulateInputChangeEvent("stopLossPercentage");
  };

  useEffect(chainedPriceUpdates, [expanded, entryType, strategyPrice]);

  /**
   * Display property errors.
   *
   * @param {string} propertyName Property name to display errors for.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayFieldErrors = (propertyName) => {
    if (errors[propertyName]) {
      return <span className="errorText">{errors[propertyName].message}</span>;
    }

    return null;
  };

  return (
    <Box className={`strategyPanel stopLossPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {expandableControl}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.stoploss" />
          </Typography>
        </Box>
      </Box>
      {expanded && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          <Box className="stopLoss">
            <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
              <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.stoploss" />
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  inputRef={register}
                  name="stopLossPercentage"
                  onChange={stopLossPercentageChange}
                />
                <div className="currencyBox">%</div>
              </Box>
              {displayFieldErrors("stopLossPercentage")}
              <Box alignItems="center" display="flex">
                <OutlinedInput
                  className="outlineInput"
                  inputRef={register}
                  name="stopLossPrice"
                  onChange={stopLossPriceChange}
                />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </Box>
            {displayFieldErrors("stopLossPrice")}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StopLossPanel;
