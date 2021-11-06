const capitalise = string =>
  string
    .split('')
    .map((l, i) => (!i ? l.toUpperCase() : l.toLowerCase()))
    .join('')

const isInArray = (needle, haystack) => haystack.indexOf(needle) > -1

const it = size => Array(...Array(size)).map((_, i) => i)

const parseSearchParams = () => {
  const searchParams = new URLSearchParams(location.search)
  return {
    lang: searchParams.get('lang') || 'name',
    seed: parseInt(searchParams.get('seed'), 10),
    mode: searchParams.get('mode'),
  }
}

/**
 * @param {string} mode
 * @returns {string}
 */
const getCardType = mode =>
  isInArray(mode, ['short', 'long']) ? capitalise(mode) : 'Normal'

/**
 * Generates indices for feeding into the tables for generating the magic square.
 * Note that each element in the returned array is mathematically independent.
 * @param {number} seedSlice  A slice of the original seed. For example, we use the top
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
 * remT is horizontal shift to put any diagonal on the main diagonal.
 * Splits `seed` into bottom and top three digits and gets a number within [0, 8] each.
 * Then we calculate to get a number in [0, 64], before... chopping things off to get
 * [0, 4] later??? Man I don't know..
 * @param {number} seed
 * @return {number}
 */
const calculateRemT = seed => ~~((seed % 1e3) / 120) * 8 + ~~(seed / 120e3)

/**
 * Creates an array of integers [1...N] in a random (and uniform) order, where N is the
 * size of the passed-in array. The elements of the array are the indices that determine
 * the order of the range.
 * @param {number[]} randomisedIndexSeq
 */
const createRandomisedRange = randomisedIndexSeq =>
  randomisedIndexSeq.reduce(
    (acc, rem, i) => {
      acc.splice(rem, 0, i + 1)
      return acc
    },
    [0],
  )

const calculateDifficulty = (i, mode, seed) => {
  // To create the magic square we need 2 random orderings of the numbers 0, 1, 2, 3, 4.
  // The following creates those orderings and calls them table5 and table1

  // table5 will use the ones, tens, and hundreds digits.
  const table5 = createRandomisedRange(generateIndicesForRange(sed % 1000))
  // table1 will use the next 3 digits.
  const table1 = createRandomisedRange(generateIndicesForRange(~~(seed / 1000)))
  const remT = calculateRemT(seed)

  x = (--i + remT) % 5
  y = Math.floor(i / 5)

  // The Tables are set into a single magic square template
  // Some are the same up to some rotation, reflection, or row permutation.
  // However, all genuinely different magic squares can arise in this fashion.
  const e5 = table5[(x + 3 * y) % 5]
  const e1 = table1[(3 * x + y) % 5]

  // table5 controls the 5* part and table1 controls the 1* part.
  const baseValue = 5 * e5 + e1

  switch (mode) {
    case 'short':
      return Math.ceil(baseValue / 2)
    case 'long':
    case 'special':
      return Math.ceil((baseValue + 25) / 2)
    default:
      return baseValue + 1
  }
}

const createBingoBoardArray = (mode, seed) =>
  it(25).map(i => ({
    difficulty: calculateDifficulty(i + 1, mode, seed),
  }))

const calculateSynergyForLine = (lineCheckList, index, typesA, bingoBoard) =>
  typesA != null
    ? lineCheckList[index].reduce((synergy, j) => {
        const { types: typesB } = bingoBoard[j] || {}
        if (typesB == null) return synergy
        typesA.forEach((a, k) => {
          typesB.forEach((b, l) => {
            if (a == b) {
              synergy++ // match increased
              if (!k) synergy++ // main type increased
              if (!l) synergy++ // main type increased
            }
          })
        })
        return synergy
      }, 0)
    : 0

/**
 * @param {object} bingoList
 * @param {number} difficulty
 * @returns {number}
 */
const calculateRng = (bingoList, difficulty) =>
  ~~(bingoList[difficulty].length * Math.random())

/**
 * Adds the chosen challenges onto the bingo board.
 * @param {object[]} chosenChallenges The challenges chosen based on the seed
 */
const populateBingoBoardOnPage = chosenChallenges => {
  chosenChallenges.forEach((entry, i) => {
    $(`#slot${i + 1}`).append(entry.name)
    //$(`#slot${i}`).append(`<br/>${entry.types.toString()}`)
    //$(`#slot${i}`).append(`<br/>${entry.synergy}`)
  })
}

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

const ROW_HEADER_IDS = it(5)
  .reduce((acc, i) => acc.concat([`row${i + 1}`, `col${i + 1}`]), [])
  .concat(['tlbr', 'bltr'])

const createPopoutsOnClickRowHeaders = mode => {
  $('.popout').click(function () {
    const line = $(this).attr('id')
    const name = $(this).html()
    const cells = $(`#bingo .${line}`)
    const items = it(5)
      .map(i => encodeURIComponent($(cells[i]).html()))
      .join(';;;')
    if (mode == 'simple-stream') {
      open(
        `./bingo-popout-basic.html#${name}=${items}`,
        '_blank',
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=420, height=180',
      )
    } else {
      open(
        `./bingo-popout.html#${name}=${items}`,
        '_blank',
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=220, height=460',
      )
    }
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

const generateChallenges = (bingoList, lang, mode, seed) => {
  // The board itself stored as an array first
  // Array with objects that store the difficulty in order 0-24
  const bingoBoard = createBingoBoardArray(mode, seed)

  for (i = 0; i < 25; i++) {
    const { difficulty } = bingoBoard[i] // difficulty of current square
    const rng = calculateRng(bingoList, difficulty)
    let j = 0,
      synergy = 0,
      currentObj = null,
      minSynObj = null

    do {
      currentObj =
        bingoList[difficulty][(j + rng) % bingoList[difficulty].length]
      synergy = calculateSynergyForLine(
        LINE_CHECK_LIST,
        i,
        currentObj.types,
        bingoBoard,
      )
      if (minSynObj == null || synergy < minSynObj.synergy) {
        minSynObj = { synergy: synergy, value: currentObj }
      }
      j++
    } while (synergy != 0 && j < bingoList[difficulty].length)

    bingoBoard[i].types = minSynObj.value.types
    bingoBoard[i].name = minSynObj.value[lang] || minSynObj.value.name
    bingoBoard[i].synergy = minSynObj.synergy
  }

  return bingoBoard
}

const addBingoDetailsToPage = (mode, seed) => {
  $('#results').append(
    '<p>SRT Bingo <strong>v1</strong>&emsp;Seed: <strong>' +
      seed +
      '</strong>&emsp;Card type: <strong>' +
      getCardType(mode) +
      '</strong></p>',
  )
}

const bingo = bingoList => {
  const { lang, seed, mode } = parseSearchParams()

  if (isNaN(seed)) return reseedPage(mode)

  Math.seedrandom(seed.toString()) // sets up the RNG. `seed` needs to be a string

  addBingoDetailsToPage(mode, seed)
  createPopoutsOnClickRowHeaders(mode)
  makeSquaresCycleGreenRedBlank()
  ROW_HEADER_IDS.map(addHighlightClassesToBingoRow)
  populateBingoBoardOnPage(generateChallenges(bingoList, lang, mode, seed))

  return true
} // setup

const reseedPage = mode => {
  const qSeed = '?seed=' + ~~(1e6 * Math.random())
  const qMode = isInArray(mode, ['short', 'long']) ? '&mode=' + mode : ''
  location = qSeed + qMode
  return false
}

// Backwards Compatibility
const srl = { bingo }
