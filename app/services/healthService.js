//const sequelize =  require('../config/database');
const checkHealth = async () =>{
    try {
        //await sequelize.authenticate();
        return ;
    }catch (error){
        //console.error('Database connection error:', error);
        throw new Error('Database connection error');
    }
}

module.exports = {
    checkHealth,
};