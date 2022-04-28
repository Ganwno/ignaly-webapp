import React from "react";
import { useIntl } from "react-intl";
import { CoinNetwork } from "src/services/tradeApiClient.types";
import { Select } from "zignaly-ui";
import { getChainIcon } from "src/utils/chain";

// import * as styled from "./styles";
import { SelectIcon } from "../AssetSelect/styles";

interface NetworkSelectProps {
  networks: CoinNetwork[];
  onChange: any;
  selectedNetwork: any;
  fullWidth?: boolean;
}

const NetworkSelect = ({ networks, onChange, selectedNetwork, fullWidth }: NetworkSelectProps) => {
  const intl = useIntl();

  const networkOptions = networks?.map((n) => {
    return {
      caption: n.name,
      value: n,
      // leftElement: <CoinIcon coin={n.network} />,
      leftElement: <SelectIcon>{getChainIcon(n.network)}</SelectIcon>,
    };
  });

  return (
    <Select
      fullWidth={fullWidth}
      options={networkOptions}
      onChange={onChange}
      placeholder={intl.formatMessage({ id: "deposit.network" })}
      label={intl.formatMessage({ id: "deposit.network" })}
      value={networkOptions?.find((o) => o.value === selectedNetwork)}
    />
  );
};

export default NetworkSelect;
