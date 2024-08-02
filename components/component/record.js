"use client";

import { useRecordVoice } from "@/components/component/attempt";
// import { IconMicrophone } from "@/app/components/IconMicrophone";
import { useState } from "react"
const Microphone = () => {
    const [url, setUrl] = useState(null);

    const { startRecording, stopRecording } = useRecordVoice(setUrl);
    console.log(url)
    return (
        // Button for starting and stopping voice recording
        <><button
            onClick={startRecording}    // Start recording when mouse is pressed       // Stop recording when touch ends on a touch device
            className="border-none bg-transparent w-10"
        >
            {/* Microphone icon component */}
            start

        </button>
            <button onClick={stopRecording}>stop</button>
            {url && <a href={url} download="recording.wav">Download Recording</a>}</>
    );
};

export { Microphone };