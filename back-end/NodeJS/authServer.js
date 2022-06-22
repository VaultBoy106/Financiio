const express = require('express')
const app = express()
const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require('cors');

require('dotenv').config()

app.use(express.json())
    //create database to store these tokens

    let refreshTokens = []
    let users = []




    // user side
    app.get('/users', (req, res) => {
        res.json(users)
    })

    //sing up
    app.post('/users', async (req, res) => {
        
        try {
            
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = {username: req.body.username, password: hashedPassword}
                users.push(user)
                res.status(201).send()
            console.log(salt)
            console.log(hashedPassword)
        }catch {
            res.status(500).send()
        }

    })

    app.post('/users/login', async(req, res) => {
            const user = users.find(user => user.name === req.body.name)
            
            if(user == null) {
                return res.status(400).send('Cannot find user')
            }

                try {
                    if(await bcrypt.compare(req.body.password, user.password)){
                        const username = req.body.username;
                        const user = {name: username};
                        const accessToken = generateAccessToken(user)
                        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                            refreshTokens.push(refreshToken)
                            res.json({accessToken: accessToken, refreshToken: refreshToken})
                        
                    }else {
                        res.send('Not Allowed')
                    }
                }catch {
                    res.status(500).send()
                }


    })
    /////////////////////////////////////////////////////////////////

    app.post('/token', (req, res) => {
        const refreshToken = req.body.token
            if(refreshToken === null) {
                
                return res.sendStatus(401)
            }
            if(!refreshTokens.includes(refreshToken)){
                console.log('1')
                return res.sendStatus(403)
            }
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    if(err) {
                        console.log('2')
                        return res.sendStatus(403)
                    }
                    const accessToken = generateAccessToken({name: user.name})
                    res.json({accessToken: accessToken})
            })
    })

    app.delete('/logout', (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        res.sendStatus(204)
    })

    
        function generateAccessToken(user){
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        }
        app.use(cors({
            origin: '*',
            credentials: true
        }));
    app.listen(1235)