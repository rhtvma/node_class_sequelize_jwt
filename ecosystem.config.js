/**
 * Created by rohit on 06/28/2019.
 */
module.exports = {
    apps: [
        {
            name: "server",
            script: 'main.js',
            watch: true,
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            env_production: {
                "watch": false,
                "PORT": 3000,
                "NODE_ENV": "production",
            },
            env_staging: {
                "NODE_ENV": "staging",
            }
        }
    ]
}
