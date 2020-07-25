import { fetchQuotes } from "./db.ts";
import { Quote } from "../models/quote.ts";

export const getQuotes = async (): Promise<Quote[]> => {
  const quotes = await fetchQuotes();

  return quotes;
};
