// base url for audio examples
const AUDIO_BASE_URL =
  "https://huggingface.co/datasets/Narsil/candle-examples/resolve/main/";

// models base url
const MODELS = {
  tiny_multilingual: {
    base_url: "https://huggingface.co/openai/whisper-tiny/resolve/main/",
    model: "model.safetensors",
    tokenizer: "tokenizer.json",
    config: "config.json",
    size: "151 MB",
  },
  tiny_en: {
    base_url:
      "https://huggingface.co/openai/whisper-tiny.en/resolve/main/",
    model: "model.safetensors",
    tokenizer: "tokenizer.json",
    config: "config.json",
    size: "151 MB",
  },
  tiny_quantized_multilingual_q80: {
    base_url: "https://huggingface.co/lmz/candle-whisper/resolve/main/",
    model: "model-tiny-q80.gguf",
    tokenizer: "tokenizer-tiny.json",
    config: "config-tiny.json",
    size: "41.5 MB",
  },
  tiny_en_quantized_q80: {
    base_url: "https://huggingface.co/lmz/candle-whisper/resolve/main/",
    model: "model-tiny-q80.gguf",
    tokenizer: "tokenizer-tiny-en.json",
    config: "config-tiny-en.json",
    size: "41.8 MB",
  },
  distil_medium_en: {
    base_url:
      "https://huggingface.co/distil-whisper/distil-medium.en/resolve/main/",
    model: "model.safetensors",
    tokenizer: "tokenizer.json",
    config: "config.json",
    size: "789 MB",
  },
};

const modelEl = document.querySelector("#model");

Object.keys(MODELS).forEach((modelID) => {
  const model = MODELS[modelID];
  const option = document.createElement("option");
  option.value = modelID;
  option.textContent = `${modelID} (${model.size})`;
  modelEl.appendChild(option);
});
const whisperWorker = new Worker("./whisperWorker.js", {
  type: "module",
});

async function classifyAudio(
  weightsURL, // URL to the weights file
  modelID, // model ID
  tokenizerURL, // URL to the tokenizer file
  configURL, // model config URL
  mel_filtersURL, // URL to the mel filters file
  audioURL, // URL to the audio file
  updateStatus // function to update the status
) {
  console.log({
    weightsURL,
    modelID,
    tokenizerURL,
    configURL,
    mel_filtersURL,
    audioURL,
  })
  var obj = {
    weightsURL,
    modelID,
    tokenizerURL,
    configURL,
    mel_filtersURL,
    audioURL,
  }
  console.log(obj);
  return new Promise((resolve, reject) => {
    whisperWorker.postMessage(obj);
    function messageHandler(event) {
      console.log(event.data);
      if ("status" in event.data) {
        updateStatus(event.data);
      }
      if ("error" in event.data) {
        whisperWorker.removeEventListener("message", messageHandler);
        reject(new Error(event.data.error));
      }
      if (event.data.status === "complete") {
        whisperWorker.removeEventListener("message", messageHandler);
        resolve(event.data);
      }
    }
    whisperWorker.addEventListener("message", messageHandler);
  });
}

// keep track of the audio URL
let audioURL = null;
function setAudio(src) {
  const audio = document.querySelector("#audio");
  audio.src = src;
  audio.controls = true;
  audio.hidden = false;
  document.querySelector("#detect").disabled = false;
  audioURL = src;
}
// add event listener to audio buttons
document.querySelectorAll("#audios-select > button").forEach((target) => {
  target.addEventListener("click", (e) => {
    const value = target.dataset.value;
    const href = AUDIO_BASE_URL + value;
    setAudio(href);
  });
});

// add event listener to detect button
const transcribe_fn = async (audiourl) => {
  console.log(audiourl);
  if (audiourl === null) {
    return;
  }
  const modelID = modelEl.value;
  const model = MODELS[modelID];
  const modelURL = model.base_url + model.model;
  const tokenizerURL = model.base_url + model.tokenizer;
  const configURL = model.base_url + model.config;

  classifyAudio(
    modelURL,
    modelID,
    tokenizerURL,
    configURL,
    "mel_filters.safetensors",
    audiourl,
    updateStatus
  )
    .then((result) => {
      console.log("RESULT", result);
      const { output } = result;
      const text = output.map((segment) => segment.dr.text).join(" ");
      console.log(text);
      document.querySelector("#output-status").hidden = true;
      document.querySelector("#output-generation").hidden = false;
      document.querySelector("#output-generation").textContent = text;
    })
    .catch((error) => {
      console.error(error);
    });
}
// document.querySelector("#detect").addEventListener("click", transcribe_fn);

