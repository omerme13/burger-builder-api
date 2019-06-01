const registerHandler = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    db.select('*')
        .from('users')
        .where('email', '=', email)
        .then(user => {
            if (user.length) {
                res.status(409).json('user already exists');
            } else {
                db.transaction(trx => {
                    trx.insert({hash, email})
                    .into('login')
                    .returning('email')
                    .then(loginEmail => {
                        return trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            joined: new Date() 
                        })
                        .then(user => res.json(user[0]))
                        .catch(err => res.status(400).json('unable to register'));
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)
                    // we don't return the err itself because we don't want to 
                    // reveal information about out database
                }); 
            }
        });
}

module.exports = {
    registerHandler: registerHandler
};