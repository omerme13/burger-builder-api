const prices = require('./ingredients').prices;

const postOrderHandler = (req, res, db) => {
    const {
        meat, cheese, bacon, salad, 
        name, city, street, email, deliveryMethod
    } = req.body;

    db('orders').insert({
        meat: meat,
        cheese: cheese,
        bacon: bacon,
        salad: salad,
        // the reason for calculating prices here is to prevent manipulating data by the user.
        price: prices.default + prices.salad*salad + prices.bacon*bacon
            + prices.cheese*cheese + prices.meat*meat,
        // TODO userId: userId .and then connect user table with orders table instead of creating many columns in orders table
        name: name.value,
        city: city.value,
        street: street.value,
        email: email.value, //TODO try exchange email with req.userData.email
        deliveryMethod: deliveryMethod.value,
        time: new Date()
    })
        .then(response => res.json(response))
        .catch(err => res.status(400).json('error getting orders'));
}

const getOrdersHandler = (req, res, db) => {
    db.select('*').from('orders')
    .where('email', '=', req.userData.email)
        .then(orders => {
            if (orders.length) {
                res.json(orders);
            } else {
                res.json([]);
            }
        })
        .catch(err => res.status(400).json('error getting orders'));
}

module.exports = {
    getOrdersHandler: getOrdersHandler,
    postOrderHandler: postOrderHandler
};