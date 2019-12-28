---
description: A text-based adventure system from Trezy Studios!
hint: `{{defaultPrefix}}adventure`
---

_Adventure Is Out There!_ is a text-based adventure (also known as _Interactive Fiction_) system from [Trezy Studios](https://trezy.com).

---

**`{{defaultPrefix}}adventure start <story_name>`**

This is how you start a new adventure! A player may only be on one adventure at a time, so _choose wisely_. Each adventure is based on a storyline written by Trezy Studios, so to start an adventure, you'll need to pass the story name to this command. If you're not sure what stories are available, no worries! `{{defaultPrefix}}adventure start` will give you a list of all of the current stories.

---

**`{{defaultPrefix}}adventure resume`**

If you haven't played in a while, you may not remember where you're currently at in the story! `{{defaultPrefix}}adventure resume` will show your current page again.

---

**`{{defaultPrefix}}adventure list`**

Lists all currently running adventures.

---

**`{{defaultPrefix}}adventure join <adventure_id>`**

Looking to join one of your friends on an adventure? This is how you do it! For a list of all currently running adventures and their IDs, use `{{defaultPrefix}}adventure list`.

---

**`{{defaultPrefix}}adventure leave`**

This command will remove you from your current adventure.

---

**`{{defaultPrefix}}adventure lock`**

Locking your adventure will prevent others from joining it. All adventures are locked by default.

---

**`{{defaultPrefix}}adventure unlock`**

Unlocking your adventure will allow others to join it. All adventures are locked by default.

---

**`{{defaultPrefix}}adventure <choice>`**

This is _the most important command_ that is available. This is how a member of an adventure moves the story along. Each page of a story will include a number of options displayed **in bold text**. By passing these choices into the `{{defaultPrefix}}adventure` command, you tell the game what to do next. For example...

> While trekking down the long, dark alley, you hear the clatter and clanging of trash cans up ahead. Will you **continue forward** to investigate? Will yoi turn and **run away**? Or are you so frozen by fear that you **don't move**?

The options in this narrative are `continue forward`, `run away`, or `don't move`. You can choose any of them...
```{{defaultPrefix}}adventure Continue forward```

> You slowly slink forward to investigate, careful not to make too much noise. As you approach the source of the clanging, you ready yourself to strike, assuming that the terrible beast you've been chasing is hiding just in front of you. Once you reach the bins, you begin to pounce— but you're interrupted as an alley cat skitters out. It hisses at you, then continues down the alley and around the corner. Oops.
