import React, { useState, useRef, useReducer } from "react";
import "./ConnectExchangeView.scss";
import { Box, Typography } from "@material-ui/core";
import ConnectExchangeViewContent from "./ConnectExchangeViewContent";
import ConnectExchangeViewHead from "./ConnectExchangeViewHead";
import ModalPathContext from "./ModalPathContext";

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 * Connect exchange component.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Connect exchange element.
 */
const ConnectExchangeView = (props) => {
  const [pathParams, setPathParams] = useState({
    currentPath: "realAccounts",
  });

  const navigateToPath = (path, selectedAccount) => {
    setPathParams({
      currentPath: path,
      previousPath: pathParams.currentPath,
      selectedAccount,
    });
  };

  const resetToPath = (path) => {
    setPathParams({
      currentPath: path,
    });
  };

  const setTitle = (title) => {
    setPathParams({
      ...pathParams,
      title,
    });
  };
  const value = { pathParams, setPathParams, navigateToPath, resetToPath, setTitle };

  return (
    <ModalPathContext.Provider value={value}>
      <Box
        alignItems="center"
        className="connectExchangeView"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <ConnectExchangeViewHead />
        <ConnectExchangeViewContent />
      </Box>
    </ModalPathContext.Provider>
  );
};

export default ConnectExchangeView;
