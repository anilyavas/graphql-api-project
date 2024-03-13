var {
  graphql,
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { ruruHTML } = require('ruru/server');

// Construct a schema, using GraphQL schema language
//var schema = buildSchema(`
//  type Query {
//    hello(name: String!): String
//    age: Int
//    weight: Float!
//    isOver18: Boolean
//    hobbies: [String!]!
//    user: User
//  }
//
//  type User {
//    id: Int
//   name: String
//
// }

//`);

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
      resolve: (obj) => {
        const name = obj.name.trim().toUpperCase();
        if (obj.isAdmin) {
          return `${name} (Admin)`;
        }
        return name;
      },
    },
  },
});
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => {
          return 'Hello world';
        },
      },
      user: {
        type: User,
        resolve: () => {
          return {
            id: 1,
            name: '   Anil    ',
            extra: 'hey',
            isAdmin: false,
          };
        },
      },
    },
  }),
});

// The rootValue provides a resolver function for each API endpoint
// var rootValue = {
//   hello: ({ name }) => {
//     // fetch data form db
//     // process
//     return 'Hello ' + name;
//   },
//   age: () => {
//     return 25;
//   },
//   weight: 77.7,
//   isOver18: true,
//   hobbies: () => {
//     return ['Carting', 'F1', 'Simulator'];
//   },
//   user: () => {
//     return {
//       id: 1,
//       name: 'Anil',
//     };
//   },
// };

const app = express();

app.all('/graphql', createHandler({ schema }));
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.listen(4000);
console.log(`
API running on: http://localhost:4000
Test: https://localhost:4000/graphql?query={hello,age}
`);
