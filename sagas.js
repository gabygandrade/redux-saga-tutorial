import { delay } from 'redux-saga'
import { put, takeEvery, all, call } from 'redux-saga/effects';

export function* helloSaga() {
    console.log("hello sagas!");
}

// Our *WORKER* Saga: will perform the async increment task
export function* incrementAsync() {
    yield call(delay, 1000);
    yield put({ type: 'INCREMENT' })
}

// Our *WATCHER* Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
function* watchIncrementAsync() {
    // takeEvery is a helper (from redux-saga) - helps us listen for dispatched INCREMENT_ASYNC actions & run incrementAsync each time
    yield takeEvery('INCREMENT_SYNC', incrementAsync)
}

// export the rootSaga - our single entry point to start all Sagas at once
export default function* rootSaga() {
    yield all([
        helloSaga(),
        watchIncrementAsync()
    ])
}


/*
delay - a utility fn that returns a Promise that will resolve after a specified # of milliseconds
    - we use this fn to "block" the generator

Sagas are implementated as Generator fns that *yield* objects to the redux-saga middleware
    - the yielded objects are a kind of instruction to be interpreted by the middleware 
    - when a Promise is yielded to the middleware, the middleware will suspend the Saga until the Promise completes
    - in the example above, the -incrementAsync- Saga is suspended until the Promise returned by -delay- resolves, which happens after 1 second
    - once the promise is resolved, the middleware will resume the Saga, executing code until the next yield
    - in this ex, the next statement is another yielded object: the resolt of calling put({type: 'INCREMENT'}), which instructs the middleware to dispatch an INCREMENT action

-Put- is one ex. of what we call an -Effect- ie. simple JS objects which contain instructions to be fulfilled by the middleware
    - when a middleware retrieves an Effect yielded by a Saga, the Saga is paused until the Effect is fulfilled

To summarize, the incrementAsync Saga sleeps for 1 second via the call to delay(1000), then dispatches an INCREMENT action

More explanation: https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html
*/