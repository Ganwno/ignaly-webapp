import React, { useContext, useState, useEffect } from "react";
import { useMediaQuery, Box, Typography, CircularProgress } from "@material-ui/core";
import TotalEquity from "../../../Balance/TotalEquity";
import CryptoComposition from "../../../Balance/CryptoComposition";
import { SpotAvailableBalance, FuturesAvailableBalance } from "../../../Balance/AvailableBalance";
import ConnectedProvidersSummary from "../../../Providers/ConnectedProvidersSummary";
import "./ExchangeAccountData.scss";
import useEquity from "../../../../hooks/useEquity";
import useBalance from "../../../../hooks/useBalance";
import { FormattedMessage, useIntl } from "react-intl";
import ModalPathContext from "../../ModalPathContext";
import { useTheme } from "@material-ui/core/styles";
import ProfitLossAnalysis from "../../../Balance/ProfitLossAnalysis";
import tradeApi from "services/tradeApiClient";

/**
 * @typedef {import('../../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ExchangeConnectionEntity} account Exchange account.
 */

/**
 * Provides data about the exchange account.
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const ExchangeAccountData = ({ account }) => {
  const { navigateToPath } = useContext(ModalPathContext);
  const dailyBalance = useEquity(account.internalId);
  const { balance } = useBalance(account.internalId);
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    tradeApi
      .providersGetNew({
        type: "connected_traders",
        timeFrame: 30,
        internalExchangeId: account.internalId,
      })
      .then((data) => {
        setProviders(data);
      });
  }, []);

  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box className="exchangeAccountData">
      <Box className="topBoxData" display="flex" flexDirection="row">
        {(!balance || dailyBalance.loading) && !account.paperTrading ? (
          <CircularProgress color="primary" size={40} />
        ) : (
          <>
            {!account.paperTrading && (
              <>
                <Box className="equityBox">
                  {!account.balanceSynced || (!balance.totalBTC && account.isBrokerAccount) ? (
                    <Box
                      alignItems="center"
                      className="noBalance"
                      display="flex"
                      height={1}
                      justifyContent="center"
                      width={1}
                    >
                      <Typography variant="h3">
                        {!account.balanceSynced && !account.isBrokerAccount ? (
                          <FormattedMessage id="accounts.balance.synchronizing" />
                        ) : (
                          <FormattedMessage
                            id="accounts.deposit.make"
                            values={{
                              depositLink: (
                                <a onClick={() => navigateToPath("deposit", account, true)}>
                                  {intl.formatMessage({ id: "accounts.deposit" }).toLowerCase()}
                                </a>
                              ),
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                  ) : (
                    <TotalEquity
                      dailyBalance={dailyBalance}
                      modal={true}
                      selectedExchange={account}
                    />
                  )}
                </Box>
                <Box className="cryptoBox">
                  {account.exchangeType === "futures" ? (
                    <ProfitLossAnalysis dailyBalance={dailyBalance} />
                  ) : (
                    <CryptoComposition dailyBalance={dailyBalance} vertical={!isMobile} />
                  )}
                </Box>
              </>
            )}
            <Box className="cardsBox" display="flex" flexDirection="column">
              {providers && <ConnectedProvidersSummary providers={providers} />}
            </Box>
          </>
        )}
      </Box>
      <Box className="balanceBox">
        {account.exchangeType === "futures" ? (
          <FuturesAvailableBalance balance={balance} selectedExchange={account} />
        ) : (
          <SpotAvailableBalance balance={balance} selectedExchange={account} />
        )}
      </Box>
    </Box>
  );
};

export default ExchangeAccountData;
