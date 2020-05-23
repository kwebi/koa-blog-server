## url: /register
### method: POST
request body{
    username:string
    password:string
}
response{
    code:number
    errMsg:string
    data{
        username:string
        role:number
        userId:number
    }
}

## url: /login
### method:POST 
request body {
    username:string
    password:string
}
response{
    code:number
    errMsg:string
    data{
        username:string
        role:number
        userId:number
        token:string
    }
}

## url: /article
### method: GET
request query{
    limited:number
    offset:number
}
/:id
### method: POST
request params{
    id:number
}
### method: DELETE
request params{
    id:number
}
