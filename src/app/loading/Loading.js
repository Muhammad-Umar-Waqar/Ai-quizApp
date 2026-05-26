import React from 'react'
import './style.css'
function Loading() {
    return (
        <div className="h-full w-full grid place-items-center">
        <div id="loader">
            <div id="box"></div>
            <div id="hill"></div>
        </div>
        </div>
    )
}

export default Loading