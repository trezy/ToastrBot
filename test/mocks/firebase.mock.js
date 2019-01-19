// Module imports
import { spy } from 'sinon'





// Local imports
import firebaseRefMock from './firebaseRef.mock'





const firebase = function () {
  return {
    database: spy(() => ({
      ref: spy(firebaseRefMock()),
    })),
  }
}





export default firebase
