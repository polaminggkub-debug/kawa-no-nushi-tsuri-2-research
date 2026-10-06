/** Ask the finder worker to work out one tackle setup; resolves with the stored-record shape. */
export function runInWorker(tables, setup) {
  return new Promise((resolve, reject) => {
    if (typeof Worker === 'undefined') {
      reject(new Error('Web Workers are not available'))
      return
    }
    const worker = new Worker('fight-sim-worker.js?v=__FIGHT_WORKER_VERSION__')
    worker.onmessage = (event) => {
      worker.terminate()
      resolve(event.data)
    }
    worker.onerror = (event) => {
      worker.terminate()
      reject(new Error(event.message))
    }
    worker.postMessage({ tables, setup })
  })
}
