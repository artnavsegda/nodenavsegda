const { GraphQLServer, PubSub } = require('graphql-yoga');
const cipclient = require('crestron-cip')

const cip = cipclient.connect({host: "192.168.88.41", ipid: "\x03"}, () => {
  console.log('CIP connected');
})

const pubsub = new PubSub();

let lights = {
  StoreCeiling: {
    name: 'Потолок',
    description: 'Ceiling lamp',
    type: "DISCRETE",
    location: "STORE",
    isOn: true,
    setOn: 1,
    setOff: 101,
    getOn: 1,
    setToggle: 201
  },
  StorePhytolamp: {
    name: 'Лампа',
    description: 'Phyto lamp',
    type: "DISCRETE",
    location: "STORE",
    isOn: false,
    setOn: 2,
    setOff: 102,
    getOn: 2,
    setToggle: 202
  },
  StoreSpotlights: {
    name: 'Споты',
    description: 'Spotlights lamp',
    type: "DIMMABLE",
    location: "STORE",
    isOn: false,
    brightness: 100,
    setOn: 10,
    setOff: 110,
    getOn: 10,
    getBrightness: 33,
    setBrightness: 33,
    setToggle: 210
  },
  StoreLedstrip: {
    name: 'Споты',
    description: 'LED Strip',
    type: "RGB",
    location: "STORE",
    isOn: false,
    brightness: 100,
    setOn: 11,
    setOff: 111,
    getOn: 11,
    getBrightness: 34,
    setBrightness: 34,
    setToggle: 211
  },
  MeetingCeiling: {
    name: 'Потолок',
    description: 'Ceiling lamp',
    type: "DISCRETE",
    location: "MEETING",
    isOn: true,
    setOn: 3,
    setOff: 103,
    getOn: 3,
    setToggle: 203
  },
  MeetingPhytolamp: {
    name: 'Лампа',
    description: 'Phyto lamp',
    type: "DISCRETE",
    location: "MEETING",
    isOn: false,
    setOn: 4,
    setOff: 104,
    getOn: 4,
    setToggle: 204
  },
  MeetingSpotlights: {
    name: 'Споты',
    description: 'Spotlights lamp',
    type: "DIMMABLE",
    location: "MEETING",
    isOn: false,
    brightness: 100,
    setOn: 10,
    setOff: 110,
    getOn: 10,
    getBrightness: 33,
    setBrightness: 33,
    setToggle: 210
  },
  MeetingLedstrip: {
    name: 'Споты',
    description: 'LED Strip',
    type: "RGB",
    location: "MEETING",
    isOn: false,
    brightness: 100,
    setOn: 12,
    setOff: 112,
    getOn: 12,
    getBrightness: 35,
    setBrightness: 35,
    setToggle: 212
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

        if(lights[args.id].setToggle)
          cip.pulse(lights[args.id].setToggle);

        //context.pubsub.publish("LIGHT_CHANGE", {lightChange: some})
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

cip.subscribe((data) => {
  //console.log("type:" + data.type + " join:" + data.join + " value:" + data.value);
  for (const [key, value] of Object.entries(lights)) {
    if (data.type == 'digital' && value.getOn == data.join)
    {
      value.isOn = !!data.value;
      value.id = key;
      pubsub.publish("LIGHT_CHANGE", {lightChange: value})
    }
  }
});

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: { pubsub }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))