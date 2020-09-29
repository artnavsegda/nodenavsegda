const { GraphQLServer, PubSub } = require('graphql-yoga')
const Subscription = require('./Subscription')

const pubsub = new PubSub();

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    // 2
    post: (parent, args, context) => {
       const newLink = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(newLink)
      context.pubsub.publish("NEW_LINK", newLink)
      return newLink
    }
  },
  Subscription
}

// 3
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      pubsub
    }
  }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))