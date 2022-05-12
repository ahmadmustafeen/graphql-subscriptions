const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { User } = require("./models/UserSchema");
require("dotenv").config();
const typeDefs = gql`
  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
    getUserByEmail(email: String): User
    getUserByName(name: String): User
    getUserByPhone(phone: String): User
    getUserByAddress(address: String): User
    getUserByCity(city: String): User
    getUserByState(state: String): User
    getUserByZip(zip: String): User
    getUserByCountry(country: String): User
    getUserByDob(dob: String): User
  }
  type User {
    id: ID
    name: String
    email: String
    phone: String
    address: String
    city: String
    state: String
    zip: String
    country: String
    dob: String
  }
  type Mutation {
    createUser(
      name: String
      email: String
      phone: String
      address: String
      city: String
      state: String
      zip: String
      country: String
      dob: String
    ): User
    updateUser(
      id: ID
      name: String
      email: String
      phone: String
      address: String
      city: String
      state: String
      zip: String
      country: String
      dob: String
    ): User
    deleteUser(id: ID): User
  }
  type Subscription {
    userCreated: User
    userUpdated: User
    userDeleted: User
  }
`;

mongoose.connect(
    process.env.MONGODB_PATH,
    { useNewUrlParser: true }
);

const resolvers = {
  Query: {
    getAllUsers: async () => {
      const users = await User.find();
      return users;
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        name: args.name,
        email: args.email,
        phone: args.phone,
        address: args.address,
        city: args.city,
        state: args.state,
        zip: args.zip,
        country: args.country,
        dob: args.dob,
      });
      await user.save();
    },
    updateUser: async (root, args) => {
      const user = await User.findByIdAndUpdate(
        args.id,
        {
          name: args.name,
          email: args.email,
          phone: args.phone,
          address: args.address,
          city: args.city,
          state: args.state,
          zip: args.zip,

          country: args.country,
          dob: args.dob,
        },
        { new: true }
      );
      return user;
    },
    deleteUser: async (root, args) => {
      const user = await User.findByIdAndDelete(args.id);
      return user;
    },
  },
};

const server = new ApolloServer({
    typeDefs, resolvers,
    subscriptions: {
        onConnect: (connectionParams, webSocket) => {
            console.log('Client connected', connectionParams);
        },
        onDisconnect: (webSocket, context) => {
            console.log('Client disconnected', context);
        },
    },
    context: async ({ req }) => {
        const auth = req.headers.authorization || '';
        const token = auth.split(' ')[1];
        if (token) {
            const user = await User.findByToken(token);
            return { user };
        }
        return {};

    }
})

server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}/4000`);
}).catch(err => {
    console.log(err);
})