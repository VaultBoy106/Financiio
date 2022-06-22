const express = require('express')
const app = express()
const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require('cors');
require('dotenv').config()

app.use(express.json())
    // user side
    let users = [

    ]

    const posts = [
        {
            username: 'Kyle',
            title: 'Post 1'
        },
        {
            username: 'Jim',
            title: 'Post 2'
        },
        {
            username: 'Dzemal',
            title: 'true'
        },    
    ]

    app.get('/users', (req, res) => {
        res.json(users)
    })

    app.post('/users', async (req, res) => {
        
        try {
            
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = {name: req.body.name, password: hashedPassword}
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
                        res.send('Success')
                    }else {
                        res.send('Not Allowed')
                    }
                }catch {
                    res.status(500).send()
                }


    })

    app.get('/posts',authenticateToken , (req, res) => {
        res.json(posts.filter(post => post.username === req.user.name))
    })

    
    ////////////////////////////////////////////////////////////////////////////////
    
    // token side

    app.post('/login', (req, res) => {
        //Authenticate user
        const username = req.body.username;
        const user = {name: username};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken: accessToken})
    })
        function authenticateToken(req, res, next) {
            //get header authorisation 
            const authHeader = req.headers['authorization']
            // if there is an header check token in the header 
            const token = authHeader && authHeader.split(' ')[1]
            // if there is an token undefind then throw the 401 message
            if(token === null) {
                return res.sendStatus(401)
            }
            //jwt verify if the token is right 
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if(err) {
                    return res.sendStatus(403)
                }
                req.user = user
                next()

            })
        }

        app.use(cors({
            origin: '*',
            credentials: true
        }));
    
        app.listen(7002)