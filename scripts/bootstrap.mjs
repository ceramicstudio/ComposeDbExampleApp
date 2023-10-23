import { writeComposite } from './composites.mjs';
import ora from 'ora'

const spinner = ora();


const bootstrap = async () => {
    // TODO: convert to event driven to ensure functions run in correct orders after releasing the bytestream.
    // TODO: check if .grapql files match their .json counterparts
    //       & do not create the model if it already exists & has not been updated
    try {
      spinner.info("[Composites] bootstrapping composites");
      await writeComposite(spinner)
      spinner.succeed("Composites] composites bootstrapped");
    } catch (err) {
      spinner.fail(err.message)
      ceramic.kill()
      throw err
    }
  }

await bootstrap()