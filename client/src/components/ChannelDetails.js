import React, { Component } from 'react';
import MessageList from './MessageList';
import ChannelPreview from './ChannelPreview';
import NotFound from './NotFound';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


class ChannelDetails extends Component {
  componentWillMount() {
    this.props.subscribeToNewMessages({
      channelId: this.props.match.params.channelId,
    });
  }

  render() {
    const { data: {loading, error, channel }, match, loadOlderMessages } = this.props;
    /*if (loading) {
      return <ChannelPreview channelId={match.params.channelId}/>;
    }*/
    if (loading){
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if(channel === null){
      return <NotFound />
    }
    return (
      <div>
        <div className="channelName">
          {channel.name}
        </div>
        <MessageList messages={channel.messages}/>
      </div>
    );
  }
}

export const channelDetailsQuery = gql`
  query ChannelDetailsQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      messages{
        text
      }
    }
  }
`;

const messages_subscription = gql`
  subscription messageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      text
    }
  }
`

export default (graphql(channelDetailsQuery, {
  options: (props) => ({
    variables: {
      channelId: props.match.params.channelId,
    }
  }),

  props : props => {
    return {
      ...props,
      subscribeToNewMessages: params => {
        return props.data.subscribeToMore({
            document: messages_subscription,
            variables: {
              channelId: params.channelId
            },
            updateQuery: (prev, {subscriptionData}) => {
              if (!subscriptionData.data) {
                return prev;
              }
              const newFeedItem = subscriptionData.data.messageAdded;
              console.log(prev);
              return {
                ...prev,
                channel: {
                  ...prev.channel,
                  messages: [
                    ...prev.channel.messages,
                    newFeedItem
                  ]
                }
              }
            }
          });
      }
    };
  },
})(ChannelDetails));