function updateStatus(data) {
  const { status, message } = data;
  console.log(status);
}

let id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stop = id('stop');
let stream, recorder, counter = 1, chunks, media;
media = {
  tag: 'audio',
  type: 'audio/wav',
  ext: '.wav',
  gUM: { audio: true }
};

window.onload=()=>{
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {}
  else{console.log("no media devices")}
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
  stream = _stream;

  start.removeAttribute('disabled');
  //     recorder = new RecordRTC(mediaStream, {
  //     type: 'audio',
  //     recorderType: RecordRTC.StereoAudioRecorder, // force for all browsers
  //     numberOfAudioChannels: 2
  // });
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext;
  let input = audioContext.createMediaStreamSource(stream);
  /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
  recorder = new Recorder(input, {
    numChannels: 1,
  })
  // recorder = new MediaRecorder(stream,{mimeType:"audio/webm"});
  recorder.ondataavailable = e => {
    chunks.push(e.data);

  };
  // recorder.onstop = function() {
  //   rec.exportWAV(createDownloadLink);
  //   makeLink();
  // }
}).catch("test");
};


start.onclick = async (e) => {
  if (start.classList.contains("fa-fade")) {
    start.classList.remove("fa-fade");
    recorder.stop();
    await recorder.getBuffer(async (e) => await createDownloadLink(exportWAV(e[0], 16000, "audio/wav"))); 1

  } else {
    start.classList.add("fa-fade");
    recorder.clear();
    start.disabled = true;
    chunks = [];
    recorder.record();
  }

}

// stop.onclick = async()=> {
// stop.disabled = true;
// recorder.stop();
// recorder.getBuffer(e=>createDownloadLink(exportWAV(e[0],16000,"audio/wav")))
// // recorder.exportWAV(createDownloadLink);
// start.removeAttribute('disabled');
// }
function exportWAV(buffer, rate, type) {
  // var bufferL = mergeBuffers(recBuffersL, recLength);
  // var bufferR = mergeBuffers(recBuffersR, recLength);
  // var interleaved = interleave(bufferL, bufferR);
  var downsampledBuffer = downsampleBuffer(buffer, rate);
  var dataview = encodeWAV(rate, downsampledBuffer);
  var audioBlob = new Blob([dataview], {
    type: type
  });

  return audioBlob;

}

function writeString(view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
function floatTo16BitPCM(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}
function encodeWAV(rate, samples) {
  var buffer = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buffer);
  var numChannels = 1
  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, rate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, rate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}
function downsampleBuffer(buffer, rate,) {
  var sampleRate = recorder.context.sampleRate;
  console.log(sampleRate)
  if (rate == sampleRate) {
    return buffer;
  }
  if (rate > sampleRate) {
    throw "downsampling rate show be smaller than original sample rate";
  }
  var sampleRateRatio = sampleRate / rate;
  var newLength = Math.round(buffer.length / sampleRateRatio);
  var result = new Float32Array(newLength);
  var offsetResult = 0;
  var offsetBuffer = 0;
  while (offsetResult < result.length) {
    var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    // Use average value of skipped samples
    var accum = 0, count = 0;
    for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    // Or you can simply get rid of the skipped samples:
    // result[offsetResult] = buffer[nextOffsetBuffer];
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}
async function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var li = document.createElement('li');
  var link = document.createElement('a');
  //add controls to the <audio> element 
  au.controls = true;
  au.src = url;
  au.id = "audio"
  audioURL = url;
  //link the a element to the blob 
  link.href = url;
  link.download = new Date().toISOString() + '.wav';
  link.innerHTML = link.download;
  //add the new audio and a elements to the li element 
  li.appendChild(au);
  li.appendChild(link);
  //add the li element to the ordered list 
  ul.appendChild(li);
  // document.querySelector("#detect").disabled = false;
  await transcribe_fn(audioURL);
}


function makeLink() {
  let blob = new Blob(chunks, { type: media.type })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
    ;
  mt.controls = true;
  mt.src = url;
  console.log(url);
  console.log(`${counter}${media.ext}`)
  mt.id = "audio"
  hf.href = url;
  hf.download = `${counter}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;
  li.appendChild(mt);
  li.appendChild(hf);
  ul.appendChild(li);
  audioURL = `${counter}${media.ext}`;
}