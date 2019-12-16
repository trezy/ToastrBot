---
description: Used to manage custom commands via the chat interface.
hint: `{{defaultPrefix}}command [add|modify|remove] <command_name> <command_output>`
---

`{{defaultPrefix}}command` is used to create and manage the commands on your server. The three subcommands — `add`, `modify`, and `remove` — are mostly self explanatory. Their syntax, however, can be a bit tricky at times.

---

**`{{defaultPrefix}}command add`**

This allows you to add a new command to the server. Here's an example of tthe simplest form of this command:
```{{defaultPrefix}}command add chickens I like chickens!```
The result of this will be a new command — `{{defaultPrefix}}chickens` — that will cause ToastrBot to send a message to the channel saying, "I like chickens!"

There is also a special keyword — `action` — that can be used to have ToastrBot send action messages. For example:
```{{defaultPrefix}}command add cluck action clucks. Bok bok bok...```
Running the `{{defaultPrefix}}cluck` command will result in ToastrBot sending the message, "clucks. Bok bok bok..." The results of this vary by platform. On Discord, the message will be italicized. On Twitch, however, actions get their own special action syntax.

*NOTE:* Attempting to add a command that already exists will result in an error. Use `{{defaultPrefix}}command modify` instead.

---

**`{{defaultPrefix}}command modify`**

Days pass, the Earth spins, and commands get stale. Updating a command takes the same syntax as `{{defaultPrefix}}command add`, including the `action` keyword! the main difference is that `modify` only works on existing commands, whereas `add` only works for non-existent commands.

---

**`{{defaultPrefix}}command remove`**

When one of those pesky commands has outlived its purpose, it's time to go. Removing a command is simple:
```{{defaultPrefix}}command remove cluck```
ToastrBot will immediately delete the command. Be warned that this action is irreversible.
