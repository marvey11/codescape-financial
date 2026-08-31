import { useOutletContext } from "react-router";
import { UseGenericContextType } from "../types";

export const useOutletContextData = <T>() => {
  return useOutletContext<UseGenericContextType<T>>();
};
