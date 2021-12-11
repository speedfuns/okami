import bingo from '../js/bingo.js'

/**
 * A challenge that will be presented on the board.
 * @typedef {Object} Challenge
 * @property {string} name Name of the challenge. It's what you'll read.
 * @property {string[]} cats Tags a challenge to categories it belongs to. First
 * element is always present, and represents a challenge's main category. Any following
 * categories will be considered sub-categories. This property is used to increase the
 * diversity of challenges presented on the board.
 */

/**
 * A group of challenges that belong to the same "difficulty", which is defined by the
 * same level of prior story progression, roughly.
 * @typedef {Challenge[]} ChallengeGroup
 */

/**
 * The data source the code in `js/bingo.js` uses to generate a board. Consists of
 * Challenges grouped into 26 (5x5 board + Kamiki turnip digging on its own for some
 * reason??) ChallengeGroups, ordered by a rough measure of prior story progression,
 * termed here as "difficulty".
 * @typedef {ChallengeGroup[]} ChallengePool
 */

/**
 * The entire pool of challenges to choose from for the bingo. Focused on NG, restricting
 * cutscene-skipping.
 * @type {ChallengePool}
 */
const challengePool = [];
challengePool[0] = [
  { name: "Kamiki Turnip Digging", cats: ["sidequest"] },
],
challengePool[1] = [
  { name: "Rejuvenate Mrs. Orange\'s Laundry Poles", cats: ["sidequest"] },
  { name: "Tsuta Ruins Key", cats: ["dungeon"] },
  { name: "Bloom Taka Pass", cats: ["bloom"] },
  { name: "Obtain Sunrise", cats: ["free","brush"] },
  { name: "Complete the Shinshu Field Monster List", cats: ["monsterlist"] },
  { name: "Obtain Cherrybomb", cats: ["brush","cherrybomb"] },
  { name:  "Bark 50 times", cats: ["bork","free"] },
],
challengePool[2] = [
  { name: "Defeat Ida 3 times and obtain the Gimmick Gear", cats: ["secret"] },
  { name: "Rescue Chun", cats: ["story"] },
  { name: "Complete Komuso's Challenge in Kamiki", cats: ["sidequest","fight"] },
  { name: "Catch the WHOPPER", cats: ["fishing"] },
  { name: "Defeat Spider Queen", cats: ["dungeon","boss","story"] },
  { name: "Complete Turnip-digging minigame in Kamiki", cats: ["minigame","sidequest"] },
  { name: "Bloom the clover on the island in Kamiki Village", cats: ["clover"] },
],
challengePool[3] = [
 { name: "Feed all the animals in Hana Valley", cats: ["feeding"] },
 { name: "Have Camille reward you with praise", cats: ["praise"] },
 { name: "Have Sleepy reward you with praise", cats: ["praise"] },
 { name: "Bring the teacup to the Tea Master in Taka Pass", cats: ["teacup"] }
],
challengePool[4] = [
 { name: "Find 5 Incense Burners", cats: ["treasure"] },
 { name: "Offer the vase to the Orochi Guardian Statue", cats: ["guardianstatue"] },
 { name: "Defeat 3 Blue Demon Scrolls", cats: ["fight"] },
 { name: "Obtain the Stray Bread from Kamiki Village Waterfall", cats: ["straybead"] },
 { name: "Obtain 10 Stray Beads", cats: ["straybead"] }
],
challengePool[5] = [
  { name: "Feed all animals in Agata Forest", cats: ["feeding"] },
  { name: "Bloom the clover near Madam Fawn's hut", cats: ["clover"] },
  { name: "Obtain Galestorm", cats: ["brush","story"] },
  { name: "Defeat Orochi", cats: ["story"] },
  { name: "Obtain the Mother Tree travel guide", cats: ["travelguide"] },
  { name: "Learn Holy Eagle", cats: ["dojo"] },
],
challengePool[6] = [
 { name: "Learn Digging Champ", cats: ["dojo","digging"] },
 { name: "Enter Sei\'an City", cats: ["story"] },
 { name: "Obtain the Stray Bead behind Mr. Flower\'s house", cats: ["straybead"] },
 { name: "Obtain Veil of Mist", cats: ["brush"] },
 { name: "Buy Infinity Judge", cats: ["weapon"] },
 { name: "Bloom the clover behind the City Checkpoint Waterfall", cats: ["clover"] },
 { name: "Obtain Inferno", cats: ["brush"] }
],
challengePool[7] = [
 { name: "Obtain all Stray Beads from Tsuta Ruins", cats: ["straybead"] },
 { name: "Obtain all Stray Beads from Kamiki Village", cats: ["straybead"] },
 { name: "Obtain the Stray Bead from Hayate", cats: ["straybead"] },
 { name: "Obtain all Stray Beads from Sasa Sanctuary", cats: ["straybead"] }
],
challengePool[8] = [
 { name: "Sunken Ship Stray Bead", cats: ["straybead"] },
 { name: "Feed all the animals in Ryoshima Coast ", cats: ["feeding"] },
 { name: "Obtain Cherrybomb 2", cats: ["brush","cherrybomb"] },
 { name: "Obtain 20 Stray Beads", cats: ["straybead"] }
],
challengePool[9] = [
 { name: "Retreive the Sun Fragment from the Gale Shrine", cats: ["item"] },
 { name: "Obtain all Stray Beads from Kusa Village", cats: ["straybead"] },
 { name: "Complete the Kusa Village Monster List", cats: ["monsterlist"] },
 { name: "Defeat the Bandit Spider and obtain the Sun Fragment", cats: ["fight",] }
],
challengePool[10] = [
 { name: "Bloom Ryoshima Coast", cats: ["story"] },
 { name: "Fish a Manta", cats: ["fishing"] },
 { name: "Have the Tea Customer in Taka Pass give you praise", cats: ["praise"] },
 { name: "Draw five designs for the Sei\'an City girl and obtain a Stray Bead", cats: ["straybead"] }
],
challengePool[11] = [
 { name: "Help Mr. Flower preform his Gura Shuffle", cats: ["sidequest"] },
 { name: "Defeat Blight", cats: ["story","boss"] },
 { name: "Beat a boss", cats: ["boss"] },
 { name: "Complete Masu\'s Monster Manifest", cats: ["monsterlist"] }
],
challengePool[12] = [
 { name: "Bloom the clover in Sasa Sanctuary", cats: ["clover"] },
 { name: "Learn Mist Warp", cats: ["brush"] },
 { name: "Obtain the Northern Land travel guide", cats: ["travelguide"] }
],
challengePool[13] = [
 { name: "Obtain the Mark of Kabegami travel guide", cats: ["travelguide"] },
 { name: "Obtain Power Slash 2", cats: ["brush"] },
 { name: "Obtain Deluge", cats: ["brush"] }
],
challengePool[14] = [
 { name: "Obtain Fountain", cats: ["Brush"] },
 { name: "Obtain 100 Demon Fangs", cats: ["demonfangs"] },
 { name: "Fish a Marlin", cats: ["fishing"] },
 { name: "Bloom all the clovers in Sei\'an City' ", cats: ["clover"] },
],
challengePool[15] = [
 { name: "Increase Solar Energy to the max", cats: ["solarenergy"] },
 { name: "Fish a Striped Snapper", cats: ["fishing"] },
 { name: "Obtain a dungeon map", cats: ["dungeon"] },
 { name: "Obtain Whirlwind", cats: ["brush"] }
 ],
