import jwt from "jsonwebtoken";

export const genToken = async (id,userName,email) => {
    return await jwt.sign({id, userName , email},process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
}