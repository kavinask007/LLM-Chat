import { useEffect, useState, useRef } from "react";

export const useRecordVoice = (onRecordingFinished) => {
    // State to hold the media recorder instance
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioContext, setAudioContext] = useState(null);
    // State to track whether recording is currently in progress
    const [recording, setRecording] = useState(false);
    const [stream_, setStream] = useState(null)
    // Function to start the recording
    const startRecording = () => {
        if (typeof window !== "undefined") {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(initialMediaRecorder);
        }
        // console.log(mediaRecorder)
        // if (mediaRecorder) {
        //     mediaRecorder.clear();
        //     mediaRecorder.record();
        //     setRecording(true);
        // }
    };

    // Function to stop the recording
    const stopRecording = async () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.getBuffer(async (e) => {
                console.log(mediaRecorder.context.sampleRate);
                const audioBlob = exportWAV(e[0], 16000, "audio/wav", mediaRecorder.context.sampleRate);
                const url = await createDownloadLink(audioBlob);
                onRecordingFinished(url);
                // Call the callback with the URL
                setRecording(false)
                if (audioContext) {
                    audioContext.close()
                }
            })
            stream_.getTracks().forEach(track => track.stop());
            ;
            // mediaRecorder.destroy();
        }
    };

    // Function to initialize the media recorder with the provided stream
    const initialMediaRecorder = (stream) => {
        setStream(stream);
        var audioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext = new AudioContext;
        let input = audioContext.createMediaStreamSource(stream)
        // const mediaRecorder = new MediaRecorder(stream);
        setAudioContext(audioContext);
        var recorder = new window.Recorder(input, {
            numChannels: 1,
        });
        recorder.clear()
        recorder.record();
        recorder.ondataavailable = (e) => {
            console.log("data available");
            chunks.current.push(e.data);
        };

        setMediaRecorder(recorder);
        setRecording(true);
    };
    return {
        recording, startRecording, stopRecording
    };
};



function exportWAV(buffer, rate, type, context_sample_rate) {
    // var bufferL = mergeBuffers(recBuffersL, recLength);
    // var bufferR = mergeBuffers(recBuffersR, recLength);
    // var interleaved = interleave(bufferL, bufferR);
    var downsampledBuffer = downsampleBuffer(buffer, rate, context_sample_rate);
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
function downsampleBuffer(buffer, rate, context_sample_rate) {
    var sampleRate = context_sample_rate;
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
const createDownloadLink = async (blob) => {
    if (blob != undefined) {
        var url = URL.createObjectURL(blob);
        return url
    }
};