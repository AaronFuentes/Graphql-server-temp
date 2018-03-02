import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  languages: [Language]
  majorities: [Majority]
  companyTypes: [CompanyType]
  quorums: [String]
  votationTypes: [Votation]
  countries: [Country]
  provinces(countryID: ID!): [Province]
  councils(companyID: ID!, type: String, isMeeting: Boolean): [Council]
  council(councilInfo: CouncilInfo) : CouncilData
  councilDetails(councilInfo: CouncilInfo) : CouncilDetails
  councilData(councilInfo: CouncilInfo) : CouncilDetails
  participants(councilID: ID!): [Participant]
  getVideoHTML(councilID: ID!): VideoInfo
  liveParticipants(councilID: ID!): [LiveParticipant]
  liveRecount(councilID: ID!): [Recount]
  getComments(request: Request): [Comment]
  getVotings(request: Request): [Voting]
  companies: [Company]
}

type Mutation {
  login(creds : Credentials) : String
  updateCouncil(data : String) : String
  saveCouncil(data : String) : Response
  sendConvene(data: String!) : Response
  changeCensus(info: CensusInfo) : String
  addParticipant(data: String!) : Response
  deleteParticipant(data: String!) : Response
  saveAttachment(data: String!) : Response
  deleteAttachment(attachment: AttachmentInfo) : Response
  sendAgendaAttachment(data: String!) : Response
  deleteAgendaAttachment(attachment: AttachmentInfo) : Response
  openRoom(data: String!) : Response
  startCouncil(data: String!) : Response
  endCouncil(data: String!) : Response
  openDiscussion(agenda: AgendaInfo) : Response
  closeAgenda(agenda: AgendaInfo) : Response
  openVoting(agenda: AgendaInfo): Response
  closeVoting(agenda: AgendaInfo): Response
  addAgenda(data: String!): Response
  updateOrder(data: String!): Response
  changeRequestWord(wordState: WordState): Response
}

input CouncilInfo {
  companyID: ID!
  councilID: ID!
  step: Int
}

input WordState {
  id: ID
  council_id: ID
  request_word: Int
}

input AgendaInfo {
  id: ID!
  council_id: ID
  date_start: String
  date_end: String
  point_state: Int
  date_start_votation: String
  language: String
  voting_state: Int
  notify_points: Int
  send_points_mode: Int
  subject_type: Int
}

type Company {
  address: String
  alias: String
  business_name: String
  city: String
  country: String
  country_state: String
  creator_id: ID
  demo: Int
  domain: String
  id: ID
  language: String
  link_key: String
  logo: String
  tin: String
  type: Int
  zipcode: String
}


input CensusInfo {
  companyID: ID!
  councilID: ID!
  censusID: ID!
}

input AttachmentInfo {
  attachment_id: ID!
  council_id: ID!
  agenda_id: ID
}

type Attachment{
  council_id: ID!
  filename: String
  filesize: String
  filetype: String
  id: ID!
}

type Votation {
  value: Int
  label: String
}

