const db = require('../model');
const User = db.User;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const uuidv4 = require("uuid");
const bunyan = require('bunyan');
const os = require("os");

const severityMap = {
  10: 'DEBUG',    // Bunyan's TRACE level
  20: 'DEBUG',    // Bunyan's DEBUG level
  30: 'INFO',     // Bunyan's INFO level
  40: 'WARNING',  // Bunyan's WARN level
  50: 'ERROR',    // Bunyan's ERROR level
  60: 'CRITICAL', // Bunyan's FATAL level
};

const log = bunyan.createLogger({
  name: 'webapp',
  streams: [
    { path: '/var/log/webapp.log' } // Log file path
  ],
  serializers: bunyan.stdSerializers,
  // Extend the log record using the serializers field
  levelFn: (level, levelName) => {
    return { 'severity': severityMap[level] };
  }
});

const originalWrite = log._emit;
log._emit = function (rec, noemit) {
  rec.severity = severityMap[rec.level];
  originalWrite.call(this, rec, noemit);
};

function decryptString(authheader) {
    if (authheader && authheader.startsWith('Basic ')) {
        const base64Credentials = authheader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [passed_username, passed_password] = credentials.split(':');
        console.log(passed_username,passed_password);
        return [passed_username , passed_password];
    }
    else
        return null;
}

exports.create = async (req, res)=>{
    try{

        if(!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.password){
            res.status(400).send();
        }else{
        
        const emailExists = await User.findOne({ where: { username: req.body.username } });
        if (emailExists ) {
            res.status(400).send("Email already registered")
            log.error('Email already registered');
        }
        else{
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const date = new Date();
            console.log("############",hashedPassword)
            const user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password:hashedPassword,
                account_created: date.toString(),
                account_updated: date.toString()
            }
    
            User.create(user)
            .then(data =>{
                const { password, ...userDataWithoutPassword } = data.dataValues;
                res.status(201)
                .send(userDataWithoutPassword);
                log.info('User created', { msg: JSON.stringify(userDataWithoutPassword, null, 2) });
            })
            .catch(err =>{
                res.status(400)
                .send({ message:
                    err.message || "Some error occurred while creating the User."})
                log.error('Some error occurred while creating the User.');
            });
            }
        }

    }catch (error){
        console.error('Health check error:', error);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(503).send();
    }
};


