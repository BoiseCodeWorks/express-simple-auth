let router = require('express').Router()
let Users = require('../models/user-model')

router.post('/register', (req, res) => {
  Users.create(req.body)
    .then((user) => {
      req.session.uid = user._id
      req.session.save()
      user.password = null
      delete user.password
      res.send({
        message: 'Successfully created user account',
        data: user
      })
    })
    .catch(err => {
      res.send({ error: err })
    })
})


router.post('/login', (req, res) => {
  Users.findOne({ email: req.body.email })
    .then(user => {
      user.validatePassword(req.body.password)
        .then(valid => {
          if(!valid){
            return res.send({error: 'Invalid Email or Password'})
          }
          req.session.uid = user._id;
          req.session.save()
          user.password = null
          delete user.password
          res.send({
            message: 'successfully logged in',
            data: user
          })
        })
        .catch(err => {
          res.send({ error: err || 'Invalid Email or Password' })
        })
    })
    .catch(err => {
      res.send({
        error: err,
        message: 'Invalid Email or Password'
      })
    })
})

router.delete('/logout', (req, res) => {
  req.session.destroy()
  res.send({
    message: 'You have successfully been logged out. Please come back soon!'
  })
})

module.exports = router;