type VideoInfo{
  council_id: ID
  html_video_council: String
  html_video_participant: String
  id: ID
  video_link: String
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

type CouncilDetails {
  active: Int
  agenda_attachments: [AgendaAttachment]
  agendas: [Agenda]
  approve_act_draft: Int
  attachments: [Attachment]
  business_name: String
  city: String
  company_id: Int
  confirm_assistance: Int
  convene_text: String
  council_started: Int
  council_type: Int
  country: String
  country_state: String
  current_quorum: Int
  date_end: String
  date_open_room: String
  date_real_start: String
  date_start: String
  date_start_2nd_call: String
  duration: String
  email_text: String
  first_or_second_convene: Int
  full_video_record: Int
  has_limit_date: Int
  header_logo: String
  id: ID
  language: String
  limit_date_response: String
  name: String
  needed_quorum: Int
  no_celebrate_comment: String
  president: String
  proposed_act_sent: Int
  prototype: Int
  quorum_prototype: Int
  satisfy_quorum: Int
  secretary: String
  security_key: String
  security_type: Int
  selected_census_id: ID
  send_date: String
  send_points_mode: Int
  shortname: String
  state: Int
  statutes: [Statute]
  street: String
  tin: String
  video_emails_date: String
  video_mode: Int
  video_recoding_initialized: Int
  votation_type: Int
  weighted_voting: Int
  zipcode: String
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
  blocked: Int
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
  data: String
  msg: String
}

type Recount {
  council_id: Int
  num_current_remote: Int
  num_no_participate: Int
  num_present: Int
  num_remote: Int
  num_right_voting: Int
  num_total: Int
  part_current_remote: Int
  part_no_participate: Int
  part_present: Int
  part_remote: Int
  part_right_voting: Int
  part_total: Int
  social_capital_current_remote: Int
  social_capital_no_participate: Int
  social_capital_present: Int
  social_capital_remote: Int
  social_capital_right_voting: Int
  social_capital_total: Int
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

type AgendaAttachment {
  agenda_id: ID!
  council_id: ID
  filename: String
  filesize: String  
  filetype: String
  id: ID
  state: Int

}

type Statute {
  id: Int
  prototype: Int
  council_id: Int
  statute_id: Int
  title: String
  exist_public_url: Int
  add_participants_list_to_act: Int
  exists_advance_notice_days: Int
  advance_notice_days: Float
  exists_second_call: Int
  minimum_separation_between_call: Float
  can_edit_convene: Int
  first_call_quorum_type: Int
  first_call_quorum: Int
  first_call_quorum_divider: Float
  second_call_quorum_type: Int
  second_call_quorum: Int
  second_call_quorum_divider: Float
  exists_delegated_vote: Int
  delegated_vote_way: Int
  exist_max_num_delegated_votes: Int
  max_num_delegated_votes: Int
  exists_limited_access_room: Int
  limited_access_room_minutes: Int
  exists_quality_vote: Int
  quality_vote_option: Int
  can_unblock: Int
  can_add_points: Int
  who_can_vote: Int
  can_reorder_points: Int
  exists_act: Int
  exists_who_was_sent_act: Int
  who_was_sent_act_way: Int
  who_was_sent_act: String
  exists_who_sign_the_act: String
  included_in_act_book: Int
  include_participants_list: Int
  exists_comments: Int
  convene_header: String
  intro: String
  constitution: String
  conclusion: String
  act_template: String
  census_id: Int
}

type LiveParticipant {
    id: Int
    participant_id: Int
    council_id: Int
    name: String
    surname: String
    position: String
    email: String
    phone: String
    dni: String
    date: String
    type: Int
    online: Int
    delegate_id: Int
    state: Int
    audio: Boolean
    video: Boolean
    request_word: Int
    num_participations: Int
    social_capital: Int
    uuid: String
    delegate_uuid: String
    assistance_comment: String
    assistance_last_date_confirmed: String
    assistance_intention: Int
    video_password: String
    blocked: Int
    council_prototype: Int
    council_video_mode: Int
    last_date_connection: String
    video_mode: Int
    first_login_date: String
    first_login_current_point_id: Int
    language: String
    signed: Int
    address: String
    real_position: Int
    city: String
    country: String
    country_state: String
    zipcode: String
    person_or_entity: Int
    actived: Int
}

type Voting {
  agenda_id: ID
  be_on_record: Int
  cfs_code: Int
  code: Int
  comment: String
  council_id: ID
  date: String
  delegate_email: String
  delegate_id: ID
  delegate_name: String
  delegate_position: String
  delegate_surname: String
  email: String
  id: ID
  name: String
  num_participations: Int
  participant_email: String
  participant_id: ID
  position: String
  present_vote: Int
  req_code: String
  req_text: String
  state: Int
  subject_type: Int
  surname: String
  vote: Int
}

input Request {
  council_id: ID
  agenda_id: ID
  page: Int
  limit: Int
  order_by: String
  direction: String

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
  quality_vote_sense: Int
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

type Comment {
  agenda_id: Int
  be_on_record: Int
  cfs_code: Int
  code: Int
  comment: String
  council_id: ID
  date: String
  delegate_email: String
  delegate_id: ID
  delegate_name: String
  delegate_position: String
  delegate_surname: String
  email: String
  id: ID
  name: String
  num_participations: Int
  participant_email: String
  participant_id: ID
  position: String
  present_vote: Int
  req_code: Int
  req_text: String
  state: Int
  subject_type: Int
  surname: String
  vote: Int
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
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };