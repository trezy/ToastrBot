// Module imports
import toHex from 'colornames'





export default name => parseInt(toHex(name).replace(/^#/, '0x'))
