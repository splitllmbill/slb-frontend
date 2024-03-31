const setHeaders = (headers: Headers): boolean => {
    const token = localStorage.getItem('authToken');
    if(token){
        headers.set('Authorization', `Bearer ${token}`);
    }
    else{
        localStorage.clear();
        alert('No token available');
        window.location.href = '/login';
        return false;
    }
    return true
};

const fetchInterceptor = async (url: string, type: string, jsonBody: boolean, body: any = null): Promise<Response> => {
    const headers: Headers = new Headers();
    const valid = setHeaders(headers);
    if(!valid){
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
    }
    if(jsonBody)
        headers.set('Content-Type','application/json');

    const response: Response = await fetch(url, {
        method: type,
        headers: headers,
        body: body
    });
    if (response.status === 401) {
        localStorage.clear();
        alert('Unauthorized');
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
    }

    return response;
};

export default fetchInterceptor;