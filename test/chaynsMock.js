module.exports = {
    env: {
        user: {
            isAuthenticated: false,
            tobitAccessToken: "",
        },
        language: 'de',
        site: {
            color: "#6E6E6E",
            tapp: {
                id: 0
            }
        },
        parameters: {

        }
    },
    dialog: {
        select: (options) => new Promise(res => {res({ buttonType: -1 })}),
        iFrame: (options) => new Promise(res => {res({ buttonType: -1 })}),
        alert: (options) => new Promise(res => {res({ buttonType: -1 })})
    },
    utils: {
        isObject: (val) => Object.prototype.toString.call(val) === '[object Object]'
    },
    register(){},
    showWaitCursor(){},
    hideWaitCursor(){},
}
