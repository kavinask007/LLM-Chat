"use client"
import React, { useState, useEffect } from 'react';
import Recorder from '../../lib/recorder'
export const AudioRecorder = () => {
  const [audioURL, setAudioURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [media, setMedia] = useState({
    tag: 'audio',
    type: 'audio/wav',
    ext: '.wav',
    gUM: { audio: true }
  });
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  console.log(window.Recorder)
  useEffect(() => {
    navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
      setStream(_stream);
      const audioContext = new AudioContext();
      const input = audioContext.createMediaStreamSource(_stream);
      const _recorder = new Recorder(input, {
        numChannels: 1
      });
      _recorder.ondataavailable = e => {
        setChunks(chunks => [...chunks, e.data]);
      };
      setRecorder(_recorder);
    });
  }, []);

  const startRecording = async () => {
    console.log("dafsdfas")
    setRecording(true);
    recorder.clear();
    setChunks([]);
    recorder.record();
  };

  const stopRecording = async () => {
    setRecording(false);
    recorder.stop();
    await recorder.getBuffer(async (e) => await createDownloadLink(exportWAV(e[0], 16000, "audio/wav")));
  };

  const createDownloadLink = async (blob) => {
    var url = URL.createObjectURL(blob);
    console.log(url);
    await transcribe_fn(url);
  };

  const exportWAV = (buffer, rate, type) => {
    var downsampledBuffer = downsampleBuffer(buffer, rate);
    var dataview = encodeWAV(rate, downsampledBuffer);
    var audioBlob = new Blob([dataview], {
      type: type
    });
    return audioBlob;
  }

  const downsampleBuffer = (buffer, rate) => {
    var sampleRate = recorder.context.sampleRate;
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
      var accum = 0, count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  const encodeWAV = (rate, samples) => {
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);
    var numChannels = 1
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, rate, true);
    view.setUint32(28, rate * 4, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    floatTo16BitPCM(view, 44, samples);
    return view;
  }

  const writeString = (view, offset, string) => {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const floatTo16BitPCM = (output, offset, input) => {
    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  const transcribe_fn = async (audiourl) => {
    // your transcribe function here
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
      <ul id="ul"></ul>
    </div>
  );
};

export default AudioRecorder;
