const { GraphQLServer, PubSub } = require('graphql-yoga')

const pubsub = new PubSub();

let lights = {
  light0: {
    name: 'Ceiling',
    description: 'Ceiling lamp',
    type: "DISCRETE",
    isOn: true
  },
  light1: {
    name: 'Lamp',
    description: 'Phyto lamp',
    type: "DISCRETE",
    isOn: false
  },
  light2: {
    name: 'Spotlights',
    description: 'Spotlights lamp',
    type: "DIMMABLE",
    isOn: false,
    brightness: 100
  },
}

//let idCount = links.length
const resolvers = {
  Query: {
    info: () => `AV Install office lights`,
    light: (parent, args) => {
      if (lights[args.id])
      {
        let some = lights[args.id]
        some.id = args.id
        return some
      }
      else return undefined;
    },
    lights: () => Object.entries(lights).map((what) => {
      let some = {...what[1]}
      some.id = what[0]
      return some
  }),
  },
  Mutation: {
    switch: (parent, args) => {
      return {
        id: 'light-0',
        name: 'Ceiling',
        description: 'Ceiling lamp',
        isOn: true
      }
    },
    toggle: (parent, args) => {
      return {
        id: 'light-0',
        name: 'Ceiling',
        description: 'Ceiling lamp',
        isOn: true
      }
    }
/*     post: (parent, args, context) => {
       const newLink = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(newLink)
      context.pubsub.publish("NEW_LINK", newLink)
      return newLink
    } */
  },
/*   Subscription: {
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
  }, */
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: { pubsub }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))