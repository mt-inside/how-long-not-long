import { fetchDeadline } from "./db.ts";
import { Deadline } from "../models/deadline.ts";

export const getDeadline = async (): Promise<Deadline> => {
  const deadline = await fetchDeadline();

  return deadline;
};
