import { getPopoutOptions, openPopout } from './popout.js'

// This file is used for building the bingo board. We assume a size of five here.
// It fills the HTML with the challenge names, and also gives the ability to cycle
// through a challenge cell's Done, Failed, and Default stages by clicking on it.
// Shouldn't be too hard to expand upon it to hold any arbitrary size (I hope).
// The only thing that's stopping it from being flexible with dimensions is how it
// calculates the similarity of the selected challenges. It uses a `LINE_CHECK_LIST`
// that seems like it would need to be changed too accommodate different board
// sizes.

/**
 * Creates an array of `size` with elements that go from `0` to `size - 1`.
 * @param {number} size
 * @returns {number[]}
 */
const arr = size => Array(...Array(size)).map((_, i) => i)

/**
 * Adds info to the bottom of the bingo board.
 * @param {string} seed The stringified RNG seed
 */
const addBingoFooter = seed => {
  $('#footer').html($('#footer').html().replace('N/A', seed))
}

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
 * Gets a URL search param's value.
 * @param {string} name
 * @param {string} defaultVal
 */
const getSearchParam = (name, defaultVal = '') =>
  new URLSearchParams(location.search).get(name) || defaultVal

/**
 * Select challenges from the challenge pool, defined in `tables/generic.js`.
 * This rearranges the parameter array in-place, but this doesn't matter because
 * challengePool is only ever read here, and this function only runs once (when
 * the page loads).
 * @param {ChallengePool} challengePool The challenges to choose from
 * @returns {Challenge[]} The array of selected challenges to populate the board
 */
const getChallenges = (challengePool, count = 25) => {
  const selected = [];
  const poolSize = challengePool.length;
  for (let i = 0; i < count; ++i) {
    const randIndex = Math.floor(Math.random() * (poolSize - i)) + i;
    const temp = challengePool[randIndex];
    challengePool[randIndex] = challengePool[i];
    challengePool[i] = temp;
    selected.push(temp);
  }
  return selected;
}

/**
 * Prints the selected challenges on the bingo board. The final step of everything.
 * @param {Challenge[]} challenges
 */
const printChallengesOnBoard = challenges =>
  challenges.forEach((name, i) => {
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
  const seed = getSearchParam('seed')

  // This always refreshes the pages, so it's fine to just return:
  if (seed == '') return reseedPage()

  Math.seedrandom(seed) //sets up the RNG

  // Add jQuery manip stuff to the board
  addBingoFooter(seed)
  addOpenPopoutOnClickHeader()
  addCycleChallengeStateOnClickCells()
  addHighlightCellsOnHoverHeaders()

  // Populate the bingo board in the array
  // The board itself is first stored as an array with objects that store the difficulty
  // in order 0-24
  printChallengesOnBoard(getChallenges(challengePool))

  return true
} // setup

/**
 * Reloads the page with a new seed.
 */
const reseedPage = () => {
  window.location =
    '?' +
    new URLSearchParams({
      seed: Math.ceil(999999 * Math.random()),
    }).toString();
}

export default bingo
