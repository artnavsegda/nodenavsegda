const { GraphQLServer, PubSub } = require('graphql-yoga');
const express = require('express');

const pubsub = new PubSub();

let lights = {
  StoreCeiling: {
    name: 'Потолок',
    description: 'Ceiling lamp',
    type: "DISCRETE",
    location: "STORE",
    isOn: true
  },
  StorePhytolamp: {
    name: 'Лампа',
    description: 'Phyto lamp',
    type: "DISCRETE",
    location: "STORE",
    isOn: false
  },
  StoreSpotlights: {
    name: 'Споты',
    description: 'Spotlights lamp',
    type: "DIMMABLE",
    location: "STORE",
    isOn: false,
    brightness: 100
  },
  MeetingCeiling: {
    name: 'Потолок',
    description: 'Ceiling lamp',
    type: "DISCRETE",
    location: "MEETING",
    isOn: true
  },
  MeetingPhytolamp: {
    name: 'Лампа',
    description: 'Phyto lamp',
    type: "DISCRETE",
    location: "MEETING",
    isOn: false
  },
  MeetingSpotlights: {
    name: 'Споты',
    description: 'Spotlights lamp',
    type: "DIMMABLE",
    location: "MEETING",
    isOn: false,
    brightness: 100
  },
}

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
    switch: (parent, args, context) => {
      if (lights[args.id])
      {
        lights[args.id].isOn = args.on;
        let some = lights[args.id]
        some.id = args.id
        context.pubsub.publish("LIGHT_CHANGE", {lightChange: some})
        return some
      }
      else return undefined;
    },
    toggle: (parent, args, context) => {
      if (lights[args.id])
      {
        lights[args.id].isOn = !lights[args.id].isOn;
        let some = lights[args.id]
        some.id = args.id
        context.pubsub.publish("LIGHT_CHANGE", {lightChange: some})
        return some
      }
      else return undefined;
    }
  },
  Subscription: {
    lightChange: {
      subscribe: (parent, args, context) => {
        return context.pubsub.asyncIterator("LIGHT_CHANGE")
      }
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: { pubsub }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))

const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => {
    lights.StoreCeiling.isOn = !lights.StoreCeiling.isOn;
    lights.StoreCeiling.id = "StoreCeiling";
    pubsub.publish("LIGHT_CHANGE", {lightChange: lights.StoreCeiling})
    res.send('Hello World!');
});
app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`))