const routes = require('next-routes')

module.exports = routes()
.add('about')
.add('index')
.add('signin')
// .add('dashboard')    <--------- using routing from server site