challengePool[16] = [
 { name: "Defeat Ninetails", cats: ["story"] },
 { name: "Complete the Ryoshima Coast Devil Gate Trial Cave", cats: ["deviltrial"] },
 { name: "Obtain Thunderbolt", cats: ["brush"] },
 { name: "Obtain all the Stray Beads from North Ryoshima Coast", cats: ["straybead"] }
],
challengePool[17] = [
 { name: "Obtain the Stray Bead from the Imperial Palace", cats: ["straybead"] },
 { name: "Obtain the Lucky Mallet", cats: ["item"] },
 { name: "Obtain all the Stray Beads from the Sunken Ship", cats: ["straybead"] },
 { name: "Obtain all the Stray Beads from Sei\'an City\'s Aristocratic Quarters", cats: ["straybead"] }
],
challengePool[18] = [
 { name: "Obtain all the Stray Beads from the Dragon Palace", cats: ["straybead"] },
 { name: "Clear the North Ryoshima Coast Devil Game Trial Cave", cats: ["deviltrial"] },
 { name: "Bloom all the clovers in Ryoshima Coast", cats: ["clover"] }
],
challengePool[19] = [
 { name: "Bloom Kamui", cats: ["story"] },
 { name: "Use a Mermaid Spring to teleport from the Dragon Palace to Shinshu Field", cats: ["mermaidspring"] },
 { name: "Bloom all the clovers in Kamui", cats: ["clover"] },
 { name: "Defeat the Final Bandit Spider in Kamui", cats: ["fight"] }
],
challengePool[20] = [
 { name: "Complete Wali\'s Record of Penance", cats: ["monsterlist"] },
 { name: "Have the boy wearing an Otter mask give you praise", cats: ["praise"] },
 { name: "Obtain Power Slash 3", cats: ["brush"] },
 { name: "Obtain the Sun Fragment from Kamui (Ezofuji)", cats: ["item"] }
],
challengePool[21] = [
 { name: "Obtain the buried Sun Fragment from Inner Yoshpet", cats: ["item"] },
 { name: "Complete the Wawku Shrine", cats: ["Story"] },
 { name: "Obtain 50 Stray Beads", cats: ["straybead"] },
 { name: "Obtain all the Stray Beads in Inner Yoshpet", cats: ["straybead"] }
],
challengePool[22] = [
 { name: "Learn Holy Falcon", cats: ["dojo"] },
 { name: "Learn Bead String", cats: ["dojo"] },
 { name: "Obtain all the Stray Beads in Wep\'keer", cats: ["straybead"] },
 { name: "Obtain all the Stray Beads in Ponc\'tan", cats: ["straybead"] }
],
challengePool[23] = [
 { name: "Obtain the Sun Fragment from Wawku Shrine", cats: ["item"] },
 { name: "Bloom all the clovers in Shinshu Field (100 years ago)", cats: ["clover"] },
 { name: "Obtain all the Stray Beads in Catcall Tower", cats: ["straybead"] }
],
challengePool[24] = [
 { name: "Defeat the Kamui Devil Gate Bandit Spider", cats: ["boss"] },
 { name: "Clear the Kamui Devil Gate Trial Cave", cats: ["deviltrial"] },
 { name: "Bloom all the clovers in the Wawku Shrine", cats: ["clover"] },
 { name: "Fish a Yellowtail", cats: ["fishing"] },
 { name: "Fish an Oarfish", cats: ["fishing"] },
 { name: "Obtain all 13 Brush Techniques (No Hidden Ones)", cats: ["brush"] }
],
challengePool[25] = [
  { name: "Obtain Cherrybomb 3", cats: ["brush"] },
  { name: "Enter the Ark of Yamato", cats: ["story"] },
  { name: "Defeat Orochi (100 years ago)", cats: ["story"] },
  { name: "Obtain Blizzard", cats: ["brush"] },
  { name: "Obtain all the Stray Beads in Kamui", cats: ["straybead"] },
  { name: "obtain all the Stray Beads in the Gale Shrine", cats: ["straybead"] },
  { name: "Defeat Yami", cats: ["story"] }
],

$(function() { bingo(challengePool); });
