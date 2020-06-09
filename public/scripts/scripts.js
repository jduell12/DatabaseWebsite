function httpRequest(method, route, data){
    return new Promise(function(resolve, reject){
        let req = new XMLHttpRequest();
        req.open(method, route, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));
        event.preventDefault();
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                resolve(req);
            }else {
                reject(req);
            }
        })
    })
}