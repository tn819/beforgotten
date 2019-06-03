Be Forgotten Petition Project

http://beforgotten.herokuapp.com/

| Description             | Tech                                           | Overview                                                                                                          |
| ----------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Front-end               | Express-Handlebars, CSS, Animations, Keyframes | Dynamic page and templating structure                                                                             |
| Back-end                | Node, Express, Express Router                  | Node server and routing set-up                                                                                    |
| Database                | Postgres SQL                                   | Node server and routing set-up                                                                                    |
| Scripting               | JS, jQuery                                     | touch and animation handling                                                                                      |
| Authentication/Security | bcrypt, cookie-session, csurf                  | user log-in handled securely with bcrypt, common web security concerns addressed via csurf, cookies, other set-up |
| Test                    | Jest                                           | examples of route testing                                                                                         |

## build steps

```
npm install

npm start

requires ENV variables for DATABASE_URL (postgres url)
```

## register page

verified log-in with colors corresponding to validation, animated background
![alt text](https://raw.githubusercontent.com/tn819/beforgotten/master/public/register.png)

## sign page

canvas signature that works with touch and mobile, logging signature on petition to database
![alt text](https://raw.githubusercontent.com/tn819/beforgotten/master/public/signature.png)

## signatures page

interactive signature section, filter results on city and displays dynamically
![alt text](https://raw.githubusercontent.com/tn819/beforgotten/master/public/signees.png)
