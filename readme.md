# Ōkami Bingo Board

This is a fork of the [original
project](https://github.com/Lyriati/okami-1/tree/gh-pages) by Lyriati and
rekyuu.

This is about 90% done; I just need to do what's in, well, [To Do](#to-do).

## Project Structure

- `assets/`
    - `Astralsokami-Regular.otf` Font file that mimics the in-game font. Thanks,
      Astral 🌞👑
- `css/`
    - `bingo.css` TODO: Learn what this is for
    - `style.css` TODO: Learn what this is for
- `js/`
    - `bingo.js` Populates the bingo board with challenges from reading the
      current seed and game mode.
    - `jquery.min.js` Minified [jQuery](https://jquery.com/) library.
    - `popout.js` Creates popouts when clicking on the row headers on the board
      (e.g. "ROW1").
    - `seedrandom-min.js` Minified
      [seedrandom](https://github.com/davidbau/seedrandom) script.
- `tables/`
    - `generic.js` The challenge pool, which `js/bingo.js` reads from.
- `bingo-popout.html` Markup for popouts.
- `favicon.png` Site icon.
- `challenges.csv` The source for bingo challenges.
- `goalslist.txt` The original source for challenges. Unused now.
- `index.html` Main markup file. This is where you can see the markup for the
  bingo page.
- `readme.md` The very file you're looking at right now.

## To Do

- Read through the CSS files to understand their places in life
- Read [this](https://dev.to/dcodeyt/send-data-between-tabs-with-javascript-2oa)
  to learn how to update a cell in both a popout and in the main board page
  (they're both the same origin so this _can_ work)

## Setup
In order to retrieve data from a Google Sheets spreadsheet, start by following
this guide to acquire a Google API token:
https://developers.google.com/workspace/guides/create-project


## Resources

[Okami Leaderboard](https://www.speedrun.com/Okami) [Okami Speedrunning
Discord](https://discord.gg/AQNKmMu)

## Contributors

* [Lyriati](https://www.twitch.tv/lyriati)
* [rekyuu](https://www.twitch.tv/rekyuus)
* [Auride](https://github.com/dshepsis)
* And [me :^)](https://www.github.com/zysim)
