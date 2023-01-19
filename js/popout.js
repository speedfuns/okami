/**
 * This file houses the code to create the popouts for the bingo board.
 * On clicking the headers of a row (the ones that say e.g. "ROW1"), a popout will
 * appear, containing only the challenges listed for that row.
 * The challenge cells themselves still work like they do in the main page; you can
 * cycle through its Done, Failed, and Default stages by clicking on them.
 *
 * Example use:
 * ```js
 * $('.popout').click(function() {
 *    openPopout(getPopoutOptions($(this)[, 'simple-stream']))
 * })
 * ```
 */

/// Typedefs
/**
 * Options to be passed into `openPopout`.
 * @see openPopout
 * @typedef {Object} PopoutOptions
 * @property {string} html The HTML file to load for this popout
 * @property {string} name The name of the row header. E.g. "ROW1"
 * @property {string} items The descriptions of the challenges in the chosen row joined
 *                          together in a single string and separated by ";;;". Don't
 *                          ask me why; I'm just refactoring this for funsies
 * @property {number} width The width of the popout
 * @property {number} height The height of the popout
 */
///

/**
 * Takes the descriptions of all entries on the row that the user wants to create a
 * popout of and joins them to a single string. This will be a part of the popout's URL.
 * @param {string} rowId  The ID of the row header, e.g. "row1". This is also a class
 *                        name of the corresponding items.
 * @returns {string}
 */
const stringifyRowForPopout = rowId =>
  Array.from($(`#bingo .${rowId}`))
    .map(el => encodeURIComponent($(el).html()))
    .join(';;;')

const popoutStaticDefaultOpts = {
  html: './bingo-popout.html',
  width: 220,
  height: 460,
}

/**
 * Options for the popout based on the current bingo's mode, used to set the popout's
 * markup and dimensions. Currently holds a single 'simple-stream' option, and it's also
 * not actually used.
 */
const popoutStaticOpts = {
  'simple-stream': {
    html: './bingo-popout-basic.html',
    width: 420,
    height: 180,
  },
}

/**
 * Gets all options to be passed into `openPopout`.
 * There are two kinds of options:
 * - **Dynamic** options are taken from the row header's jQuery wrapper. The header's
 * name and ID are used in the popout's URL.
 * - **Static** options are taken from the current bingo's mode. These are used to set
 * the popout's markup and dimensions.
 * @see openPopout
 * @see popoutStaticDefaultOpts
 * @see popoutStaticOpts
 * @see stringifyRowForPopout
 * @param {Object} rowHeaderEl This needs to be a jQuery wrapper
 * @param {string | null} mode Used as a key to `popoutStaticOpts`. Currently unused.
 * @returns {PopoutOptions}
 */
export const getPopoutOptions = (rowHeaderEl, mode = null) => ({
  name: rowHeaderEl.html(),
  items: stringifyRowForPopout(rowHeaderEl.attr('id')),
  ...(popoutStaticOpts[mode] || popoutStaticDefaultOpts),
})

/**
 * Opens a popout of a single row from the bingo board.
 * @param {PopoutOptions} opts
 */
 export const openPopout = opts => {
  open(
    `${opts.html}#${opts.name}=${opts.items}`,
    '_blank',
    // A ton of these options default to "no" or don't exist in the MDN docs. I'm not sure if the same defaults are true in other browsers too; can't care about that right now.
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${opts.width}, height=${opts.height}`,
  )
}
