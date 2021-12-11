import { getPopoutOptions, openPopout } from './popout.js'

// This file is used for building the bingo board. We assume a size of five here.
// It fills the HTML with the challenge names, and also gives the ability to cycle
// through a challenge cell's Done, Failed, and Default stages by clicking on it.
// Shouldn't be too hard to expand upon it to hold any arbitrary size (I hope).
// The only thing that's stopping it from being flexible with dimensions is how it
// calculates the similarity of the selected challenges. It uses a `LINE_CHECK_LIST`
// that seems like it would need to be changed too accommodate different board
// sizes.

/// Typedefs
/**
 * A selected challenge object. Its properties are directly used to print stuff on the
 * bingo board.
 * @typedef {Object} SelectedChallenge
 * @property {number} difficulty
 * @property {string} name
 * @property {string[]} cats
 */

/**
 * A selected challenge object with `similarity` as a property. This is only used inside
 * `minimiseSimilarity`.
 * @typedef {Object} SelectedChallengeWithSimilarity
 * @property {number} difficulty
 * @property {string} name
 * @property {number} similarity
 * @property {string[]} cats
 */

/**
 * The initial version of a SelectedChallenge object. It's only got `difficulty` as a
 * property.
 * @typedef {Object} SelectedChallengeInit
 * @property {number} difficulty
 */
///

/**
 * Unused. Mirrors a value along a number line. Assumes i >= 0.
 * @param {number} i The number to mirror
 * @param {number} size The range of the number line. Defaults to 5.
 */
const mirror = (i, size = 5) => i + 2 * (~~(size / 2) - i)

/**
 * Creates an array of `size` with elements that go from `0` to `size - 1`.
 * @param {number} size
 * @returns {number[]}
 */
const arr = size => Array(...Array(size)).map((_, i) => i)

/**
 * Used in `calculateSimilarity`. Please read that function's docs to understand how this
 * is used.
 * @see calculateSimilarity
 */
const lineCheckList = [
  [1, 2, 3, 4, 5, 10, 15, 20, 6, 12, 18, 24],
  [0, 2, 3, 4, 6, 11, 16, 21],
  [0, 1, 3, 4, 7, 12, 17, 22],
  [0, 1, 2, 4, 8, 13, 18, 23],
  [0, 1, 2, 3, 8, 12, 16, 20, 9, 14, 19, 24],

  [0, 10, 15, 20, 6, 7, 8, 9],
  [0, 12, 18, 24, 5, 7, 8, 9, 1, 11, 16, 21],
  [5, 6, 8, 9, 2, 12, 17, 22],
  [4, 12, 16, 20, 9, 7, 6, 5, 3, 13, 18, 23],
  [4, 14, 19, 24, 8, 7, 6, 5],
  [0, 5, 15, 20, 11, 12, 13, 14],
  [1, 6, 16, 21, 10, 12, 13, 14],
  [0, 6, 12, 18, 24, 20, 16, 8, 4, 2, 7, 17, 22, 10, 11, 13, 14],
  [3, 8, 18, 23, 10, 11, 12, 14],
  [4, 9, 19, 24, 10, 11, 12, 13],

  [0, 5, 10, 20, 16, 17, 18, 19],
  [15, 17, 18, 19, 1, 6, 11, 21, 20, 12, 8, 4],
  [15, 16, 18, 19, 2, 7, 12, 22],
  [15, 16, 17, 19, 23, 13, 8, 3, 24, 12, 6, 0],
  [4, 9, 14, 24, 15, 16, 17, 18],

  [0, 5, 10, 15, 16, 12, 8, 4, 21, 22, 23, 24],
  [20, 22, 23, 24, 1, 6, 11, 16],
  [2, 7, 12, 17, 20, 21, 23, 24],
  [20, 21, 22, 24, 3, 8, 13, 18],
  [0, 6, 12, 18, 20, 21, 22, 23, 19, 14, 9, 4],
]

