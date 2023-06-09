import React, { useContext, useEffect } from "react";
import { Box } from "@material-ui/core";
import { SubNavModalHeader } from "../../../SubNavHeader";
import "./BalanceManagement.scss";
import ModalPathContext from "../../ModalPathContext";
import { useStoreUserData } from "hooks/useStoreUserSelector";
import { getURLPath } from "hooks/useModalPath";

/**
 * @typedef {Object} BalanceManagementPropTypes
 * @property {React.ReactElement} children Children elements
 */

/**
 * Provides a tip box.
 *
 * @param {BalanceManagementPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const BalanceManagement = ({ children }) => {
  const { pathParams, setTitle, setPathParams } = useContext(ModalPathContext);
  const { selectedAccount } = pathParams;
  const { exchanges } = useStoreUserData();
  const brokenAccounts = exchanges.filter((item) => item.isBrokerAccount);

  useEffect(() => {
    setTitle(pathParams.selectedAccount.internalName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    {
      id: "deposit",
      title: "accounts.deposit",
      href: "#exchangeAccounts/deposit",
    },
    {
      id: "withdraw",
      title: "accounts.withdraw",
      href: "#exchangeAccounts/withdraw",
    },
  ];

  if (brokenAccounts.length > 1) {
    tabs.push({
      id: "transfer",
      title: "accounts.transfer",
      href: "#exchangeAccounts/transfer",
    });
  }

  if (selectedAccount.exchangeType.toLowerCase() === "spot") {
    tabs.push({
      id: "convert",
      title: "accounts.convert",
      href: "#exchangeAccounts/convert",
    });
  }

  return (
    <Box className="balanceManagement">
      <SubNavModalHeader currentPath={getURLPath()} links={tabs} />
      {children}
    </Box>
  );
};

export default BalanceManagement;
