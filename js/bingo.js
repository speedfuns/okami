// This file is used for building the bingo board. We assume a size of five here.
// It fills the HTML with the challenge names, and also gives the ability to cycle
// through a challenge cell's Done, Failed, and Default stages by clicking on it.
// Shouldn't be too hard to expand upon it to hold any arbitrary size (I hope).
// The only thing that's stopping it from being flexible with dimensions is how it
// calculates the similarity of the selected challenges. It uses a `LINE_CHECK_LIST`
// that seems like it would need to be changed too accommodate different board
// sizes.

import { getPopoutOptions, openPopout } from './popout.js'

/// Typedefs
/**
 * The details of a selected challenge, to be added to the the bingo board page.
 * @typedef {Object} ChallengeDataHtml
 * @property {number} difficulty The alleged difficulty of the challenge.
 * @property {string} name The name of the challenge. This is what you see on-screen.
 * @property {number} similarity The similarity of this challenge compared to the
 *                               the challenges that were chosen _at the time_ of
 *                               calculating it in `calculateChallengeSimilarity`.
 * @property {string[]} cats The category/categories this challenge belongs to.
 */
///

const capitalise = string =>
  string
    .split('')
    .map((l, i) => (!i ? l.toUpperCase() : l.toLowerCase()))
    .join('')

const isInArray = (needle, haystack) => haystack.indexOf(needle) > -1

/**
 * Used in calculating the similarity of a prospective challenge with already-chosen
 * ones. Frankly I think the algo is a little flawed; e.g. the first couple indices
 * here don't even get used.
 * @type {number[][]}
 */
