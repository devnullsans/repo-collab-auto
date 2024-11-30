import { createContext, useMemo, useState } from "react";
import AlertContainer, { useAlert } from "./components/Alerts";
import Loading from "./components/Loading";

export const GlobalContext = createContext();

export default function GlobalContextProvider({ children }) {
  const [alerts, showAlert] = useAlert();
  const [isLoading, setLoading] = useState(false);

  const memoed = useMemo(() => ({ showAlert, setLoading }), [showAlert]);

  return (
    <GlobalContext.Provider value={memoed}>
      <>
        {children}
        <AlertContainer alerts={alerts} />
        {isLoading && <Loading />}
      </>
    </GlobalContext.Provider>
  );
}
