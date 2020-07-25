import { posix } from "https://deno.land/std@0.61.0/path/mod.ts";

import { DB_PATH } from "../config.ts";
import { Deadline} from "../models/deadline.ts";
import { Quote } from "../models/quote.ts";

const deadlinePath = "deadline.json"
const quotesPath = "quotes.json"

export const fetchDeadline = async (): Promise<Deadline> => {
    return fetchData(deadlinePath);
}

export const fetchQuotes = async (): Promise<Quote[]> => {
    return fetchData(quotesPath);
}

export const fetchData = async (dataPath: string): Promise<any> => {
  const data = await Deno.readFile(posix.join(DB_PATH, dataPath));

  const decoder = new TextDecoder();
  const decodedData = decoder.decode(data);

  return JSON.parse(decodedData);
};
