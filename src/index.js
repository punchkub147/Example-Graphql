const express = require("express");
const graphqlMiddleware = require("express-graphql");
const { buildSchema } = require("graphql");

const users = require("../users.json");

const app = express();

const schema = buildSchema(`
  type Query {
    helloworld: String
    user(id: Int!): User
    users(limit: Int = 5, gender: String, age: AGE): [User]
  }
  type Mutation {
    createUser(name: String!, age: Int): User
    createUserObject(user: UserInput): User
  }

  type User {
    id: Int
    balance: String
    picture: String
    age: Int,
    name: String
    gender: String
    company: String
    email: String
  }
  enum AGE {
    YOUNG
    OLD
  }

  input UserInput {
    name: String!
    age: Int
    gender: String
  }
`);

const resolver = {
  helloworld(args) {
    console.log(args);
    return "Hello World";
  },
  user(args) {
    return users.find(user => user.id === args.id);
  },
  users(args) {
    let result = [...users];
    if (args.gender) {
      result = result.filter(user => user.gender === args.gender);
    }
    if (args.age) {
      result =
        args.age === "YOUNG"
          ? result.filter(user => user.age < 30)
          : result.filter(user => user.age >= 30);
    }
    return result.slice(0, args.limit);
  },
  createUser(args) {
    const { name, age } = args;
    return { name, age };
  },
  createUserObject(args) {
    const { user } = args;
    return user;
  }
};

app.use(
  graphqlMiddleware({
    schema,
    rootValue: resolver,
    graphiql: true
  })
);
app.listen(8080);
