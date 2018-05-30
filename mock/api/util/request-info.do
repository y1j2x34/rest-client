function getRequestInfo(params){
    return {
        status: 200,
        body: {
            queries: params.queries,
            headers: params.headers,
            path: params.path,
            method: params.method
        }
    };
}
