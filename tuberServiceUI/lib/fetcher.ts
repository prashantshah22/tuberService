import HttpRequest from "./http-request";

const fetcher = async (url: string) => {
  try {
    const { data } = await HttpRequest.get(url);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export default fetcher;
