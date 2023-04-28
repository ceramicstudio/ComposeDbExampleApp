import type { CeramicApi } from "@ceramicnetwork/common"
import type { ComposeClient } from "@composedb/client";
import {Ed25519Provider} from "key-did-provider-ed25519";
import { getResolver } from 'key-did-resolver'
import {DID} from "dids";

const DID_SEED_KEY = 'ceramic_did_seed'

/**
 * Checks localStorage for a stored DID Session. If one is found we authenticate it, otherwise we create a new one.
 * @returns Promise<DID-Session> - The User's authenticated sesion.
 */
export const authenticateCeramic = async (ceramic: CeramicApi, compose: ComposeClient) => {
  let seed_array: Uint8Array
  if (localStorage.getItem(DID_SEED_KEY) === null){
    console.log("Generating seed...")
    let seed = crypto.getRandomValues(new Uint8Array(32))
    let seed_json = JSON.stringify(seed, (key, value) => {
      if (value instanceof Uint8Array) {
        return Array.from(value);
      }
      return value;
    });
    localStorage.setItem(DID_SEED_KEY, seed_json)
    seed_array = seed
    console.log("Generated new seed: " + seed)
  } else {
    let seed_json_value = localStorage.getItem(DID_SEED_KEY)
    let seed_object = JSON.parse(seed_json_value)
    seed_array = seed_object
    console.log("Found seed: " + seed_array)
  }
  const provider = new Ed25519Provider(seed_array)
  const did = new DID({ provider, resolver: getResolver() })
  await did.authenticate()
  ceramic.did = did
  compose.setDID(did)
  return did
}
