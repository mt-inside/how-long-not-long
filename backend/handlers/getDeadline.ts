import { Response } from "https://deno.land/x/oak/mod.ts";
import { getDeadline } from "../services/deadline.ts";

export default async ({ response }: { response: Response }) => {
  response.body = await getDeadline();
};
