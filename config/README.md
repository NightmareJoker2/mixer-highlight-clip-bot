How to configure
===

Save a file with the name `default.json` in the `config` directory with the following content:

```jsonc
{

    "Channels": [
        "" // your channel ID or token of the channel you want to join here
    ],
    "Beam":
    {
        "api_key": "", // your implicit grant OAuth token for your bot here
        "api_key2": null,
        "authorized_roles": [
            // authorized roles here
        ],
        "authorized_userIds": [
            // authorized users by ID here
        ]
    }
}
```

Adjust the values to your needs, do not add the comments. See `example.json` for an example.
Your best approach is probably copying the `example.json` file and renaming the copy to `default.json` and then editing the values.

1. The first item in the `Channels` array should be your channel name.
2. The `Beam` object can have the fields `api_key` and `api_key2`. 
    - If you are using a bot account that is both moderator (not necessary if slowchat is disabled and the account is old enough) and channel editor and authorized for chat and clip creation, as described in the main `README.md` in the repository, put your API key as the value for `api_key` and leave `api_key2` as `null`.
    - If you are using a bot account to connect to chat, and a second API key from your channel account to create the clips, put the bot API key at `api_key` and the channel API key at `api_key2`. Example below:

```jsonc
{

    "Channels": [
        "" // your channel ID or token of the channel you want to join here
    ],
    "Beam":
    {
        "api_key": "", // your implicit grant OAuth token for your bot here
        "api_key2": "", // your implicit grant OAuth token for your channel here
        "authorized_roles": [
            // authorized roles here
        ],
        "authorized_userIds": [
            // authorized users by ID here
        ]
    }
}
```

3. You can modify the user roles that are allowed to use the `!clip` command in `Beam.authorized_roles` and specify user's IDs who are allowed to use it in `Beam.authorized_userIds`.