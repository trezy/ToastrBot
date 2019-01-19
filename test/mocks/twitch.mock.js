// Module imports
import { spy } from 'sinon'





const twitch = function () {
  return {
    on: spy(() => {}),
    mods: spy(() => ['Bob', 'Jerry', 'Mac', 'Eleanor', 'Jessica', 'Margaret']),
  }
}





export default twitch
