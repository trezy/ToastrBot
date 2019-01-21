import { spy } from 'sinon'





const firebaseRef = function () {
  return () => ({
    child: firebaseRef(),
    on: spy(() => {}),
    set: spy(() => {}),
  })
}





export default firebaseRef
