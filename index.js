const express = require('express');
const connection = require('./config');
const app = express();
const Joi = require('joi')
app.use(express.json());

app.get('/api/employees', (req, res) => {
    connection.query('SELECT * from employee', (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving employees')
        } else {
            res.json(results)
        }

  });
});

app.delete('/api/employees/:id', (req, res) => {
    let requiredId = parseInt(req.params.id)
    connection.query(`DELETE FROM employee WHERE id = ${requiredId}`, (err, results) => {
        if (results.affectedRows == 0) {
            res.status(404).send('The employee with the given id was not found')
        } else {
            res.send(results)
        }
    });
});


app.get('/api/employees/:id/:whatever', (req, res) => {
    const requiredId = parseInt(req.params.id)
    connection.query(`SELECT * from employee WHERE id = ${requiredId}`, (err, results) => {
        if (err) res.status(404).send('The employee with the given id was not found')
        res.send(results);
    });
});



    
app.put('/api/employees/:id', (req, res)  => {
    let requiredId = parseInt(req.params.id)
    let lastname = req.body.lastname;
    let firstname = req.body.firstname;
    let email = req.body.email;

    connection.query(`UPDATE employee SET lastname = "${lastname}", firstname ="${firstname}", email="${email}" WHERE id = ${requiredId}`, (err, results) => {
    if (err) res.status(404).send('The employee with the given id was not found')
        const result = validateEmployee(req.body);
        //const {error} =  validateEmployee(req.body);
        if(result.error) {
        //if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
        res.send(results)
    });
});

app.post('/api/employees', (req, res) => {
    // option with joi to check validation 
    const {error} =  validateEmployee(req.body);
//if(result.error) {
    if(error) {
    res.status(400).send(result.error.details[0].message)
    return;
    }

    // --- end of validation with joi

    let lastname = req.body.lastname;
    let firstname = req.body.firstname;
    let email = req.body.email;
    connection.query(`INSERT INTO employee (lastname, firstname, email) VALUES ('${firstname}', '${lastname}', '${email}')`,
    (err, result) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(result);
        }
    });
});



function validateEmployee(results) {
    const schema ={
        lastname: Joi.string().min(3).required(),
        firstname: Joi.string().min(3).required(),
        email: Joi.string().min(3).required()
    }
    return Joi.validate(results, schema)
}

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`))