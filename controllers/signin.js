const signinHandler = (req, res, db, bcrypt, jwt) => {
    const {email, password} = req.body;
    
    db.select('*').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        const expirationTime = 3600;
        
        //*TODO insert into users table the right id from login table             
        if (isValid) {
            const token = jwt.sign(
                {email: data[0].email, id: data[0].id}, 
                'cheese', 
                {expiresIn: expirationTime}
            );
            
            return db.select('*').from('users')
            .where('email', '=', email)
                .then(user => res.json({
                    token: token, 
                    userId: user[0].id,
                    expirationTime   
                }))
                .then(console.log(data[0].email, data[0].id))
                .catch(err => res.status(400).json('unable to get user'));
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
};

module.exports = {
    signinHandler: signinHandler
};