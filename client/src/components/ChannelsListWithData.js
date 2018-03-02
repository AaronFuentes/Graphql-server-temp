import React from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AddChannel from './AddChannel';

const ChannelsList = ({ data: {loading, error, users, refetch }}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    console.log(error);
  return (
    <div style={{color: 'white'}}>
      <button onClick={() => refetch()}>Refresh</button>
      <p>{error.message}{error.code}
      </p>
    </div>);
  }

  return (
    <div className="channelsList">
      <AddChannel />
      {users.map( ch =>
        (<div key={ch.id} className={'channel ' + (ch.id < 0 ? 'optimistic' : '')}>
          <Link to={ch.id < 0 ? `/` : `channel/${ch.id}`}>
            {ch.name}{ch.id}
          </Link>
        </div>)
      )}
    </div>
  );
};

export const channelsListQuery = gql`
  query Users{
    users{
      name
      id
    }
  }
`;


export default graphql(channelsListQuery, {
    options: (props) => ({
      variables: {
        id: 2,
      }
    }),
  })
(ChannelsList);
