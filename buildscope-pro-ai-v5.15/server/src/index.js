import app from "./app.js";
import {getConfig} from "./lib/config.js";

const port=getConfig().PORT;
app.listen(port,()=>console.log(`BuildScope backend listening on ${port}`));
