Mixer Highlight Clip Bot
===

This is an example of a chat bot that can create clips on Mixer on a channel where they are enabled. There are currently no restrictions built-in on which users can use the `!clip` command it provides. Use with caution.

## How to use

### Setting up

1. Download and install [Node.JS](https://nodejs.org/), if you haven't already.
2. Clone or download and unzip the repository.
3. Open a command line terminal and navigate to the directory where you cloned or unzipped the code to.
4. Run `npm i` to install the dependencies.
5. Create your API key(s):

You will need to create an OAuth token for your bot with the scopes `chat:connect`, `chat:chat`, `chat:whisper`, `chat:bypass_slowchat`, and `channel:clip:create:self`.

At the time of writing, highlight clips are only available on channels with the roles `Partner` (partnered streamer with subscribe button), `VerifiedPartner` (verified brand channel without subscribe button), and possibly `Staff`.
You can create such a token here: [Authorize](https://mixer.com/oauth/authorize?response_type=token&client_id=24fe6039b1bed6d48648ef9cafeb8f2e894cdc112bdd0c87&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&scope=chat%3Aconnect%20chat%3Achat%20chat%3Awhisper%20chat%3Abypass_slowchat%20channel%3Aclip%3Acreate%3Aself) (right-click and open in an incognito window/private browsing session to avoid having to sign out)

Your bot account *should* be a Moderator (have the `Mod` role, mandatory for slowchat bypassing, but optional, if slowchat is disabled and the account is old enough) and *must* be a channel editor (have the `ChannelEditor` role) in your channel for this to work.

After clicking **Approve** you can copy your *implicit grant token* that is valid for a year out of the address bar of your web browser. That's the random looking letters between `#access_token=` and `&token_type=Bearer`. Keep this safe! Anyone who has this token can chat as your authorized bot account in any channel until you [revoke it](https://mixer.com/me/account/oauth) or it expires (whichever is sooner).

As of writing, passing the OAuth grant flow also only works for accounts using the *Anniversary Design* of the website, which is not available to all users (users with a Mixer Pro subscription, other conditions possible).

If the aforementioned method is not an option for you, you can also create two separate API keys, one for the bot to use to send and receive chat messages, and one for your channel account to create the highlight clips:

- Retrieve a key for your bot with `chat:connect`, `chat:chat`, `chat:whisper`, and `chat:bypass_slowchat`: [Authorize](https://mixer.com/oauth/authorize?response_type=token&client_id=24fe6039b1bed6d48648ef9cafeb8f2e894cdc112bdd0c87&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&scope=chat%3Aconnect%20chat%3Achat%20chat%3Awhisper%20chat%3Abypass_slowchat)
- Retrieve a key for your channel account with `channel:clip:create:self`: [Authorize](https://mixer.com/oauth/authorize?response_type=token&client_id=24fe6039b1bed6d48648ef9cafeb8f2e894cdc112bdd0c87&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&scope=channel%3Aclip%3Acreate%3Aself)

6. Create your configuration file. See `README.md` in the `config` directory for more.
7. Run the console application with `npm start`.

### Using the `!clip` command

Using this crude bot is very simple and it makes available to you the following four options:
1. `!clip` on its own will create a highlight of the last 30 seconds and use the current stream title as the clip title.
2. `!clip` followed by a number will create a clip as many seconds long as specified.
Example: `!clip 123` creates a clip of 2 minutes, 3 seconds.
If the number is smaller than 15, a request for 15 seconds will be made, and if that number is larger than 300 a request for 300 seconds will be made.
3. `!clip` followed by arbitrary text will set the clip title to the text specified. Example: `!clip your fancy title` creates a clip with *your fancy title* as its title.
4. `!clip` followed by arbitrary text with a number on either end with create a clip with the text specified as the title that is as many seconds long as the number specified. If there is a number on both ends, the number on the end will be used to specify clip duration. If you would like to ensure the number specified is used in the clip title instead, place the title text in double quotes.
Examples:
    - `!clip 123 your title here` creates a 123 second clip with *your title here* as the title
    - `!clip your title here 123` also creates a 123 second clip with *your title here* as the title
    - `!clip 123 your title here 45` creates a 45 second clip with *123 your title here* as the title
    - `!clip "123 your title here"` creates a 30 second clip with *123 your title here* as the title
    - `!clip 123 "your title here 45"` creates a 123 second clip with *your title here 45* as the title

## Questions & Problems?

Feel free to [open an issue](https://github.com/NightmareJoker2/mixer-highlight-clip-bot/issues). But please check your issue has not already been reported, and follow [constructive feedback rules](https://www.google.com/search?q=how+to+report+a+bug+to+a+developer), when you do. Everyone's time is valuable, try not to waste it. 🙂

## License

Copyright © 2018 NightmareJoker² Interactive

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.