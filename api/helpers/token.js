class TokenHelper{
   static addToken = async (tokenData) => {
        console.log('body', tokenData)
        try {
          const newtoken = await Token(tokenData);
      
          newtoken.save((err, token) => {
          if (err) {
            return res.status(422).json({
              success: false,
              message: "Unable to create token!",
              data: err,
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "New token is created!",
              data: token,
            });
          }
        });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }
      }
      static generateToken = (userName, vehicleNumber) => {
        return userName.split(" ")[0].toUpperCase()+vehicleNumber
      }
}

module.exports = { TokenHelper }