exports.findOne = (req, res) => {
    try{

        const authHeader = req.headers.authorization;
        console.log(authHeader); // Make sure you are getting the expected value in the authHeader

        if (authHeader && authHeader.startsWith('Basic ')) {
            const [decryptedUsername, decryptedPassword] = decryptString(authHeader);
            
            if (decryptedUsername === null || decryptedPassword === null) {
                res.status(401).send('Unauthorized');
                log.error('Unauthorized');
            } else {
                User.findOne({
                    where: {
                        username: decryptedUsername
                    }
                })
                .then(user => {
                    if (!user) {
                        res.status(401).send();
                    } else {
                        const isPasswordValid = bcrypt.compareSync(decryptedPassword, user.password);
                        if (!isPasswordValid) {
                            res.status(401).send();
                        } else {
                            const { password, ...userDataWithoutPassword } = user.dataValues;
                            console.log(userDataWithoutPassword);
                            res.status(200).send(userDataWithoutPassword);
                            log.info('User fetched', userDataWithoutPassword);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    res.status(503).send(); // Internal server error
                });
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    }catch (error){
        console.error('Health check error:', error);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(503).send();
    }
}

exports.updateUser = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const [decryptedUsername, decryptedPassword] = decryptString(authHeader);

        if (decryptedUsername === null || decryptedPassword === null) {
            res.status(401).send('Unauthorized');
        } else {
            const { first_name, last_name, password } = req.body;
            User.findOne({
                where: {
                    username: decryptedUsername
                }
            })
            .then(user => {
                if (!user) {
                    res.status(401).send('User not found');
                    log.error('User not found');
                } else {
                    const isPasswordValid = bcrypt.compareSync(decryptedPassword, user.password);
                    if (!isPasswordValid) {
                        res.status(401).send('Invalid password');
                        log.error('Invalid password');
                    } else {
                        // Update the user's information
                        const updatedFields = {};
                        if (first_name) updatedFields.first_name = first_name;
                        if (last_name) updatedFields.last_name = last_name;
                        if (password) {
                            const hashedPassword = bcrypt.hashSync(password, 10);
                            updatedFields.password = hashedPassword;
                        }
                        const date = new Date();
                        updatedFields.account_updated = date.toString();
                        User.update(updatedFields, {
                            where: {
                                username: decryptedUsername
                            }
                        })
                        .then(() => {
                            res.status(204).send();
                            log.info('User updated',{ msg: JSON.stringify(updatedFields, null, 2) });
                        })
                        .catch(error => {
                            console.error('Error updating user:', error);
                            res.status(503).send('Internal server error');
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error finding user:', error);
                res.status(503).send('Internal server error');
            });
        }
    }catch (error){
        console.error('Health check error:', error);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(503).send();
    }
};




// exports.findOne = (req,res) =>{
//     const authheader = req.headers.authorization;
//     console.log(authheader)
//     if (authheader && authheader.startsWith('Basic ')) {
//         const base64Credentials = authheader.split(' ')[1];
//         const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//         const [passed_username, passed_password] = credentials.split(':');
//         console.log(passed_username,passed_password);

//         User.findOne({
//             where: {
//                 username: passed_username
//             }
//         })
//         .then(user => {
//             if (!user) {
//                 res.status(404).send();
//             } else {
//                 const isPasswordValid = bcrypt.compareSync(passed_password, user.password);
//                 if (!isPasswordValid) {
//                     res.status(404).send();
//                 } else {
//                     const { password, ...userDataWithoutPassword } = user.dataValues;
//                     console.log(userDataWithoutPassword);
//                     res.status(200).send(userDataWithoutPassword);
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             res.status(500).send(); // Internal server error
//         });
//     }else{
//         res.status(401).send('Unauthorized');
//     }


//     // if(!authheader){
//     //     let err = new Error('You are not authenticated!');
//     //     err.status = 401;
//     //     res.setHeader('WWW-Authenticate', 'Basic').status(401).send();
//     //     return;
//     // }
//     // const auth = new Buffer.from(authheader.split('')[1],
//     // 'base64').toString().split(':');

//     // const user =auth[0];
//     // const password= auth[1];
//     // // console.log("#######################");
//     // // console.log(user);
//     // // console.log(password);
//     // const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
//     // console.log(hashedPassword);
//     // User.findByPk("123e4567-e89b-12d3-a456-426614174000")
//     // .then(data =>{
//     //     if(data){
//     //         const { password, ...userDataWithoutPassword } = data.dataValues;
//     //         console.log(userDataWithoutPassword);
//     //         res.status(200).send(userDataWithoutPassword);
//     //     } else{
//     //         res.status(404).send();
//     //     }
//     // });

//     // User.findAll({
//     //     where:{
//     //         username:req.body.username,
//     //         //password:bcrypt.hashSync(req.body.password,10)
//     //     }
//     // })
//     // .then(data => {
//     //     // if(data){

//     //     //     //const { password, ...userDataWithoutPassword } = data.dataValues;
//     //     //     //console.log(userDataWithoutPassword);
//     //     //     res.status(200).send(data);
//     //     // } else{
//     //     //     res.status(404).send();
//     //     // }

//     //     if(!data || !bcrypt.compareSync(req.body.password, data.password)){
//     //         res.status(404).send();
//     //     }else{
//     //         const { password, ...userDataWithoutPassword } = data.dataValues;
//     //         console.log(userDataWithoutPassword);
//     //         res.status(200).send(data);
//     //     }
//     // });

// };

