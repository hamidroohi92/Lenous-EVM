import axios from "axios";
import { BASE_URL } from "./constants";

export const getUserCredit = async (address: string) => {
  return axios
    .get(`http://195.248.240.173:8000/api/user/balance/${address}`)
    .then((res: any) => {
      return res;
    });
};

export const handleGetNonce = async (address: string) => {
  console.log("get nonce");
  return await axios
    .get(`${BASE_URL}/user/get-nonce/${address}`)
    .then((res: any) => res);
};
