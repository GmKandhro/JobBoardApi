class ApiResponse {
    constructor(
        statusCode,
        message="Success",
        data
    ){
        this.message = message
        this.statusCode = statusCode < 400
        this.data = data
    }
}

export {ApiResponse}