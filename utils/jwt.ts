import { sign, verify } from 'jsonwebtoken';

 const generateToken = async (payload:any, expiresIn="1d") => {
    try {
        const token = sign(payload, process.env.JWT_SECRET!, { 
            expiresIn: expiresIn,
          });
        return token
    } catch (error) {
        console.error(error)
    }
     
};

 const verifyToken = async (token: any) => {
    try {
        return verify(token, process.env.JWT_SECRET!)
    } catch (error: any) {
        console.error(error.message)
        return null;
    }
}

export { generateToken, verifyToken };
