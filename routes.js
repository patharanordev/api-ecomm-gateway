const routes = require('next-routes')

module.exports = routes()
.add('about')
.add('index')
.add('signin')
// .add('dashboard')    <--------- any page that required auth,
//                                 it using routing from server 
//                                 site instead.