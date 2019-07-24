# node_class_sequelize_jwt

### Features :
    Node
    Class
    Sequelize
    MySQL
    JWT [Yet to implement]

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
        
    MySQL : Update mysql object in above mentioned Json files Accordingly.
      
      "mysql": {
             "username": "root", ------------>[Change it accodring to your MySQL Useranme]
             "password": "root", ------------>[Change it accodring to your MySQL Password]
             "database": "node_crud", ------------>[Change it accodring to your Database Name]
             "host": "127.0.0.1", ------------>[Change it accodring to your IP]
             "dialect": "mysql",
             "define": {
                 "timestamps": false
             }
         }
     
       
    
### Setup Information :
    1: npm install
    2: npm install pm2 -g
    3: create a database in MySQL, And update config accordingly
    4: pm2 start ecosystem.config.js --env production --only server [For production mode]
                          ----------------OR----------------
    5: pm2 start ecosystem.config.js --env development --only server [For development mode]
 
    
    
