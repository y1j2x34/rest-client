function getRequestInfo(params){
    return {
        queries: params.queries,
        headers: params.headers,
        path: params.path,
        method: params.method
    };
}
