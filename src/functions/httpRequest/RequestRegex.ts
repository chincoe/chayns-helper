const RequestRegex = {
    StatusCode: {
        Any: /^\d{1,3}$/,
        Status4xx: /^4\d{2}$/,
        Status5xx: /^5\d{2}$/,
        Status4xxOr5xx: /^[45]\d{2}$/,
        AnyError: /^[45]\d{2}|1$/,
        Status2xx: /^2\d{2}$/
    },
    ChaynsError: {
        Any: /^[a-zA-Z0-9_]+\/[a-zA-Z0-9/_]+$/,
        AnyGlobal: /^global\/[a-zA-Z0-9/_]+$/,
        createNamespaceRegex: (namespace: string): RegExp => new RegExp(`^${namespace}\\/[a-zA-Z0-9/_]+$`)
    },
    Any: /^.*$/
};

export default RequestRegex;
