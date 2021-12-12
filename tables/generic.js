import bingo from '../js/bingo.js'

/**
 * A challenge that will be presented on the board.
 *
 * This is structured as { name: <name> }, as originally there also was a "cats" property
 * which was used to increase diversity of selections for a card. We're forgoing that for
 * now, but to minimise extra work on my end editing the algorithm in `js/bingo.js` to
 * accommodate for a slimmed-down version of `Challenge`, I'm keeping this same shape.
 * @typedef {Object} Challenge
 * @property {string} name Name of the challenge. It's what you'll read.
 */

/**
 * The data source the code in `js/bingo.js` uses to generate a board. Consists of
 * Challenges.
 * @typedef {Challenge[]} ChallengePool
 */

/**
 * The entire pool of challenges to choose from for the bingo. Focused on NG, restricting
 * cutscene-skipping.
 * @type {ChallengePool}
 */
 const challengePool = [
  { name: "Bloom 10 Cursed Patches" },
  { name: "Deliver the Acorn to Sleepy" },
  { name: "Deliver the Beehive to Sleepy" },
  { name: "Deliver Inaba to the Animal Lover" },
  { name: "Take Susano to Nagi’s Statue" },
  { name: "Obtain 40 Demon Fangs" },
  { name: "Use 15 Bags of Meat" },
  { name: "Use 15 Bags of Grass" },
  { name: "Use 15 Bags of Seeds" },
  { name: "Use 15 Bags of Fish" },
  { name: "Find 5 Zodiac Statues" },
  { name: "Race Kai" },
  { name: "Deliver the Prayer Slips to Rao" },
  { name: "Upgrade a Weapon With Gold Dust" },
  { name: "Defeat 2 Blockheads" },
  { name: "Rescue Chun" },
  { name: "Get 3 Hidden Brush Techniques (Includes Upgrades)" },
  { name: "Cut Down 2 Fruits From Sakuya’s Tree" },
  { name: "Do One of Yoichi’s Quests" },
  { name: "Raid the Treasury in Jamba’s Room" },
  { name: "Clear 6 Devil Gates" },
  { name: "Eat One of Mrs. Orange’s Cherry Cakes" },
  { name: "Learn Hardhead" },
  { name: "Get 10 Brush Techniques (Hidden/Upgrades Included)" },
  { name: "Collect 10 Crystals" },
  { name: "Deliver a Vase to 3 Guardian Statues" },
  { name: "Yeet a Lockjaw Key" },
  { name: "Do 2 Digging Minigames" },
  { name: "Get Fed by 3 Separate Npcs" },
  { name: "Get Whacked by 3 Separate Npcs" },
  { name: "Make 5 Snow Statues in Kamui" },
  { name: "Race Tobi 3 Times" },
  { name: "Fish Everywhere You Can at Least Once" },
  { name: "Activate 8 Mermaid Springs" },
  { name: "Draw a Design Somewhere" },
  { name: "Turn 5 Oina Into Wolves" },
  { name: "Get Pet by 25 Separate People" },
  { name: "Collect 10 Pearls" },
  { name: "Fight the Fire Doom Mirror" },
  { name: "Get Attacked by 3 Different Animals" },
  { name: "Defeat 3 Blue Demon Scrolls" },
  { name: "Find 5 Incense Burners" },
  { name: "Obtain 20 Stray Beads" },
  { name: "Raid the Sei-an Vault" },
  { name: "Obtain 2 Dungeon Maps" },
  { name: "Do the Snowball Quest in Wep’Keer" },
  { name: "Complete Komuso’s Challenge in Kusa" },
  { name: "Bark 50 Times" },
  { name: "Learn 2 Weapon Techniques" },
  { name: "Clear Mika’s Monster List (Shinshu)" },
  { name: "Clear Haruka’s Monster List (Kusa)" },
  { name: "Clear Wali’s Monster List (Kamui)" },
  { name: "Clear the Samurai’s Monster List (Sei-an)" },
  { name: "Take a Dive off Kamiki’s Waterfall" },
  { name: "Catch the Living Sword" },
  { name: "Buy a Weapon" },
  { name: "Obtain All Three End-Game Weapons" },
  { name: "Finish the Ryoshima Devil Gate Trail in the Red" },
  { name: "Draw Ammy on Your Mask" },
  { name: "Die In-Game" },
  { name: "Visit All the Islands in North Ryoshima" },
  { name: "Take the Aspiring Carpenter to Naguri" },
  { name: "Feed All the Cats in Catcall Tower" },
  { name: "Pause Your Game and Bet on One Duck Race on https://twitch.tv/duckracing" },
  { name: "Play in Reverse Cam for 5 Minutes" },
  { name: "No Running Indoors" },
  { name: "Don’t Turn Right for 3 Minutes" },
  { name: "Pause the Game and Do 10 Squats" },
  { name: "Bloom All the Trees in Hana Valley" },
  { name: "Collect the Snake Statue on the Twin Rocks in Ryoshima" },
  { name: "Bloom the Clovers at the Top of Taka Pass" },
  { name: "Get People Drunk in the Kamiki Festival" },
  { name: "Interrupt Susano and Kushi’s Moment in Cave of Nagi" },
  { name: "Push the Ball in Moon Cave" },
  { name: "Fill In the Entire River of the Heavens" },
  { name: "Fully Restore the Kusa Flower Patch" },
  { name: "Fill Up Your Astral Pouch Without Using Instafill Dishes" },
  { name: "Eat 20 Different Types of Food" },
  { name: "Get Eaten by the Water Dragon" },
  { name: "Deliver the Treasure Box to Urashima" },
  { name: "Swim in 15 Different Water Sources" },
  { name: "Talk to the Cutters in Cursed Taka" },
  { name: "Leave Flowers Near 3 Different Grave Locations" },
  { name: "Leap off Catcall Tower" },
  { name: "Pay a Visit to Waka’s HQ" },
  { name: "Catch 5 Different Blue Fish" },
  { name: "Catch 8 Large Fish" },
  { name: "Catch All the Night Fish From One Area" },
  { name: "Catch All the Day Fish From One Area" },
  { name: "Catch 6 “Non-fish” (Crustaceans, Mollusks...)" },
  { name: "Collect 15 Different Treasures" },
  { name: "Buy From an Imp Merchant" },
  { name: "Buy From 10 Separate Merchants" },
  { name: "Don’t Use the Brush for 3 Minutes" },
  { name: "Cross 4 Galestorm Bridges" },
  { name: "Clear Out a Devil Gate Using Only Subweapons" },
  { name: "Lay a Reflector Smackdown on 3 Enemies in One Battle" },
  { name: "Get Repelled by 4 Different Barriers" },
  { name: "Bloom 3 Clovers Buried Under Hard Ground" },
  { name: "Ride 3 Elevators" },
  { name: "Deliver the Kusa Pinwheel to the Tea Customer" },
  { name: "Obtain 5 Sun Fragments" },
  { name: "Complete a Fish Page" },
  { name: "Collect 10 Travel Guides" },
  { name: "Obtain 6 Different Tassels" },
  { name: "Complete a Bestiary Page" },
  { name: "Defeat the Seaweed Monster in Sunken Ship" },
  { name: "Fill In the Eyes of Two Daruma Dolls" },
  { name: "Get the Holy Bone L From the Ryoshima Bell" },
  { name: "Kill 3 Ghost Imps in Sunken Ship" },
]

$(function() { bingo(challengePool); });
