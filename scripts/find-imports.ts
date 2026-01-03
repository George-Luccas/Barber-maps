
import * as Main from "better-auth";
// @ts-ignore
import * as Utils from "better-auth/utils";
// @ts-ignore
import * as Crypto from "better-auth/crypto";

console.log("Main:", Object.keys(Main).filter(k => k.toLowerCase().includes("hash")));
try { console.log("Utils:", Object.keys(Utils).filter(k => k.toLowerCase().includes("hash"))); } catch(e) {}
try { console.log("Crypto:", Object.keys(Crypto).filter(k => k.toLowerCase().includes("hash"))); } catch(e) {}
