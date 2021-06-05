const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World Nurse');
});

router.post('/singup', (req, res) => {
    
});

router.post('/signin', (req, res) =>{

});

module.exports = router;