/**
 * Adds jQuery magic to a row/column header so that on hovering over one, the entire row/
 * column will be highlighted.
 *
 * This works by having the header have an ID of `tag` and its cells have a class name of
 * `tag`. So like, make sure you _don't_ pass a CSS identifier with `tag`. I.e. just pass
 * in `"row1"` instead of `"#row1"`.
 *
 * @param {string} tag The string that's used as the ID of a row/column header, and the
 *                     class name of its corresponding cells.
 */
const addHighlightCellsOnHoverHeader = tag => {
  $(`#${tag}`).hover(
    () => {
      $(`.${tag}`).addClass('hover')
    },
    () => {
      $(`.${tag}`).removeClass('hover')
    },
  )
}

/**
 * Adds jQuery magic to the row/column headers on the board (e.g. "ROW1") such that when
 * you hover over one, its corresponding row/column cells get highlighted.
 */
const addHighlightCellsOnHoverHeaders = () => {
  arr(5)
    .map(i => `row${i}`)
    .concat(arr(5).map(i => `col${i}`))
    .concat(['tlbr', 'bltr'])
    .map(addHighlightCellsOnHoverHeader)
}

/**
 * Add popout functionality to rows and columns. See top of `./popout.js` for detailed
 * explanation on this.
 */
const addOpenPopoutOnClickHeader = () => {
  $('.popout').click(function () {
    openPopout(getPopoutOptions($(this)))
  })
}

/**
 * Add CSS classes to toggle challenge states. States are:
 * 1. Done
 * 1. Failed
 * 1. Not Done
 */
const addCycleChallengeStateOnClickCells = () => {
  $('#bingo tr td:not(.popout), #selected td').toggle(
    function () {
      $(this).addClass('greensquare')
    },
    function () {
      $(this).addClass('redsquare').removeClass('greensquare')
    },
    function () {
      $(this).removeClass('redsquare')
    },
  )
}

/**
 * Calculates the... difficulty of a challenge?
 * @param {number} i The current iteration
 * @param {string} mode The current game mode. It's one of {Short,Normal,Long,Special}.
 * @param {string} seed The current game seed. It's stringified because of the seeding
 *                      library.
 */
const getDifficulty = (i, mode, seed) => {
  // To create the magic square we need 2 random orderings of the numbers 0, 1, 2, 3, 4.
  // The following creates those orderings and calls them Table5 and Table1

  let num3 = seed % 1000 // Table5 will use the ones, tens, and hundreds digits.

  let rem8 = num3 % 8
  let rem4 = Math.floor(rem8 / 2)
  let rem2 = rem8 % 2
  let rem5 = num3 % 5
  let rem3 = num3 % 3 // Note that Rem2, Rem3, Rem4, and Rem5 are mathematically independent.
  let remT = Math.floor(num3 / 120) // This is between 0 and 8

  // The idea is to begin with an array containing a single number, 0.
  // Each number 1 through 4 is added in a random spot in the array's current size.
  // The result - the numbers 0 to 4 are in the array in a random (and uniform) order.
  let table5 = [0]
  table5.splice(rem2, 0, 1)
  table5.splice(rem3, 0, 2)
  table5.splice(rem4, 0, 3)
  table5.splice(rem5, 0, 4)

  num3 = Math.floor(seed / 1000) // Table1 will use the next 3 digits.
  num3 = num3 % 1000

  rem8 = num3 % 8
  rem4 = Math.floor(rem8 / 2)
  rem2 = rem8 % 2
  rem5 = num3 % 5
  rem3 = num3 % 3
  remT = remT * 8 + Math.floor(num3 / 120) // This is between 0 and 64.

  let table1 = [0]
  table1.splice(rem2, 0, 1)
  table1.splice(rem3, 0, 2)
  table1.splice(rem4, 0, 3)
  table1.splice(rem5, 0, 4)

  remT = remT % 5 //  Between 0 and 4, fairly uniformly.
  let x = (i + remT) % 5 //  RemT is horizontal shift to put any diagonal on the main diagonal.
  let y = Math.floor(i / 5)

  // The Tables are set into a single magic square template
  // Some are the same up to some rotation, reflection, or row permutation.
  // However, all genuinely different magic squares can arise in this fashion.
  let e5 = table5[(x + 3 * y) % 5]
  let e1 = table1[(3 * x + y) % 5]

  // Table5 controls the 5* part and Table1 controls the 1* part.
  let value = 5 * e5 + e1

  if (mode === 'Short') {
    value = Math.floor(value / 2)
  } // if short mode, limit difficulty
  else if (mode === 'Long') {
    value = Math.floor((value + 25) / 2)
  } else if (mode === 'Special') {
    value = Math.floor((value + 25) / 2)
  }
  value++
  return value
}

