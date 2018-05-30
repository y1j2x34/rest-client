function getUserInfo(params){
    if(params.queries.type === 'xml') {
        return {
            contentType: 'application/xml',
            body: new Buffer(`
            <user id="0">
                <nickname>Mario</nickname>
            </user>
            `, 'utf8')
        };
    } else {
        return {
            contentType: 'application/json',
            body: {
                id: 0,
                nickname: 'Mario'
            }
        };
    }
}
