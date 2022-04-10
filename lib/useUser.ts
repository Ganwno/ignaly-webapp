import { useSelector } from "react-redux";
import useSWR from "swr";
import { UserEntity } from "../src/services/tradeApiClient.types";
import { keys, cache, setItemCache } from "lib/cacheAPI";

// let localData;
// if (typeof window !== "undefined") {
//   // Load user data from cache for faster page load
//   localData = localStorage.getItem(keys.user);
//   if (localData) {
//     // mutate(`${process.env.NEXT_PUBLIC_TRADEAPI_URL}/user`, JSON.parse(localData), false);
//   }
// }

const useUser = () => {
  const initialData = cache.get(keys.user);
  const {
    data: user,
    mutate,
    error,
  } = useSWR<UserEntity>(keys.user, {
    // Don't fetch update if the data has just been loaded in login (_validated)
    revalidateOnMount: initialData?._validated !== true,
    // revalidateIfStale: false,
    onSuccess(user) {
      setItemCache(keys.user, user);
    },
  });
  // const loading = !user && !error ? true : false;
  const selectedExchangeId = useSelector((state: any) => state.settings.selectedExchangeId);
  const selectedExchange = user?.exchanges.find((e) => e.internalId === selectedExchangeId);

  return {
    selectedExchange,
    user,
    mutate,
  };
};

export default useUser;