/**
 * Gets a URL search param's value.
 * @param {string} name
 * @param {string} defaultVal
 */
const guptill = (name, defaultVal = '') =>
  new URLSearchParams(location.search).get(name) || defaultVal

/**
 * Calculates a prospective challenge's similarity to what's been chosen so far.
 *
 * Loops through `lineChecklist` to get a magical number, which is then used as an index
 * to get the categories of a particular challenge from the array of challenges that
 * have been chosen so far. The categories are then compared with the prospective
 * challenge's cats. The more matches between the two arrays, the higher the score. And
 * we want the lowest score possible.
 * @param {number} i The index of the currently-looked-at Challenge in the currently-
 *                   looked-at ChallengeGroup
 * @param {string[]} prospectiveCats The categories of the currently-looked-at Challenge
 * @param {SelectedChallenge[]} selectedChallenges The list of challenges chosen so far
 * @param {number[][]} lineCheckList A magical list of numbers to get a particular
 *                                   challenge from `selectedChallenges`
 * @returns {number}
 */
const calculateSimilarity = (
  i,
  prospectiveCats,
  selectedChallenges,
  lineCheckList,
) => {
  let similarity = 0
  if (prospectiveCats != null) {
    for (let j = 0; j < lineCheckList[i].length; j++) {
      const { cats: catsB } = selectedChallenges[lineCheckList[i][j]]
      if (catsB != null) {
        for (let k = 0; k < prospectiveCats.length; k++) {
          for (let l = 0; l < catsB.length; l++) {
            if (prospectiveCats[k] == catsB[l]) {
              similarity++ // if match, increase
              if (k == 0) {
                similarity++
              } // if main type, increase
              if (l == 0) {
                similarity++
              } // if main type, increase
            }
          }
        }
      }
    }
  }
  return similarity
}

/**
 * Get a random number as a bias for `selectNextChallenge`.
 * Location of this call affects its result. Like yes, even if you call this as a
 * parameter, or assign it first to a const before passing _that_ in, the value's
 * different.
 * @see {selectNextChallenge}
 * @param {ChallengeGroup} challengeGroup
 * @returns {number}
 */
const getStartIndex = challengeGroup =>
  ~~(challengeGroup.length * Math.random())

/**
 * Inits the array of selected challenges that will be used to populate the bingo board.
 * This will be an array of objects with a single property `difficulty`.
 * @param {string} mode The game mode
 * @param {string} seed The stringified game seed
 * @param {number} size The size of the bingo board. The board will be `size` x `size`.
 *                      Defaults to 5.
 * @returns {Object[]}
 */
const initSelectedChallenges = (mode, seed, size = 5) =>
  arr(size ** 2).map(i => ({
    difficulty: getDifficulty(i, mode, seed),
  }))

/**
 * Choose the next challenge to be added to the board.
 *
 * This loops through `challengeGroup`, starting from index `startIndex` instead of
 * simply 0, wrapping back around if needed. From there, we calculate the similarity of
 * each challenge to what's been chosen so far. The one with the lowest score is returned
 * to be selected.
 *
 * @see {getChallenges}
 * @param {ChallengeGroup} challengeGroup The group used to select the next challenge
 * @param {number} startIndex A bias to start selecting challenges in the group, instead
 *                            of simply starting from `challengeGroup[0]`
 * @param {Object[]} selectedChallenges The list of selected challenges so far. It is
 *                                      used in `calculateSimilarity` to decide which
 *                                      challenge in `challengeGroup` should be chosen
 * @param {number[][]} lineCheckList Really don't know how this is used as part of
 *                                   `calculateSimilarity`. But it's there.
 * @returns {SelectedChallengeWithSimilarity} The challenge with the lowest similarity
 *                                            score to `selectedChallenges`
 */
