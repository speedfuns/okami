const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
  input: fs.createReadStream('./bingo-goals.csv'),
})

const data = []

const parseInput = line => {
  const [index, name, ...types] = line.split(',')
  return {
    index: parseInt(index, 10),
    name,
    types,
  }
}

const addDatum = ({ index, name, types }) => {
  if (data[index]) {
    data[index].push({
      name,
      types,
    })
  } else {
    data[index] = [
      {
        name,
        types,
      },
    ]
  }
}

rl.on('line', input => addDatum(parseInput(input)))

const appendBingoCall = stringifiedData => `${stringifiedData}\n\n$(function() { srl.bingo(bingoList, 5) })`
const stringifyData = data =>
  `const bingoList = [\n${data.map(stringifyRow).join('\n')}\n]`
const stringifyRow = data => `  [\n${data.map(stringifyDatum).join('\n')}\n  ],`
const stringifyDatum = ({ name, types }) =>
  `    { name: "${name}", types: [${types.map(type => `"${type}"`).join(', ')}] },`

rl.on('close', () => {
  fs.writeFile('./tables/generic.js', appendBingoCall(stringifyData(data)), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Done')
  })
})
