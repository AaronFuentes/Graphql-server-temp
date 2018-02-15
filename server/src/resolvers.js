
import { PubSub, withFilter } from 'graphql-subscriptions';
import fetch from 'node-fetch';

const pubsub = new PubSub();
let messageCreatedAt = 123456789;

let channels = [
  {
    id: '1',
    name: 'Netflix',
    messages: [
      {
        id: '1',
        text: 'Stranger Things',
        createdAt: 1231231
      },
      {
        id: '2',
        text: 'Dark',
        createdAt: 1231233
      },
      {
        id: '3',
        text: 'The Punisher',
        createdAt: 12777887
      }
    ]
  },
  {
    id: '2',
    name: 'Amazon',
    messages: [
      {
        id: '4',
        text: 'Jean Claude Van Johnson'
      },
      {
        id: '5',
        text: 'Man in the high castle'
      }
    ]
  },
];

let users = [
  {
    username: 'aaron',
    password: 'abc123'
  },
  {
    username: 'miguel',
    password: 'miguel'
  },
  {
    username: 'jose',
    password: 'dimitri'
  }
];

let nextID = 5;

const resolvers = {

  Query: {
    channels: () => {
      return channels;
    },

    channel: (root, { id }) => {
      return channels.find(channel => channel.id === id);
    },

    languages: async () => {
      const response = await fetch('https://beta.councilbox.com/server/api/languages');
      const data = await response.json();
      return data.result.data;
    },

    countries: async () => {
        const response = await fetch(`https://beta.councilbox.com/server/api/countries`);
        const data = await response.json();
        return data.result.data;
    },

    provinces: async (root, { countryID }) => {
        const response = await fetch(`https://beta.councilbox.com/server/api/provinces?where=%7B"country_id":${countryID}%7D`);
        const data = await response.json();
        return data.result.data;
    },

    councils: async (root, { companyID, isMeeting, type }, context) => {
      if(!context.res.headers["x-jwt-token"]){
        return Error("No token authorization provided");
      }
      const response = await fetch(`https://beta.councilbox.com/server/api/dashboard/getCouncils?data=%7B%22company_id%22:%22${companyID}%22,%22view%22:%22${type}%22,%22isMeeting%22:${isMeeting}%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        }
      });
      const data = await response.json();
      return data.result.data;
    },

    majorities: async (_, args, context) => {
      if(!context.res.headers["x-jwt-token"]){
        return Error("No token authorization provided");
      }
      const response = await fetch(`https://beta.councilbox.com/server/api/majorities`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
      });
      const data = await response.json();
      return data.result;
    },

    companyTypes: async () => {
      const response = await fetch(`https://beta.councilbox.com/server/api/company_types`);
      const data = await response.json();
      return data.result;
    },

    council: async (root, { councilInfo }, context ) => {
      try{
        const response = await fetch(`https://beta.councilbox.com/server/api/new/getData?data=%7B%22company_id%22:%22${councilInfo.companyID}%22,%22council_id%22:%22${councilInfo.councilID}%22,%22step%22:%22${councilInfo.step}%22%7D`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: data
        });
        const data = await response.json();
        return data.result.data;
      }catch (error){
        return error;
      }
    },

    participants: async (root, { councilID }, context ) => {
      try{
        const response = await fetch(`https://beta.councilbox.com/server/api/new/getParticipants?data=%7B%22council_id%22:%22${councilID}%22,%22order_by%22:%7B%22name%22:%22+ASC%22%7D,%22limit%22:25,%22page%22:1%7D`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: data
        });
        const data = await response.json();
        return data.result.data;
      }catch (error){
        return error;
      }
    }
  },

  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: channels.length + 1, name: args.name };
      channels.push(newChannel);
      return newChannel;
    },

    addMessage: (root, { message }) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if (!channel) {
        throw new Error("Channel does not exist");
      }

      const newMessage = { id: String(nextID++), text: message.text };
      channel.messages.push(newMessage);

      pubsub.publish('messageAdded', {
        messageAdded: newMessage,
        channelId: message.channelId
      });
      return newMessage;
    },
    login: async (root, { creds }) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/login?where=%7B"user":"${creds.user}","password":"${creds.password}"%7D`);
      const data = await response.json();
      return data.token;
    },

    saveCouncil: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/new/saveData', {
          method: 'POST',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: data
        });
        const json = response.json();
        return json;
      } catch (error) {
        return error;
      }
    },

    updateCouncil: async (root, { data }, context) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/councils', {
          method: 'POST',
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: data
        });
        return response;
        //const result = await response.json();
      } catch (error) {
        return error;
      }
    },

    changeCensus: async (root, { info }, context ) => {
      try {
        const response = await fetch(`https://beta.councilbox.com/server/api/new/changeCensus?data=%7B%22council_id%22:%22${info.councilID}%22,%22census_id%22:%22${info.censusID}%22,%22company_id%22:%22${info.companyID}%22%7D`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
        });
        const data = await response.json();
        return data;

      } catch (error) {
        return error;
      }
    },

    deleteParticipant: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/new/deleteParticipant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: data
        });
        const json = await response.json();
        return json;
      } catch (error) {
        return error;
      }
    },

    addParticipant: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/new/saveParticipant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: data
        });
        const json = await response.json();
        return json;
      } catch (error) {

        return error;
      }
    },

    saveAttachment: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/new/saveAttachment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: data
        });
        const json = await response.json();
        return response;
      } catch (error) {
        return error;
      }
    },

    deleteAttachment: async (root, { attachment }, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/new/deleteAttachment?data=%7B%22council_id%22:%22${attachment.council_id}%22,%22attachment_id%22:%22${attachment.attachment_id}%22%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        },
      });
      const data = await response.json();
      return data;
    },
  },

  Channel: {
    messageFeed: (channel, { cursor }) => {
      if (!cursor) {
        cursor =
          channel.messages[channel.messages.length - 1].createdAt;
      }

      cursor = parseInt(cursor);
      const limit = 10;

      const newestMessageIndex = channel.messages.findIndex(
        message => message.createdAt === cursor
      ); 
      const newCursor = channel.messages[newestMessageIndex - limit].createdAt;

      const messageFeed = {
        messages: channel.messages.slice(
          newestMessageIndex - limit,
          newestMessageIndex
        ),
        cursor: newCursor,
      };

      return messageFeed;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          return payload.channelId === variables.channelId;
        }
      )
    }
  }
}

export default resolvers;