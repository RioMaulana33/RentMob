import { useQuery } from "@tanstack/react-query";
import axios from "../libs/axios";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Query pertama untuk mendapatkan data user
export function useUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => axios.get("/auth/me").then(res => res.data.user),
    staleTime: 0,
    cacheTime: 0, 
    onSettled: () => {
      SplashScreen.hide();
    },
    onError: async error => {
      console.error(error);
      await AsyncStorage.removeItem("@auth-token");
    },
  });
}

