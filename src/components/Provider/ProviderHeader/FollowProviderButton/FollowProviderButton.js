import React, { useState } from "react";
import "./FollowProviderButton.scss";
import { Box, Typography, Tooltip } from "@material-ui/core";
import CustomButton from "../../../CustomButton";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../../services/tradeApiClient";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { useDispatch } from "react-redux";
import { setProvider } from "../../../../store/actions/views";
import ExchangeIcon from "../../../ExchangeIcon";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const FollowProviderButton = ({ provider }) => {
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const followProvider = async () => {
    try {
      setLoader(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        connected: false,
      };
      const response = await tradeApi.providerConnect(payload);
      if (response) {
        const payload2 = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          version: 2,
        };
        dispatch(setProvider(payload2));
        setLoader(false);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const stopFollowing = async () => {
    try {
      setLoader(true);
      const payload = {
        disable: true,
        token: storeSession.tradeApi.accessToken,
        providerId: provider.id,
        type: "connected",
      };
      const response = await tradeApi.providerDisable(payload);
      if (response) {
        const payload2 = {
          token: storeSession.tradeApi.accessToken,
          providerId: provider.id,
          version: 2,
        };
        dispatch(setProvider(payload2));
        setLoader(false);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Box
      alignItems="center"
      className="copyTraderButton"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      {provider.disable ? (
        <CustomButton className="submitButton" loading={loader} onClick={followProvider}>
          <FormattedMessage id="srv.followprovider" />
        </CustomButton>
      ) : provider.exchangeInternalId ? (
        provider.exchangeInternalId === storeSettings.selectedExchange.internalId ? (
          <CustomButton className="loadMoreButton" loading={loader} onClick={stopFollowing}>
            <FormattedMessage id="copyt.stopcopyingtrader" />
          </CustomButton>
        ) : (
          <Box
            className="actionHelpBox"
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h4">
              <FormattedMessage id="copyt.followingfrom" />
            </Typography>
            <Tooltip title={storeSettings.selectedExchange.internalName} placement="top">
              <Box>
                <ExchangeIcon
                  exchange={storeSettings.selectedExchange.name.toLowerCase()}
                  size="mediumLarge"
                />
              </Box>
            </Tooltip>
          </Box>
        )
      ) : (
        <CustomButton className="loadMoreButton" loading={loader} onClick={stopFollowing}>
          <FormattedMessage id="copyt.stopcopyingtrader" />
        </CustomButton>
      )}
    </Box>
  );
};

export default FollowProviderButton;
