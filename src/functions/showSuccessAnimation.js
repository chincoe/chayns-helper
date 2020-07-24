/**
 * Show a dialog with the success animation
 * @return {Promise<boolean>}
 */
const showSuccessAnimation = () => chayns.dialog.confirm('', `<div style="text-align: center">  
                            <style>  
                                @keyframes checkmark { 0% { stroke-dashoffset: 50px } 100% { stroke-dashoffset: 0 } }   
                                @keyframes checkmark-circle { 0% { stroke-dashoffset: 240px } 100% { stroke-dashoffset: 480px } }  
                            </style>  
                                <svg  
                                    xmlns="http://www.w3.org/2000/svg"  
                                    width="72px"  
                                    height="72px"  
                                >  
                                    <g  
                                        fill="none"  
                                        stroke="#04ae00"  
                                        stroke-width="3"  
                                    >  
                                    <circle  
                                        cx="36"  
                                        cy="36"  
                                        r="34" 
                                        style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px;  
                                        animation: checkmark-circle 0.6s ease-in-out backwards; animation-delay: .8s;"  
                                    />  
                                        <path  
                                            d="M17.417,37.778l9.93,9.909l25.444-25.393" 
                                            style="stroke-dasharray:50px, 50px; stroke-dashoffset: 0px;  
                                            animation: checkmark 0.25s ease-in-out 0.7s backwards; animation-delay: .8s;"  
                                        />  
                                    </g>  
                                </svg>  
                                <p/>  
                            </div>`, []);

export default showSuccessAnimation;
