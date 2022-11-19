const loginRoutes = require('./login');
const navigationRoutes = require('./navigation');

const constructorMethod = (app) => {
  app.use('/', loginRoutes);
  app.use('/username',navigationRoutes); //username will be dynamic
};



module.exports = constructorMethod;