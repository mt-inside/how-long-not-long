import { Response } from "https://deno.land/x/oak/mod.ts";
import { getQuotes } from "../services/quotes.ts";

export default async ({ response }: { response: Response }) => {
  response.body = await getQuotes();
};
