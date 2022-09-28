module.exports = app => {
    
    var router = require("express").Router();
    const controller = require('../controller');

  
    // Retrieve all published Tutorials
    router.post("/", (req,res) => {
        login_data  = controller.authentication.authentication(req,res);
    
    });
  
  
    app.use('/api/authentication', router);
  };
  