
const asyncHandler =  (func) => async (req,res,next)=>{
    try {
        return await func(req,res,next)
    } catch (error) {
        return res.status(500 || error.code).json(
            {
                message : error.message,
                success:false
            }
        )
    }
}

export {asyncHandler}
