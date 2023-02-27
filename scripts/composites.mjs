import { readFileSync, readdirSync } from 'fs';
import { CeramicClient } from '@ceramicnetwork/http-client'
import path, { extname } from 'path'
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
  mergeEncodedComposites
} from "@composedb/devtools-node";

import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";


const ceramic = new CeramicClient("http://localhost:7007");

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async (spinner) => {
  await authenticate()
  spinner.info("writing composite to Ceramic")

  await encodeComposites(readdirSync('./composites'))
  await mergeComposites()

  spinner.succeed("composite deployed & ready for use");
}

const encodeComposites = async (files) => {
  let composite
  files.forEach(async (file, _id) => {
    try {
      composite = await createComposite(ceramic, `./composites/${file}`)
      await writeEncodedComposite(
        composite, 
        `./src/__generated__/${file.split('.graphql')[0]}.json`
      )
      // const deployedComposite = await readEncodedComposite(ceramic, `./src/__generated__/${file.split('.graphql')[0]}.json`)
      // deployedComposite.startIndexingOn(ceramic)
    } catch (err) {
      console.error(err)
    }
  })
}

const mergeComposites = async () => {
  const files = readdirSync('./src/__generated__/').filter(file => {return extname(file).toLowerCase() === '.json'})
  setTimeout(async () => {
    await mergeEncodedComposites(
      ceramic, 
      files.map(file => (`./src/__generated__/${file}`)), 
      './src/__generated__/definition.json'
    )
    await writeEncodedCompositeRuntime(
      ceramic,
      './src/__generated__/definition.json',
      './src/__generated__/definition.js'
    )
    const deployedComposite = await readEncodedComposite(ceramic, './src/__generated__/definition.json')
    deployedComposite.startIndexingOn(ceramic)
  }, 3000)
}

/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
  const seed = readFileSync('./admin_seed.txt')
  const key = fromString(
    seed,
    "base16"
  );
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key)
  })
  await did.authenticate()
  ceramic.did = did
}