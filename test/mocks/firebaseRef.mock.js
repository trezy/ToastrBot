import { spy } from 'sinon'





const firebaseRef = function () {
  return () => ({
    child: firebaseRef(),
    on: spy(() => {}),
  })
}





export default firebaseRef
