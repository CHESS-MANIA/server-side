

const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

// console.log(SECRET,">>");

const signToken = (payload) => {
    return jwt.sign(payload, 'coba')
}

const verifyToken = (token) => {
    return jwt.verify(token, 'coba')
}

module.exports= {
    signToken, 
    verifyToken
}
