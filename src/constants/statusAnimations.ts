/* eslint-disable max-len */
/**
 * The checkmark, exclamation mark and failure animations as HTML strings for dialogs
 */
const statusAnimations = {
    ERROR: `
    <div class="api-dialog__header ">
        <div class="header__description">
            <div style="text-align: center">
                <style>
                    @keyframes checkmark { 0% { stroke-dashoffset: 50px } 100% { stroke-dashoffset: 0 } } 
                    @keyframes checkmark-circle { 0% { stroke-dashoffset: 240px } 100% { stroke-dashoffset: 480px } }
                </style>
                <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                    <g fill="none" stroke="#AE0000" stroke-width="4">
                        <circle cx="36" cy="36" r="34" style="stroke-dasharray: 240px; stroke-dashoffset: 480px; animation: checkmark-circle 0.6s ease-in-out backwards; animation-delay: .8s;"/>
                        <path d="M23.28,48.7L48.72,23.3" style="stroke-dasharray: 50px; stroke-dashoffset: 0; animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"/>
                        <path d="M23.28,23.3L48.72,48.7" style="stroke-dasharray: 50px; stroke-dashoffset: 0; animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"/>
                    </g>
                </svg>
                <div class="chayns-helper__animation-info"/>
            </div>
        </div>
    </div>`,
    WARNING: `
    <div class="api-dialog__header ">
        <div class="header__description">
            <div style="text-align: center">
                <style>
                    @keyframes checkmark { 0% { stroke-dashoffset: 50px } 100% { stroke-dashoffset: 0 } } 
                    @keyframes checkmark-circle { 0% { stroke-dashoffset: 240px } 100% { stroke-dashoffset: 480px } }
                </style>
                <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                    <g fill="none" stroke="#ff6400" stroke-width="3">
                        <circle cx="36" cy="36" r="34" style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px; animation: checkmark-circle 0.6s ease-in-out backwards; animation-delay: .8s;"></circle>
                        <path className="path_1" d="M35.5,49.5l0-38.2" style="stroke-dasharray:50px, 50px; stroke-dashoffset: -5px; animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"></path>
                        <path className="path_2" d="M35.5,56.6l0-6.7" style="stroke-dasharray:50px, 50px; stroke-dashoffset: 0px;  animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"></path>
                    </g>
                </svg>
                <div class="chayns-helper__animation-info"/>
            </div>
        </div>
    </div>`,
    SUCCESS: `
    <div class="api-dialog__header ">
        <div class="header__description">
            <div style="text-align: center">
                <style>
                    @keyframes checkmark { 0% { stroke-dashoffset: 50px } 100% { stroke-dashoffset: 0 } } 
                    @keyframes checkmark-circle { 0% { stroke-dashoffset: 240px } 100% { stroke-dashoffset: 480px } }
                </style>
                <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                    <g fill="none" stroke="#04ae00" stroke-width="3">
                    <circle cx="36" cy="36" r="34" style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px; animation: checkmark-circle 0.6s ease-in-out backwards; animation-delay: .8s;"></circle>
                    <path d="M17.417,37.778l9.93,9.909l25.444-25.393" style="stroke-dasharray:50px, 50px; stroke-dashoffset: 0px; animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"></path>
                    </g>
                </svg>
                <div class="chayns-helper__animation-info"/>
            </div>
        </div>
    </div>`
};

export default statusAnimations;
