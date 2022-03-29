# Authentication with Serverless

In this project I was learning the [serverless](https://www.serverless.com/) framework with and I created a user authentication and registration that I use [aws](https://aws.amazon.com/pt/) with serverless,
and I also put an intro with unit tests with [jest](https://jestjs.io/pt-BR/) that I'm trying to improve,
I used a layered architecture based on the [clean architecture](https://www.raywenderlich.com/3595916-clean-architecture-tutorial-for-android-getting-started) and [code clean](https://balta.io/blog/clean-code)


to use this project you need to use some keys and make some settings in aws


## To start the project

### `npm install`
 install dependencies for the project

### `npm run offline`
Runs the app in the development mode.\
Open [http://127.0.0.1:8000](http://127.0.0.1:8000) 


### `npm run test`

run the tests

### `npm run test:debug`

run the tests in silent mode

### `npm run test:coverage`

runs the tests and shows the lines that the test failed and the percentage of coverage over the tests

### `npm run deploy:dev`

performs the deployment in the development environment using serverless

### `npm run deploy:hml`

performs the deployment in the homologation environment using serverless

### `npm run deploy:dev`

performs the deployment in the production environment using serverless