const LINE_CHECK_LIST = [
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
 * Makes an array of size `size`, with values that are its indices. For
 * mapping/reducing/what have you.
 * @param {number} size The size of the array you desire
 * @return {number[]}
 */
const it = size => Array(...Array(size)).map((_, i) => i)

/**
 * Gets the mode and seed for the current round of bingo.
 * @returns {{
 *  seed: number,
 *  mode: string | null,
 * }}
 */
const getDetailsForBingo = () => {
  const searchParams = new URLSearchParams(location.search)
  return {
    seed: parseInt(searchParams.get('seed'), 10),
    mode: searchParams.get('mode'),
  }
}

/**
 * Calculates a horizontal shift that puts any diagonal on the main diagonal, allegedly.
 * `seed` is split into bottom and top three digits and gets a number within [0, 8] each.
 * Then we calculate to get a number in [0, 64], before... chopping things off to get
 * [0, 4] later??? Man I don't know..
 * @param {number} i Current iteration
 * @param {number} seed
 * @return {number}
 */
const calculateHShift = (i, seed) =>
  (i + ~~((seed % 1e3) / 120) * 8 + ~~(seed / 120e3)) % 5

/**
 * Calculates the horizontal and vertical shifts that puts any diagonal on the main
 * diagonal. Allegedly.
 */
const calculateShifts = (i, seed) => ({
  x: calculateHShift(i, seed),
  y: ~~(i / 5),
})

/**
 * Splits the current seed into its top and bottom three digits, in that order.
 * @param {number} seed The current seed for this bingo
 * @returns {[number, number]}
 */
const splitSeed = seed => [~~(seed / 1e3), seed % 1e3]

/**
 * Generates indices for feeding into the tables for generating the magic square. Note
 * that each element in the returned array is mathematically independent.
 * @param {number} seedSlice  A slice of the original seed. For example, we pass the top
 *                            and bottom three digits as `seedSlice` on individual calls
 *                            to this function
 * @returns {number[]}
 */
const generateIndicesForRange = seedSlice => [
  seedSlice % 2,
  seedSlice % 3,
  ~~((seedSlice % 8) / 2),
  seedSlice % 5,
]

/**
 * Creates an array of integers [1...N-1] in a random (and uniform) order, where N is the
 * size of the passed-in array. The elements of the array are the indices that determine
 * the order of the range.
 * @param {number[]} randomisedIndexSeq
 */
const createRandomisedRange = randomisedIndexSeq =>
  randomisedIndexSeq.reduce(
    (acc, rem, i) => {
      acc.splice(rem, 0, i)
      return acc
    },
    [0],
  )

/**
 * @param {number} seed The current seed for the bingo board
 * @returns {[number[], number[]]} [`table5`, `table1`]
 */
const createTable1Table5 = seed =>
  splitSeed(seed).map(generateIndicesForRange).map(createRandomisedRange)

/**
 * Calculates the base difficulty for a prospective challenge. This will be a number in
 * the range [0...N-1], where N is the size of the bingo board.
 * @param {Object} shifts
 * @param {number[]} table1
 * @param {number[]} table5
 * @returns {number}
 */
const calculateBaseDifficulty = (i, seed) => {
  const { x, y } = calculateShifts(i, seed)
  const [table1, table5] = createTable1Table5(seed)
  const e5 = table5[(x + 3 * y) % 5]
  const e1 = table1[(3 * x + y) % 5]
  return 5 * e5 + e1
}

/**
 * @param {string} mode The mode for the current bingo; one of `{<empty>, 'short',
 *                      'long', 'special'}`
 * @param {number} baseDifficulty
 * @returns {number}
 */
const addBiasToBaseDifficulty = (mode, baseDifficulty) => {
  switch (mode) {
    case 'short':
      return Math.ceil(baseDifficulty / 2)
    case 'long':
    case 'special':
      return Math.ceil((baseDifficulty + 25) / 2)
    default:
      return baseDifficulty + 1
  }
}

/**
 * To create the magic square we need 2 random orderings of the numbers 0, 1, 2, 3, 4.
 * We create those orderings and call them `table5` and `table1`:
 * - `table5` will use the ones, tens, and hundreds digits.
 * - `table1` will use the next 3 digits.
 *
 * table5 controls the 5* part and table1 controls the 1* part.
 * The tables are set into a single magic square template
 * Some are the same up to some rotation, reflection, or row permutation.
 * However, all genuinely different magic squares can arise in this fashion.
 *
 * @param {number} i The current iteration
 * @param {string} mode The mode for the current bingo; one of `{<empty>, 'short',
 *                      'long', 'special'}`
 * @param {number} seed The seed for the current bingo
 * @returns {number}
 */
const calculateDifficulty = (i, mode, seed) =>
  addBiasToBaseDifficulty(mode, calculateBaseDifficulty(i, seed))

/**
 * Creates an array of objects with a single property, `difficulty`. This will be used to
 * choose the challenges for the bingo.
 * @returns {{difficulty: number}}
 */
const createDifficulties = (mode, seed) =>
  it(25).map(i => ({
    difficulty: calculateDifficulty(i, mode, seed),
  }))

/**
 * TODO: This isn't even being used; `selectedChallenges` only has `difficulty`, and no
 * `cats` property at all. Figure out how to fix this.
 *
 * Calculates how similar a prospective challenge is to the challenges that have been
 * selected so far. This first loops through the already-chosen challenges, at indices
 * decided by `LINE_CHECK_LIST` (??? Why tho?), then loops through the categories of the
 * prospective and incumbent challenges to compare them. A point is added if the
 * categories match, and further point is added if the match is the prospective's main
 * category, and also if it's the incumbent's main too. This means that for a category
 * that is both the prospective's and incumbent's main, we return a whopping three
 * points for that challenge.
 * @see {Challenge} for an explanation of `cats{A,B}`.
 * @param {number} index
 * @param {number[]} prospectiveCats The categories of a prospective challenge.
 * @param {ChallengeDataHtml[]} selectedChallenges
 * @returns {number}
 */
const calculateChallengeSimilarity = (
  index,
  prospectiveCats,
  selectedChallenges,
) =>
  prospectiveCats != null
    ? LINE_CHECK_LIST[index].reduce((similarity, toCheckIndex) => {
        const { cats: catsB } = selectedChallenges[toCheckIndex] || {}
        if (catsB == null) return similarity
        // TODO: This can be split into main and subcats. Then compare the two separately
        prospectiveCats.forEach((a, k) => {
          catsB.forEach((b, l) => {
            console.log({a, b, k, l})
            if (a == b) {
              similarity++ // match increased
              if (!k) similarity++ // main cat increased
              if (!l) similarity++ // main cat increased
            }
          })
        })
        return similarity
      }, 0)
    : 0

/**
 * Adds CSS classes to each square in the board including the headers such that, when you
 * hover over a header, the entire corresponding row gets highlighted.
 * @param {string} headerId Just the string, without the '#'. I.e. just 'row1', and **not** '#row1'
 */
const addHighlightClassesToBingoRow = headerId => {
  $(`#${headerId}`).hover(
    () => $(`.${headerId}`).addClass('hover'),
    () => $(`.${headerId}`).removeClass('hover'),
  )
}

/**
 * @type {string[]}
 */
const ROW_HEADER_IDS = it(5)
  .reduce((acc, i) => acc.concat([`row${i + 1}`, `col${i + 1}`]), [])
  .concat(['tlbr', 'bltr'])

/**
 * Creates the popouts when the user clicks on the row headers.
 * @param {string} mode
 */
const createPopoutsOnClickRowHeaders = mode => {
  $('.popout').click(function () {
    openPopout(getPopoutOptions($(this), mode))
  })
}

// Make bingo squares cycle from green -> red -> blank
const makeSquaresCycleGreenRedBlank = () => {
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

const mirror = i => i + 2 * (2 - i)

/**
 * Selects a random challenge from the pool.
 * @param {ChallengeGroup} group
 * @param {number} bias
 * @returns {Challenge}
 */
const selectChallengeFromGroup = (group, bias) =>
  group[(~~(group.length * Math.random()) + bias) % group.length]

/**
 * Loops through the challenges in a group and gets the one that is the least similar to
 * the challenges that have already been selected for the bingo so far.
 * @param {ChallengePool} pool
 * @param {number} i
 * @param {ChallengeDataHtml[]} incumbentChallenges
 * @param {ChallengeDataHtml}
 */
const chooseChallengeInGroup = (pool, i, incumbentChallenges) =>
  pool[incumbentChallenges[i].difficulty]
    .map((_, j, group) => {
      const prospective = selectChallengeFromGroup(group, j)
      return {
        ...prospective,
        similarity: calculateChallengeSimilarity(
          i,
          prospective.cats,
          incumbentChallenges,
        ),
      }
    })
    .reduce(
      (acc, prospective) =>
        acc == null || prospective.similarity < acc.similarity
          ? prospective
          : acc,
      null,
    )

/**
 * Chooses the challenges for the bingo.
 * @param {ChallengePool} pool
 * @param {string} mode
 * @param {number} seed
 * @returns {ChallengeDataHtml[]}
 */
const chooseChallenges = (pool, mode, seed) =>
  createDifficulties(mode, seed).map((_, i, arr) =>
    chooseChallengeInGroup(pool, i, arr),
  )

/**
 * Adds the chosen challenges onto the bingo board.
 * @param {ChallengeDataHtml[]} chosenChallenges The challenges chosen based on the seed
 */
const populateBingoBoardOnPage = chosenChallenges => {
  chosenChallenges.forEach((c, i) => {
    // $(`#slot${i + 1}`).append(c.name)
    $(`#slot${i}`).append(`<br/>${c.cats.toString()}`)
    $(`#slot${i}`).append(`<br/>${c.similarity}`)
  })
}

/**
 * Writes the details of the current bingo at the bottom of the board on the page.
 * @param {string} mode
 * @param {number} seed
 */
const writeFooter = (mode, seed) => {
  $('#results').append(
    '<p>SRT Bingo <strong>v1</strong>&emsp;Seed: <strong>' +
      seed +
      '</strong>&emsp;Card type: <strong>' +
      capitalise(mode || 'normal') +
      '</strong></p>',
  )
}

/**
 * Creates the bingo. This is the "main" function that starts it all.
 * @param {ChallengePool} challengePool
 */
const bingo = challengePool => {
  const { seed, mode = 'normal' } = getDetailsForBingo()

  if (isNaN(seed)) return reseedPage(mode)

  Math.seedrandom(seed.toString()) // sets up the RNG. `seed` needs to be a string

  writeFooter(mode, seed)
  createPopoutsOnClickRowHeaders(mode)
  makeSquaresCycleGreenRedBlank()
  ROW_HEADER_IDS.map(addHighlightClassesToBingoRow)
  populateBingoBoardOnPage(chooseChallenges(challengePool, mode, seed))

  return true
}

/**
 * @param {string} mode
 */
const reseedPage = mode => {
  const qSeed = '?seed=' + ~~(1e6 * Math.random())
  const qMode = isInArray(mode, ['short', 'long']) ? '&mode=' + mode : ''
  location = qSeed + qMode
  return false
}

export default { bingo }
