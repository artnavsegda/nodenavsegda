const { GraphQLServer, PubSub } = require('graphql-yoga')

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
  Subscription: {
    newLink: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator("NEW_LINK")
      },
      resolve: payload => {
        return payload
      },
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).substring(2, 15) // random channel name
        let count = 0
        setInterval(() => pubsub.publish(channel, { counter: { count: count++ } }), 2000)
        return pubsub.asyncIterator(channel)
      },
    }
  },
}

// 3
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: { pubsub }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))