import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {

    try {

        // Get token from Authorization header
        const authHeader = req.headers.authorization;


        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided"
            });
        }


        // Expected format:
        // Authorization: Bearer token_here

        const token = authHeader.split(" ")[1];
        console.log(token, "token")


        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }



        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_SECRET
        );


        // Attach user data to request
        req.user = decoded;


        // Continue to controller
        next();


    } catch (error) {

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                message: "Access token expired"
            });

        }


        return res.status(401).json({
            message: "Invalid access token"
        });

    }

};


export default authMiddleware;