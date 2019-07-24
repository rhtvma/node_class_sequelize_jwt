# node_class_sequelize_jwt

### Features :
    Node
    Class
    Sequelize
    MySQL
    JWT

### Public Access :  
    Images : http://localhost:3000/images/dummy-profile.jpg
    
### Default Routes :
    GET : UserList :  http://localhost:3000/usersList
    GET :  projectList :  http://localhost:3000/projectList
    POST : projectCreate :  http://localhost:3000/projectCreate
    
### Config Information :
    Config path : \node_class_sequelize_jwt\config
        1: deafult.json : will load when NODE_ENV=null
        2: development.json : will load when NODE_ENV=development
        3: production.json : will load when NODE_ENV=production
    
### Setup Information :
    1: npm install
    2: npm install pm2 -g
    3: pm2 start ecosystem.config.js --env production --only server [For production mode]
                          ----------------OR----------------
    3: pm2 start ecosystem.config.js --env development --only server [For development mode]
 
    
    