const showFailureAnimation = () => chayns.dialog.alert('', `
                            <div style="text-align: center">
                            <style>
                                @keyframes checkmark {
                                    0% {
                                        stroke-dashoffset: 50px
                                    }
                                    100% {
                                        stroke-dashoffset: 0
                                    }
                                }
                            
                                @keyframes checkmark-circle {
                                    0% {
                                        stroke-dashoffset: 240px
                                    }
                                    100% {
                                        stroke-dashoffset: 480px
                                    }
                                }
                            </style>
                            <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                                <g fill="none" stroke="#AE0000" stroke-width="3">
                                    <circle
                                            cx="36"
                                            cy="36"
                                            r="34"
                                            style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px; 
                            animation: checkmark-circle 0.6s ease-in-out backwards; animation-delay: .8s;"/>
                                    <path d="M23.28,48.7L48.72,23.3"
                                          style=" stroke-dasharray: 50px, 50px; animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"
                                          transform="translate(0 0)"/>
                                    <path d="M23.28,23.3L48.72,48.7"
                                          style=" stroke-dasharray: 50px, 50px; animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"
                                          transform="translate(0 0)"/>
                                </g>
                            </svg>
                            </div>`);

export default showFailureAnimation;
