import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  channels: [Channel]
  channel(id: ID!): Channel
  languages: [Language]
  majorities: [Majority]
  companyTypes: [CompanyType]
  countries: [Country]
  provinces(countryID: ID!): [Province]
  councils(companyID: ID!, type: String, isMeeting: Boolean): [Council]
  council(councilInfo: CouncilInfo) : CouncilData
  participants(councilID: ID!): [Participant]
}

type Mutation {
  addChannel(name: String!): Channel
  addMessage(message: MessageInput!): Message
  login(creds : Credentials) : String
  updateCouncil(data : String) : String
  saveCouncil(data : String) : Response
  changeCensus(info: CensusInfo) : String
  addParticipant(data: String!) : Response
  deleteParticipant(data: String!) : Response
  saveAttachment(data: String!) : Response
  deleteAttachment(attachment: AttachmentInfo) : Response
}

input CouncilInfo {
  companyID: ID!
  councilID: ID!
  step: Int
}

input CensusInfo {
  companyID: ID!
  councilID: ID!
  censusID: ID!
}

input AttachmentInfo {
  attachment_id: ID!
  council_id: ID!
}

type Attachment{
  council_id: ID!
  filename: String
  filesize: String
  filetype: String
  id: ID!
}

type CompanyType {
  label: String
  value: Int
}

type CouncilData {
  council: Council
  censuses: [Census]
  agendas: [Agenda]
  attachments: [Attachment]
  num_participations: Int
  previewHtml: String
  social_capital: Int
  statute: Statute
  platforms: Platform
}

type Council {
  id: ID!
  company_id: ID!
  business_name: String
  tin: String
  name: String
  shorname: String
  date_start: String
  date_start_2nd_call: String
  date_real_start: String
  country: String
  country_state: String
  city: String
  zipcode: String
  header_logo: String
  convene_text: String
  convene_send_date: String
  send_date: String
  signature: String
  state: Int
  date_end: String
  street: String
  email_text: String
  duration: String
  weighted_voting: Int
  council_type: Int
  limit_date_response: String
  security_type: Int
  security_key: String
  votation_type: Int
  send_points_mode: Int
  has_limit_date: Int
  full_video_record: Int
  quorum_prototype: Int
  prototype: Int
  video_emails_date: String
  approve_act_draft: Int
  confirm_assistance: Int
  selected_census_id: Int
  video_mode: Int
  active: Int
  video_recoding_initialized: Int
  council_started: Int
  date_open_room: String
  first_or_second_convene: Int
  needed_quorum: Int
  current_quorum: Int
  satisfy_quorum: Int
  no_celebrate_comment: String
  open_room_type: Int
  president: String
  secretary: String
  proposed_act_sent: String
  logo: String
  step: Int
  act_point_majority_type: Int
  act_point_majority: Float
  act_point_majority_divider: Float
  act_point_quorum_type: Int
  act_point_quorum: Float
  act_point_quorum_divider: Float
  remote_celebration: Int
  creator_id: Int
  convene_user_id: Int
  send_act_date: String
  video_recording: Int
  auto_close: Int
  close_date: String
  preconvene_user_id: Int
  preconvene_send_date: String
}

type Participant {
  id: ID!
  council_id: ID!
  name: String
  surname: String
  position: String
  email: String
  phone: String
  dni: String
  date: String
  type: Int
  delegate_id: Int
  num_participations: Int
  social_capital: Int
  uuid: Int
  delegate_uuid: String
  video_password: String
  real_position: Int
  language: String
  address: String
  city: String
  country: String
  country_state: String
  zipcode: String
  person_or_entity: Int
  actived: Int
}

type Census {
  id: ID
  company_id: ID
  census_name : String
  census_description: String
  default_census: Int
  quorum_prototype: Int
  creator_id: Int
  creation_date: Int
  last_edit: String
  state: Int
}


type Response {
  code: Int
  msg: String
}

type Platform {
  act: Int
  company_id: ID
  council_id: ID
  emails: Int
  id: ID
  room: Int
  room_access: Int
  security_email: Int
  security_sms: Int
  signature: Int
  video: Int
}

type Statute {
  id: Int
  prototype: Int
  council_id: ID
  statute_id: ID
  title: String
  exist_public_url: Int
  exists_advance_notice_days: Int
  advance_notice_days: Float
  exists_second_call: Int
  minimum_separation_between_call: Float
  can_unblock: Int
  can_add_points: Int
  who_can_vote: Int
  can_reorder_points: Int
  exists_act: Int
  convene_header: String
  census_id: ID
  can_edit_convene: Int
}

type Agenda {
  id: ID!
  council_id: ID!
  agenda_subject: String
  subject_type: Int
  description: String
  date_start: String
  date_end: String
  date_start_votation: String
  date_end_votation: String
  positive_votings: Int
  num_positive_votings: Int
  negative_votings: Int
  num_negative_votings: Int
  abstention_votings: Int
  num_abstention_votings: Int
  no_vote_votings: Int
  num_no_vote_votings: Int
  total_votings: Int
  num_total_votings: Int
  positive_manual: Int
  num_positive_manual: Int
  negative_manual: Int
  num_negative_manual: Int
  abstention_manual: Int
  num_abstention_manual: Int
  no_vote_manual: Int
  num_no_vote_manual: Int
  total_manual: Int
  num_total_manual: Int
  comment: String
  present_census: Int
  num_present_census: Int
  social_capital_present: Int
  remote_census: Int
  num_remote_census: Int
  social_capital_remote: Int
  current_remote_census: Int
  num_current_remote_census: Int
  social_capital_current_remote: Int
  no_participate_census: Int
  num_no_participate_census: Int
  social_capital_no_participate: Int
  majority_type: Int
  majority: Float
  majority_divider: Int
  order_index: Int
  point_state: Int
  voting_state: Int
  sortable: Int
}


type Country {
  deno: String
  id: ID!
}

type Province {
  deno: String
  id: ID!
}

type Majority {
  label: String
  value: Int
}

type Language {
  desc: String
  column_name: String
  id: ID!
}

input Credentials {
  user: String!
  password: String!
}

type MessageFeed {
  cursor: String!
  messages: [Message]!
}

type Subscription {
  messageAdded(channelId: ID!): Message
}

type Channel {
  id: ID!
  name: String
  messages: [Message]!
  messageFeed(cursor: String): MessageFeed
}

type Message {
  id: ID!
  text: String
  createdAt: Int
}

input MessageInput {
  channelId: ID!
  text: String
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };