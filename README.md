# Northcoders House of Games API

## Link to the hosted API

https://games-backend-project.onrender.com

## Background

This is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture (NC-games)

## Cloning, dependencies, seeding, testing

To clone this repo cd in to the folder in which you would like the repo and then type git clone https://github.com/ElenaCKay/nc-games-backend-.git . Then cd into nc-games-backend. To install the dependenscies run npm i. To set up the database run npm setup-dbs and to seed run npm seed. To run tests using jest run npm test.

## Enviroment Variables

To connect the two databases please add a .env.test and a .env.development file which contain PGDATABASE=<database_name_here>

