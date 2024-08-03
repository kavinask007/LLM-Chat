//load the candle Whisper decoder wasm module
import init, { Decoder } from "./whishper-build/build/m.js";

async function fetchWithProgress(url, onProgress) {

  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentLength = response.headers.get('content-length');
  if (!contentLength) {
    throw new Error('Content-Length response header unavailable');
  }

  const total = parseInt(contentLength, 10);
  let loaded = 0;

  const reader = response.body.getReader();
  const stream = new ReadableStream({
    start(controller) {
      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          loaded += value.length;
          onProgress(loaded / total);
          controller.enqueue(value);
          read();
        }).catch(error => {
          console.error('Read error', error);
          controller.error(error);
        });
      }
      read();
    }
  });

  const newResponse = new Response(stream, {
    headers: response.headers
  });

  return newResponse;
}
async function fetchArrayBuffer(url) {
  const cacheName = "whisper-candle-cache";
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(url);
  if (cachedResponse) {
    const data = await cachedResponse.arrayBuffer();
    return new Uint8Array(data);
  }
  self.postMessage({ status: "loading", message: `Downloading ${url}` })
  // const res = await fetchWithProgress(url, progress => self.postMessage({ status: "loading", message: `Progress: ${(progress * 100).toFixed(2)}%` }));
  const res = await fetchWithProgress(url, progress => { });
  cache.put(url, res.clone());
  return new Uint8Array(await res.arrayBuffer());
}
class Whisper {
  static instance = {};
  // Retrieve the Whisper model. When called for the first time,
  // this will load the model and save it for future use.
  static async getInstance(params) {
    const {
      weightsURL,
      modelID,
      tokenizerURL,
      mel_filtersURL,
      configURL,
      quantized,
      is_multilingual,
      timestamps,
      task,
      language,
    } = params;
    // load individual modelID only once
    if (!this.instance[modelID]) {
      await init();

      self.postMessage({ status: "loading", message: "Loading Model" });
      const [
        weightsArrayU8,
        tokenizerArrayU8,
        mel_filtersArrayU8,
        configArrayU8,
      ] = await Promise.all([
        fetchArrayBuffer(weightsURL),
        fetchArrayBuffer(tokenizerURL),
        fetchArrayBuffer(mel_filtersURL),
        fetchArrayBuffer(configURL),
      ]);

      this.instance[modelID] = new Decoder(
        weightsArrayU8,
        tokenizerArrayU8,
        mel_filtersArrayU8,
        configArrayU8,
        quantized,
        is_multilingual,
        timestamps,
        task,
        language
      );
    } else {
      self.postMessage({ status: "loading", message: "Model Already Loaded" });
    }
    return this.instance[modelID];
  }
}

self.addEventListener("message", async (event) => {
  const {
    weightsURL,
    modelID,
    tokenizerURL,
    configURL,
    mel_filtersURL,
    audioURL,
  } = event.data;
  try {
    self.postMessage({ status: "decoding", message: "Starting Decoder" });
    let quantized = false;
    if (modelID.includes("quantized")) {
      quantized = true;
    }
    let is_multilingual = false;
    if (modelID.includes("multilingual")) {
      is_multilingual = true;
    }
    let timestamps = true;
    const decoder = await Whisper.getInstance({
      weightsURL,
      modelID,
      tokenizerURL,
      mel_filtersURL,
      configURL,
      quantized,
      is_multilingual,
      timestamps,
      task: null,
      language: null,
    });

    self.postMessage({ status: "decoding", message: "Loading Audio" });
    const audioArrayU8 = await fetchArrayBuffer(audioURL);

    self.postMessage({ status: "decoding", message: "Running Decoder..." });
    const segments = decoder.decode(audioArrayU8);

    // Send the segment back to the main thread as JSON
    self.postMessage({
      status: "complete",
      message: "complete",
      output: JSON.parse(segments),
    });
  } catch (e) {
    console.log(e)
    self.postMessage({ error: e });
  }
});
