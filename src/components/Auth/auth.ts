interface DecodedToken {
    exp?: number;
    [key: string]: any;
}

export function checkTokenValidity(): boolean {
    const token = localStorage.getItem('authToken');
    let errMsg = 'Redirecting to login'
    if (!token) {
        errMsg += ' Token does not exist';
        console.error(errMsg);
        return false;
    }
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) {
        errMsg += ' Token expired / invalid';
        console.error(errMsg);
        return false; // Token is invalid or doesn't contain expiration time
    }
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    return currentTime < expirationTime; // Token is valid if current time is less than expiration time
}

function parseJwt(token: string): DecodedToken | null {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}
