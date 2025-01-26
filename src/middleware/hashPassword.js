const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const hashPassword = (configPath) => {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    let hashedPassword;
    if (config.auth.password.startsWith('$2a$') || config.auth.password.startsWith('$2b$')) {
        hashedPassword = config.auth.password;
    } else {
        hashedPassword = bcrypt.hashSync(config.auth.password, 10);
        config.auth.password = hashedPassword;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
    return hashedPassword;
};

module.exports = hashPassword;