const selectNextChallenge = (
  challengeGroup,
  startIndex,
  selectedChallenges,
  lineCheckList,
) =>
  // Loop break taken from https://stackoverflow.com/questions/36144406/how-to-early-break-reduce-method/47441371#47441371
  challengeGroup.reduce((acc, _, i, group) => {
    const { name, cats } = group[(i + startIndex) % group.length]
    const similarity = calculateSimilarity(
      i,
      cats,
      selectedChallenges,
      lineCheckList,
    )
    if (acc == null || similarity < acc.similarity) {
      acc = { name, similarity, cats }
    }
    if (!similarity) {
      group.splice(1)
    }
    return acc
  }, null)

/**
 * Select challenges from the challenge pool, defined in `tables/generic.js`.
 * @param {SelectedChallengeInit[]} difficulties
 * @param {ChallengePool} challengePool The challenges to choose from
 * @param {number[][]} lineChecklist 2D array of magical numbers. Read
 *                                   `calculateSimilarity`'s docs for more info
 * @returns {SelectedChallenge[]} The array of selected challenges to populate the board
 */
const getChallenges = (difficulties, challengePool, lineCheckList) =>
  // We're not actually reducing the array here. Rather, we're reusing it to populate
  // itself with `name` and `cats`, as per the algo's design.
  difficulties.reduce((acc, { difficulty }, i) => {
    const { name, cats } = selectNextChallenge(
      challengePool[difficulty],
      getStartIndex(challengePool[difficulty]),
      acc,
      lineCheckList,
    )

    acc[i].name = name
    acc[i].cats = cats

    return acc
  }, difficulties.slice(0))

/**
 * Prints the selected challenges on the bingo board. The final step of everything.
 * @param {SelectedChallenge[]} challenges
 */
const printChallengesOnBoard = challenges =>
  challenges.forEach(({ name }, i) => {
    $('#slot' + (i + 1)).append(name)
  })

/**
 * Main function of this file. Selects the challenges to populate the board with, based
 * on a given seed, while minimising similarity of challenges based on a Challenge
 * object's `cats` property.
 * @see Challenge
 * @param {ChallengePool} challengePool The data source.
 * @returns {boolean} Don't think we actually need to return a value tbh. Could be wrong
 *                    of course.
 */
const bingo = challengePool => {
  const seed = guptill('seed')
  const mode = guptill('mode', 'Normal')

  if (seed == '') return reseedPage(mode)

  Math.seedrandom(seed) //sets up the RNG
  $('#results').append(
    '<p>SRT Bingo <strong>v1</strong>&emsp;Seed: <strong>' +
      seed +
      '</strong>&emsp;Card type: <strong>' +
      mode +
      '</strong></p>',
  )

  // Add jQuery manip stuff to the board
  addOpenPopoutOnClickHeader()
  addCycleChallengeStateOnClickCells()
  addHighlightCellsOnHoverHeaders()

  // Populate the bingo board in the array
  // The board itself is first stored as an array with objects that store the difficulty
  // in order 0-24
  printChallengesOnBoard(
    getChallenges(
      initSelectedChallenges(mode, seed),
      challengePool,
      lineCheckList,
    ),
  )

  return true
} // setup

/**
 * Reloads the page with a new seed.
 * @param {string} mode The game mode. One of {Short,Normal,Long,Special}. Unused.
 */
const reseedPage = (mode = 'Normal') => {
  window.location =
    '?' +
    new URLSearchParams({
      seed: Math.ceil(999999 * Math.random()),
      mode,
    }).toString()
  return false
}

// Adds `reseedPage` to be the on-click handler for the sort buttons on the bingo page.
$.map($('.sortButton'), function (el) {
  $(el).click(() => {
    reseedPage($(el).data('type'))
  })
})

export default bingo
