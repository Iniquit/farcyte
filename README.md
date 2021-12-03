![banner](farcyte-banner.png)
# farcyte
A discord bot for searching the Officially Unofficial Unsounded Transcript. Peer into the Khert!

### Usage
* Regular search: `/find <keyword>` (ex: `/find bite me tail with your 'abuse'`, `/find 1.8`). 
* 'Quiet' search: `/f <keyword>` (ex: `/f what right has cresce to such a sky`, `/f 9.39`).

Both commands accept page numbers and chapter titles. You can also DM commands to the bot itself.

### Contributing
Contributions are welcome! Just submit a pull request.

### Want to run your own copy?
1. Clone or download this repository.
2. In the root directory of the project, place a copy of the Unsounded transcript as a .txt file and a .env file in the following format:
```
TOKEN=your bot's token here
PREFIX=/
TRANSCRIPT_FILE=UNSOUNDED Transcription.txt
```

If you get timeouts, you can also increase the number of milliseconds with:
```
REST_REQUEST_TIMEOUT_MS=30000
```

3. In the root directory of the project, run `npm i` to install the necessary dependencies.
4. Run `node farcyte` or (on windows) double-click start.bat.