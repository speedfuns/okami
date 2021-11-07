/**
 * A single prospective challenge for the bingo.
 * @typedef {Object} Challenge
 * @property {string} name The challenge's description
 * @property {string[]} cats The categories a challenge belongs to. This is used to
 *                           minimise selecting challenges that are too similar to one
 *                           another. The 0th entry is the challenge's main category,
 *                           while the rest are subcategories.
 */

/**
 * A group of challenges, which position in `challengePool` is dependent on how much of
 * the game you have to complete. I _think_.
 * @typedef {Challenge[]} ChallengeGroup
 */

/**
 * @see challengePool
 * @typedef {ChallengeGroup[]} ChallengePool
 */


/**
 * The full list of prospective challenges which entries will be chosen from for the
 * bingo, depending on game mode and seed.
 *
 * This is also ordered in ascending difficulty. The lower you go, the harder the
 * challenge gets.
 * @type ChallengePool
 */
const challengePool = [
  [
    { name: "Shinshu Turnip Digging", cats: ["sidequest"] },
  ],
  [
    { name: "Rejuvenate Mrs. Orange's Laundry Poles", cats: ["sidequest"] },
    { name: "Tsuta Ruins Key", cats: ["dungeon"] },
    { name: "Bloom Taka Pass", cats: ["bloom"] },
    { name: "Obtain Sunrise", cats: ["free", "brush"] },
    { name: "Complete the Shinshu Field Monster List", cats: ["monsterlist"] },
    { name: "Obtain Cherrybomb", cats: ["brush", "cherrybomb"] },
    { name: "Bark 50 times", cats: ["bork", "free"] },
  ],
  [
    { name: "Defeat Ida 3 times and obtain the Gimmick Gear", cats: ["secret"] },
    { name: "Rescue Chun", cats: ["story"] },
    { name: "Complete Komuso's Challenge in Kamiki", cats: ["sidequest", "fight"] },
    { name: "Catch the WHOPPER", cats: ["fishing"] },
    { name: "Defeat Spider Queen", cats: ["dungeon", "boss", "story"] },
    { name: "Complete Turnip-digging minigame in Kamiki", cats: ["minigame", "sidequest"] },
    { name: "Bloom the clover on the island in Kamiki Village", cats: ["clover"] },
  ],
  [
    { name: "Feed all the animals in Hana Valley", cats: ["feeding"] },
    { name: "Have Camille reward you with praise", cats: ["praise"] },
    { name: "Have Sleepy reward you with praise", cats: ["praise"] },
    { name: "Bring the teacup to the Tea Master in Taka Pass", cats: ["teacup"] },
  ],
  [
    { name: "Find 5 Incense Burners", cats: ["treasure"] },
    { name: "Offer the vase to the Orochi Guardian Statue", cats: ["guardianstatue"] },
    { name: "Defeat 3 Blue Demon Scrolls", cats: ["fight"] },
    { name: "Obtain the Stray Bread from Kamiki Village Waterfall", cats: ["straybead"] },
    { name: "Obtain 10 Stray Beads", cats: ["straybead"] },
  ],
  [
    { name: "Feed all animals in Agata Forest", cats: ["feeding"] },
    { name: "Bloom the clover near Madam Fawn's hut", cats: ["clover"] },
    { name: "Obtain Galestorm", cats: ["brush", "story"] },
    { name: "Defeat Orochi", cats: ["story"] },
    { name: "Obtain the Mother Tree travel guide", cats: ["travelguide"] },
    { name: "Learn Holy Eagle", cats: ["dojo"] },
  ],
  [
    { name: "Learn Digging Champ", cats: ["dojo", "digging"] },
    { name: "Enter Sei'an City", cats: ["story"] },
    { name: "Obtain the Stray Bead behind Mr. Flower's house", cats: ["straybead"] },
    { name: "Obtain Veil of Mist", cats: ["brush"] },
    { name: "Buy Infinity Judge", cats: ["weapon"] },
    { name: "Bloom the clover behind the City Checkpoint Waterfall", cats: ["clover"] },
    { name: "Obtain Inferno", cats: ["brush"] },
  ],
  [
    { name: "Obtain all Stray Beads from Tsuta Ruins", cats: ["straybead"] },
    { name: "Obtain all Stray Beads from Kamiki Village", cats: ["straybead"] },
    { name: "Obtain the Stray Bead from Hayate", cats: ["straybead"] },
    { name: "Obtain all Stray Beads from Sasa Sanctuary", cats: ["straybead"] },
  ],
  [
    { name: "Sunken Ship Stray Bead", cats: ["straybead"] },
    { name: "Feed all the animals in Ryoshima Coast", cats: ["feeding"] },
    { name: "Obtain Cherrybomb 2", cats: ["brush", "cherrybomb"] },
    { name: "Obtain 20 Stray Beads", cats: ["straybead"] },
  ],
  [
    { name: "Retreive the Sun Fragment from the Gale Shrine", cats: ["item"] },
    { name: "Obtain all Stray Beads from Kusa Village", cats: ["straybead"] },
    { name: "Complete the Kusa Village Monster List", cats: ["monsterlist"] },
    { name: "Defeat the Bandit Spider and obtain the Sun Fragment", cats: ["fight"] },
  ],
  [
    { name: "Bloom Ryoshima Coast", cats: ["story"] },
    { name: "Fish a Manta", cats: ["fishing"] },
    { name: "Have the Tea Customer in Taka Pass give you praise", cats: ["praise"] },
    { name: "Draw five designs for the Sei'an City girl and obtain a Stray Bead", cats: ["straybead"] },
  ],
  [
    { name: "Help Mr. Flower preform his Gura Shuffle", cats: ["sidequest"] },
    { name: "Defeat Blight", cats: ["story", "boss"] },
    { name: "Beat a boss", cats: ["boss"] },
    { name: "Complete Masu's Monster Manifest", cats: ["monsterlist"] },
  ],
  [
    { name: "Bloom the clover in Sasa Sanctuary", cats: ["clover"] },
    { name: "Learn Mist Warp", cats: ["brush"] },
    { name: "Obtain the Northern Land travel guide", cats: ["travelguide"] },
  ],
  [
    { name: "Obtain the Mark of Kabegami travel guide", cats: ["travelguide"] },
    { name: "Obtain Power Slash 2", cats: ["brush"] },
    { name: "Obtain Deluge", cats: ["brush"] },
  ],
  [
    { name: "Obtain Fountain", cats: ["Brush"] },
    { name: "Obtain 100 Demon Fangs", cats: ["demonfangs"] },
    { name: "Fish a Marlin", cats: ["fishing"] },
    { name: "Bloom all the clovers in Sei'an City' ", cats: ["clover"] },
  ],
  [
    { name: "Increase Solar Energy to the max", cats: ["solarenergy"] },
    { name: "Fish a Striped Snapper", cats: ["fishing"] },
    { name: "Obtain a dungeon map", cats: ["dungeon"] },
    { name: "Obtain Whirlwind", cats: ["brush"] },
  ],
  [
    { name: "Defeat Ninetails", cats: ["story"] },
    { name: "Complete the Ryoshima Coast Devil Gate Trial Cave", cats: ["deviltrial"] },
    { name: "Obtain Thunderbolt", cats: ["brush"] },
    { name: "Obtain all the Stray Beads from North Ryoshima Coast", cats: ["straybead"] },
  ],
  [
    { name: "Obtain the Stray Bead from the Imperial Palace", cats: ["straybead"] },
    { name: "Obtain the Lucky Mallet", cats: ["item"] },
    { name: "Obtain all the Stray Beads from the Sunken Ship", cats: ["straybead"] },
    { name: "Obtain all the Stray Beads from Sei'an City's Aristocratic Quarters", cats: ["straybead"] },
  ],
  [
    { name: "Obtain all the Stray Beads from the Dragon Palace", cats: ["straybead"] },
    { name: "Clear the North Ryoshima Coast Devil Game Trial Cave", cats: ["deviltrial"] },
    { name: "Bloom all the clovers in Ryoshima Coast", cats: ["clover"] },
  ],
  [
    { name: "Bloom Kamui", cats: ["story"] },
    { name: "Use a Mermaid Spring to teleport from the Dragon Palace to Shinshu Field", cats: ["mermaidspring"] },
    { name: "Bloom all the clovers in Kamui", cats: ["clover"] },
    { name: "Defeat the Final Bandit Spider in Kamui", cats: ["fight"] },
  ],
  [
    { name: "Complete Wali's Record of Penance", cats: ["monsterlist"] },
    { name: "Have the boy wearing an Otter mask give you praise", cats: ["praise"] },
    { name: "Obtain Power Slash 3", cats: ["brush"] },
    { name: "Obtain the Sun Fragment from Kamui (Ezofuji)", cats: ["item"] },
  ],
  [
    { name: "Obtain the buried Sun Fragment from Inner Yoshpet", cats: ["item"] },
    { name: "Complete the Wawku Shrine", cats: ["Story"] },
    { name: "Obtain 50 Stray Beads", cats: ["straybead"] },
    { name: "Obtain all the Stray Beads in Inner Yoshpet", cats: ["straybead"] },
  ],
  [
    { name: "Learn Holy Falcon", cats: ["dojo"] },
    { name: "Learn Bead String", cats: ["dojo"] },
    { name: "Obtain all the Stray Beads in Wep'keer", cats: ["straybead"] },
    { name: "Obtain all the Stray Beads in Ponc'tan", cats: ["straybead"] },
  ],
  [
    { name: "Obtain the Sun Fragment from Wawku Shrine", cats: ["item"] },
    { name: "Bloom all the clovers in Shinshu Field (100 years ago)", cats: ["clover"] },
    { name: "Obtain all the Stray Beads in Catcall Tower", cats: ["straybead"] },
  ],
  [
    { name: "Clear the Kamui Devil Gate Trial Cave", cats: ["deviltrial"] },
    { name: "Bloom all the clovers in the Wawku Shrine", cats: ["clover"] },
    { name: "Fish a Yellowtail", cats: ["fishing"] },
    { name: "Fish an Oarfish", cats: ["fishing"] },
    { name: "Obtain all 13 Brush Techniques (No Hidden Ones)", cats: ["brush"] },
  ],
  [
    { name: "Obtain Cherrybomb 3", cats: ["brush"] },
    { name: "Enter the Ark of Yamato", cats: ["story"] },
    { name: "Defeat Orochi (100 years ago)", cats: ["story"] },
    { name: "Obtain Blizzard", cats: ["brush"] },
    { name: "Obtain all the Stray Beads in Kamui", cats: ["straybead"] },
    { name: "Obtain all the Stray Beads in the Gale Shrine", cats: ["straybead"] },
    { name: "Defeat Yami", cats: ["story"] },
  ],
]

$(function() { srl.bingo(challengePool, 5); })
