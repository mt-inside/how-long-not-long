import { Router } from "https://deno.land/x/oak/mod.ts";

import getDeadline from "./handlers/getDeadline.ts";
import getQuotes from "./handlers/getQuotes.ts";

const router = new Router();

router
  .get("/deadline", getDeadline)
  .get("/quotes", getQuotes);

export default router;
