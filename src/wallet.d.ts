interface WalletNetwork {
  addressRegex: string;
  memoRegex: string;
  depositEnable: boolean;
  integerMultiple: string;
  isDefault: boolean;
  memoRegex: string;
  name: string;
  network: string;
  withdrawEnable: boolean;
}

interface WalletCoin {
  decimals: number;
  name: string;
  networks: WalletNetwork[];
  usdPrice: number;
  allowDeposit: boolean;
}

type WalletCoins = Record<string, WalletCoin>;

interface WalletAddress {
  address: string;
  currency: string;
  memo: string;
}

interface BalanceData {
  balance: number;
  availableBalance: number;
  /** Locked balance (balance - availableBalance) */
  locked: number;
  staked: number;
  unstaking: number;
}
type WalletBalance = Record<string, BalanceData>;

interface Boost {
  minimum: number;
  percentage: 0;
}

interface Penalty {
  days: number;
  percentage: 0;
}

interface Unstaking {
  days: number;
  receiveDate: string;
  amount: number;
  fullAmount: number;
  penalty: number;
  coin: string;
}

interface VaultOffer {
  id: number;
  minBalance: number;
  maxBalance: number;
  startDate: string;
  distributionDate: string;
  endDate: string;
  apr: number;
  distributionPeriod: string;
  rewardsTotal: number;
  rewardsRemaining: number;
  coin: string;
  coinReward: string;
  stakingDays: number;
  type: "basic" | "stake";
  finishStakingDate?: string;
  /*
   * Additional properties for stake type
   */
  announcementDate?: string;
  returnCoinsDate?: string;
  asideCoin?: string;
  asideMinimum?: number;
  unstakeEnabled?: boolean;
  stakeAmount?: number;
  asideAmount?: number;
  boostable: boolean;
  boosts: Boost[];
  penalties: Penalty[];
  unstaking: Unstaking[];
}

interface BalanceExchange {
  exchangeId: string;
  name: string;
  balance: number;
  networks: CoinNetwork[];
}
