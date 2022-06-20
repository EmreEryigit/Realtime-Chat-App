
const { createServer, PubSub }= require('@graphql-yoga/node')





const messages = []

const typeDefs = `
    type Message {
        id : ID
        user: String
        content: String
    }
    type Query {
        messages: [Message]
    }
    type Mutation {
        postMessage(user: String!, content: String!): ID
    }
    type Subscription {
        messages: [Message]
    }
`
const pubsub = new PubSub()
const resolvers = {
    Query: {
        messages: () => messages
    },
    Mutation: {
        postMessage: (_, { user, content }) => {
            const id = messages.length
            messages.push({
                id,
                user,
                content
            })
            return id
        }
    },
    Subscription: {
        messages: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('newMessage')
        }
    }
}
// Create your server
const server = createServer({
    
    schema: {
        typeDefs,
        resolvers
    }
})
// start the server and explore http://localhost:4000/graphql
server.start(({port}) => console.log(`Server is running on port ${port}`))



