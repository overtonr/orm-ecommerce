
# Challenge : E-Commerce Back End

## Description
This application contains the back end code for an e-commerce website. The application calls on Express.js API to use Sequelize to interact with a MySQL database It contians routes that allow users to get, post, put (update), and delete data.


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<br>

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Questions](#questions)

<br>

## Installation

To get started, users must initialize an installation of the required packages using the following command:

```
> npm install
```
Users should create an .env file with the following format, in order to encrypt their user and password information
```
DB_NAME=ecommerce_db
DB_USER=''
DB_PASSWORD=''
```
Users should then navigate into the 'db' folder and add the database to their mysql shell using the following commands:
```
> source schema.sql
```
Then the user will seed the provided data by running the following command

```
> npm run seed
```
<br>

## Usage
To start the server, the user will navigate to the root directory and run the following command:
```
> node server.js
```
To be able to interact with the various routes, it is suggested that the user uses the app Insomnia to create various request with the various routes

<br>

## License
This application is covered under the MIT License

<br>

## Questions
https://github.com/overtonr
