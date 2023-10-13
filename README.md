# ComposeDB Example App instructions

Due to the nature of the Ceramic Daemon certain files must be updated to work with your local machine. Please follow the following directions carefully to ensure functionality.

1. On line 14 of `composedb.config.json`, update the db key to be your ceramic install.
   You must use the full pathname as the Ceramic Daemon doesn't like relative paths. This path must start with `sqlite://` and must end with `indexing.sqlite`

    Your home directory should be between these two required strings. `YOURUSERNAME` should be replaced with your username.

    For example, on a Mac it would be: `sqlite:///Users/YOURUSERNAME/.ceramic/indexing.sqlite`, or on Linux: `sqlite:////home/YOURUSERNAME/.ceramic/indexing.sqlite`

2. Run `npm i` to install the packages
3. Start the development server with `npm run dev` once. You may continue to use this command if you'd like however it will close all Ceramic connections at the first error. It is recommended that once your node is configured to index the required models that you run `npm run ceramic` & `npm run nextDev` separately to avoid this eager quitting.
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
5. Enjoy this demo application!

## Learn More

Upgrade this project to claynet to see other developer's posts! Check out wheel to install ceramic / composeDB locally:

https://github.com/ceramicstudio/wheel

To learn more about Ceramic please visit the following links

-   [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
-   [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!

You can check out [Create Ceramic App repo](https://github.com/ceramicstudio/create-ceramic-app) and provide us with your feedback or contributions!
