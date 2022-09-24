![banner](farcyte-banner.png)

# farcyte

A discord bot for searching the Officially Unofficial Unsounded Transcript. Peer into the Khert!

### Usage

`/find`

#### Required parameters:

`query`: a phrase or page number to search the transcript for.

#### Optional parameters

`quiet`: whether the page preview should be hidden
`chapter`: a chapter to restrict your search to

You can also DM commands to the bot itself.

### Contributing

Contributions are welcome! Just submit a pull request.

A big thank-you to **Stanchion** for adding new features to the bot and improving the development workflow!

### Want to run your own copy?

1. Clone or download this repository.
2. In the root directory of the project, place a copy of the Unsounded transcript as a .txt file.
3. In the root directory of the project, place an .env file in the following format:

```
TOKEN=your bot's token here
CLIENT_ID=your application's client id here
GUILD_ID=the ID of the guild you want to register commands to
TRANSCRIPT_FILE=the location of your transcript .txt file
```

You may also want the following optional values:

```
URL_REWRITE_FILE=the location of a .json file containing key-value pairs for URL rewriting
REST_REQUEST_TIMEOUT_MS=30000 (in case of timeouts)
```

5. (Optional) In the root directory of the project, place a .json file in the following format:

```
  {
    "originalArt": "09_10",
    "replacementArt": "09_10b"
  },
  {
    "originalURL": "10_46",
    "replacementURL": "10_45"
  }
```

6. In the root directory of the project, run `npm i` to install the necessary dependencies.
7. Run `node farcyte` or `npx nodemon` to have a filewatcher that rebuilds on file changes.
