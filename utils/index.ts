import type { CeramicApi } from "@ceramicnetwork/common"
import type { ComposeClient } from "@composedb/client";
import {Ed25519Provider} from "key-did-provider-ed25519";
import { getResolver } from 'key-did-resolver'
import {DID} from "dids";

/**
 * Checks localStorage for a stored DID Session. If one is found we authenticate it, otherwise we create a new one.
 * @returns Promise<DID-Session> - The User's authenticated sesion.
 */
export const authenticateCeramic = async (ceramic: CeramicApi, compose: ComposeClient) => {
  const seed = new Uint8Array([
    57, 105,  44, 154, 126, 106, 138,  36,
    6,  29,  62, 191,  79,  25,   5, 224,
    235,   5, 203, 135, 153,   8, 178, 232,
    150, 204, 227, 242, 251,  57, 103,  35
  ])
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver: getResolver() })
  await did.authenticate()
  ceramic.did = did
  compose.setDID(did)
  return did
}
