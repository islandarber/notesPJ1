import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const secretToken = process.env.secretToken;

    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if(!authHeader){
     return res.sendStatus(401)
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, secretToken, (err, user) => {
     if(err){
          return res.sendStatus(403)
     }
     req.user = user;
     next()
    })

 
 }