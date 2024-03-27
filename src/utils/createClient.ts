import axios, { type RawAxiosRequestHeaders } from "axios";

const createClient = (
  baseURL: string,
  defaultHeaders?: RawAxiosRequestHeaders
) =>
  axios.create({
    baseURL,
    headers: defaultHeaders,
  });

export default createClient;
