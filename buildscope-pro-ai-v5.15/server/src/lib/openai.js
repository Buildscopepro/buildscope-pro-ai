import OpenAI from "openai";
import {getConfig} from "./config.js";

let client;
export function getOpenAI(){
  const c=getConfig();
  if(!c.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
  if(!client) client=new OpenAI({apiKey:c.OPENAI_API_KEY});
  return client;
}
