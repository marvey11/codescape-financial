import { useOutletContext } from "react-router-dom";
import { UseGenericContextType } from "../types";

export const useOutletContextData = <T>() => {
  return useOutletContext<UseGenericContextType<T>>();
};
