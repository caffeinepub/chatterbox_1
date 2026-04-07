import { createContext, useContext } from "react";

interface CallContextValue {
  startCall: (calleeIdText: string, peerName: string, isVideo: boolean) => void;
}

export const CallContext = createContext<CallContextValue>({
  startCall: () => {},
});

export function useCallContext() {
  return useContext(CallContext);
}
