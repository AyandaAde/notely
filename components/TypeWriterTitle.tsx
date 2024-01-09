"use client";

import Typewriter from "typewriter-effect";

type Props = {}

const TypeWriterTitle = (props: Props) => {
    return (
        <Typewriter
            options={{
                loop: true,
            }}
            onInit={(typewriter) => {
                typewriter.typeString("Supercharged Productivity.")
                    .pauseFor(100).deleteAll()
                    .typeString("AI-Powered Insights.")
                    .start()
            }}
        >

        </Typewriter>
    )
}

export default TypeWriterTitle