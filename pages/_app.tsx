import React, { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider as ThemeProviderUI, dark } from "zignaly-ui";
import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme from "../lib/theme";
import { IntlProvider } from "react-intl";
import ENMessages from "../src/i18n/translations/en.yml";
import translations from "../src/i18n/translations";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import useStoreSettingsSelector from "../src/hooks/useStoreSettingsSelector";
import { Provider } from "react-redux";
import { store } from "../src/store/store.js";
import { useRouter } from "next/router";
import { getLanguageCodefromLocale } from "../src/i18n";
import Auth from "../components/Auth";
import SWRAuthConfig from "components/SWRAuthConfig";
import "./legacy.scss";
import "./styles.css";
import Head from "next/head";

// todo: Replace these old components
import ErrorAlert from "src/components/Alerts/ErrorAlert";
import SuccessAlert from "src/components/Alerts/SuccessAlert";

const WithReduxProvider = (Component) => (props) =>
  (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );

function MyApp({ Component, pageProps }: AppProps) {
  const { darkStyle, locale } = useStoreSettingsSelector();
  const router = useRouter();
  const isLogin = ["/", "/login", "/signup"].includes(router.pathname);
  const darkTheme = !isLogin;
  const theme = useMemo(
    () => createTheme({ ...dark, ...getTheme(darkTheme, isLogin) }),
    [darkTheme, isLogin],
  );
  const [messages, setMessages] = useState(null);

  const getMessages = async (localeValue: string): Promise<Record<string, string>> => {
    const lang = getLanguageCodefromLocale(localeValue);
    return await translations[lang]();
  };

  // Merged english messages with selected by user locale messages
  // In this case all english data would be overridden to user selected locale, but untranslated
  // (missed in object keys) just stay in english
  useEffect(() => {
    getMessages(locale).then((selectedLanguageMessages) => {
      const mergedMessages = Object.assign({}, ENMessages, selectedLanguageMessages);
      setMessages(mergedMessages);
    });
  }, [locale]);

  return (
    <IntlProvider locale={getLanguageCodefromLocale(locale)} messages={messages || ENMessages}>
      <GoogleReCaptchaProvider
        language="en"
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        scriptProps={{
          async: false, // optional, default to false,
          defer: false, // optional, default to false
          appendTo: "head", // optional, default to "head", can be "head" or "body",
          nonce: undefined, // optional, default undefined
        }}
        useEnterprise={false}
        useRecaptchaNet={true}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <ThemeProviderUI theme={theme}>
              {/* <GlobalStyle /> */}
              <CssBaseline />
              <SWRAuthConfig>
                <Auth>
                  <Head>
                    {/* Preload fonts */}
                    <link
                      rel="preload"
                      href={`${process.env.NEXT_PUBLIC_BASE_PATH}/fonts/PlexSans/IBMPlexSans-Regular.ttf`}
                      as="font"
                      crossOrigin=""
                    />
                  </Head>
                  <ErrorAlert />
                  <SuccessAlert />
                  <Component {...pageProps} />
                </Auth>
              </SWRAuthConfig>
            </ThemeProviderUI>
          </ThemeProvider>
        </StyledEngineProvider>
      </GoogleReCaptchaProvider>
    </IntlProvider>
  );
}

// MyApp.getInitialProps = async (appContext) => {};

export default WithReduxProvider(MyApp);