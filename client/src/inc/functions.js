const createServerUrl = (routes, endpoints = "") => {
    return process.env.REACT_APP_SERVER_URL + routes + endpoints;
}

export default createServerUrl;