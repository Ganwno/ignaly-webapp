// export const versions = {
//   session: 1,
//   user: 1,
// };

// export const keys0 = {
//   session: `session_${versions.session}`,
//   user: `user_${versions.user}`,
// };

const CURRENT_VERSION = 1;

export const keys = {
  session: `${process.env.NEXT_PUBLIC_TRADEAPI_URL}/session`,
  user: `${process.env.NEXT_PUBLIC_TRADEAPI_URL}/user`,
};

export let cache = new Map();

export const localStorageProvider = () => {
  if (typeof window === "undefined") return cache;
  // When initializing, we restore the data from `localStorage` into a map.
  const data = JSON.parse(localStorage.getItem("app-cache") || "{}");
  if (data.version >= CURRENT_VERSION) {
    cache = new Map(data.cache);
  }
  console.log("loaded cache", cache);

  // Before unloading the app, we write back all the data into `localStorage`.
  // window.addEventListener("beforeunload", () => {
  //   const appCache = JSON.stringify(Array.from(map.entries()));
  //   localStorage.setItem("app-cache", appCache);
  // });

  // We still use the map for write & read for performance.
  return cache;
};

export const setItemCache = (key: string, value: any) => {
  // Update memory cache in case the request was outside of SWR
  cache.set(key, value);

  // Update local storage with whitelisted entries
  const arrayToSave = Array.from(cache.entries()).reduce((result, entry) => {
    const [key, value] = entry;
    if (Object.values(keys).includes(key)) {
      const { _validated: _, ...o } = value;
      result.push([key, o]);
    }
    return result;
  }, []);
  const appCache = JSON.stringify({ version: CURRENT_VERSION, cache: arrayToSave });
  localStorage.setItem("app-cache", appCache);
};
