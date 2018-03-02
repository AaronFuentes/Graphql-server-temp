
import { PubSub, withFilter } from 'graphql-subscriptions';
import fetch from 'node-fetch';

const pubsub = new PubSub();

const resolvers = {

  Query: {

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

    companies: async (root, args, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/dashboard/getCompanies`, {
        headers: {
        "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
        "x-jwt-token": context.res.headers["x-jwt-token"]
      }
    });
      const data = await response.json();
      return data.result.data;
    },

    provinces: async (root, { countryID }) => {
        const response = await fetch(`https://beta.councilbox.com/server/api/provinces?where=%7B"country_id":${countryID}%7D`);
        const data = await response.json();
        return data.result.data;
    },

    quorums: async (_, {}, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/quorums_object`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
        }
      });
      const data = await response.json();
      const array = Object.keys(data.result).map(function (key) { return data.result[key]; });
      return array;
    },

    votationTypes: async (_, {}, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/votation_types`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
        }
      });
      const data = await response.json();
      return data.result
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
    },

    councilDetails: async (root, { councilInfo }, context) => {
      try {
        const response = await fetch(`https://beta.councilbox.com/server/api/council?projection=edit-client&where=%7B%22$and%22:%5B%7B%22id%22:%22${councilInfo.councilID}%22%7D,%7B%22company_id%22:%22${councilInfo.companyID}%22%7D,%7B%22$or%22:%5B%7B%22state%22:10%7D,%7B%22state%22:5%7D%5D%7D%5D%7D`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
        });
        const data = await response.json();
        return data.result.data;

      } catch (error) {
        return error;
      }
    },

    councilData: async (root, { councilInfo }, context) => {
      try {
        const response = await fetch(`https://beta.councilbox.com/server/api/live/getData?data=%7B%22council_id%22:%22${councilInfo.councilID}%22%7D`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
        });
        const data = await response.json();
        return data.result.data;

      } catch (error) {
        return error;
      }
    },

    getVideoHTML: async (root, { councilID }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/council/getVideoHtmlCouncil', {
          method: 'POST',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
            "x-jwt-token": context.res.headers["x-jwt-token"]
          },
          body: `id=${councilID}`
        });
        const json = await response.json();
        return json.result.data[0];
      } catch (error) {
        return error;
      }
    },

    liveParticipants: async (root, { councilID }, context) => {
      try {
        const response = await fetch(`https://beta.councilbox.com/server/api/live/sidebar/participants?data=%7B%22council_id%22:${councilID}%7D`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
        });
        const data = await response.json();
        return data.result.data;

      } catch (error) {
        return error;
      }
    },

    liveRecount: async (root, { councilID }, context) => {
      try {
        const response = await fetch(`https://beta.councilbox.com/server/api/live/getRecount?data=%7B%22council_id%22:${councilID}%7D`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
        });
        const data = await response.json();
        return data.result.data;

      } catch (error) {
        return error;
      }
    },

    getComments: async (root, { request }, context) => {
      try {
        const response = await fetch(`https://beta.councilbox.com/server/api/live/getComments?data=%7B%22council_id%22:${request.council_id},%22agenda_id%22:${request.agenda_id},%22limit%22:${request.limit},%22page%22:${request.page}%7D`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
        });
        const data = await response.json();
        return data.result.data;

      } catch (error) {
        return error;
      }
    },

    getVotings: async (root, { request }, context) => {
      try {
        const response = await fetch(`https://beta.councilbox.com/server/api/live/getVotings?data=%7B%22council_id%22:${request.council_id},%22agenda_id%22:${request.agenda_id},%22order_by%22:%7B%22${request.order_by}%22:%22${request.direction}%22%7D,%22limit%22:${request.limit},%22page%22:${request.page}%7D`, {
          method: 'GET',
          headers: {
              "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
              "x-jwt-token": context.res.headers["x-jwt-token"]
          }
        });
        const data = await response.json();
        return data.result.data;

      } catch (error) {
        return error;
      }
    },
  },










  /********************************
   * 
   * 
   * MUTATIONS
   * 
   */



  Mutation: {
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

    sendConvene: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/new/sendConvene', {
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
        const json = response.json();
        return json;
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
        return json;
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

    sendAgendaAttachment: async (root, { data }, context ) => { 
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/live/addAgendaAttachment', {
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

    deleteAgendaAttachment: async (root, { attachment }, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/live/deleteAgendaAttachment?data=%7B%22id%22:${attachment.attachment_id},%22agenda_id%22:${attachment.agenda_id},%22council_id%22:${attachment.council_id}%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        },
      });
      const data = await response.json();
      return data;
    },

    openRoom: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/live/openRoom', {
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

    startCouncil: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/live/startCouncil', {
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

    endCouncil: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/live/endCouncil', {
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

    openDiscussion: async (root, { agenda }, context) => {
    const response = await fetch(`https://beta.councilbox.com/server/api/live/discussAgenda?data=%7B%22id%22:${agenda.id},%22council_id%22:${agenda.council_id},%22point_state%22:${agenda.point_state},%22date_start%22:%22${agenda.date_start}%22%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        },
      });
      const data = await response.json();
      return data;
    },

    closeAgenda: async (root, { agenda }, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/live/closeAgenda?data=%7B%22id%22:${agenda.id},%22council_id%22:${agenda.council_id},%22point_state%22:${agenda.point_state},%22date_end%22:%22${agenda.date_end}%22%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        },
      });
      const data = await response.json();
      return data;
    },

    openVoting: async (root, { agenda }, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/live/sendAgenda?data=%7B%22id%22:${agenda.id},%22council_id%22:${agenda.council_id},%22subject_type%22:${agenda.subject_type},%22voting_state%22:${agenda.voting_state},%22date_start_votation%22:%22${agenda.date_start_votation}%22,%22send_points_mode%22:${agenda.send_points_mode},%22notify_points%22:${agenda.notify_points},%22language%22:%22${agenda.language}%22%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        },
      });
      const data = await response.json();
      return data;
    },

    closeVoting: async (root, { agenda }, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/live/closeAgendaVotations?data=%7B%22id%22:${agenda.id},%22council_id%22:${agenda.council_id},%22subject_type%22:${agenda.subject_type},%22voting_state%22:${agenda.voting_state}%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        },
      });
      const data = await response.json();
      return data;
    },
    
    addAgenda: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/live/addAgenda', {
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

    updateOrder: async (root, { data }, context ) => {
      try {
        const response = await fetch('https://beta.councilbox.com/server/api/agendas/updateOrder', {
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
    
    changeRequestWord: async (root, { wordState }, context) => {
      const response = await fetch(`https://beta.councilbox.com/server/api/live/sidebar/changeRequestWord?data=%7B%22id%22:${wordState.id},%22council_id%22:${wordState.council_id},%22request_word%22:${wordState.request_word}%7D`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${context.res.headers["x-jwt-token"]}`,
          "x-jwt-token": context.res.headers["x-jwt-token"]
        },
      });
      const data = await response.json();
      return data;
    },
  }
}

export default resolvers;