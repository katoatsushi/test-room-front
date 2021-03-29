export interface ITokenHeaders {
  ['content-type']: string;
  ['access-token']: string;
  client: string;
  uid: string;
}
export interface IHeaders {
  ['content-type']: string;
  ['access-token']: string;
  ['client']:       string;
  ['uid']:          string;
}

export interface ICustomerData {
  customer: ICustomer;
  customer_info: ICustomerInfo;
  customer_status: ICustomerStatus;
}

export interface ICustomer {
  ['allow_password_change']?: false;
  id: number;
  email: string;
  company_id: number;
  first_name_kana: string;
  last_name_kana: string;
  first_name_kanji: string;
  last_name_kanji: string;
}

export interface ICustomerInfo {
  id: integer;
  age: integer;
  birthday: string;
  avatar_url: string;
  customer_id: integer;
  phone_number: string;
  emergency_phone_number: string;
  gender: string;
  job_id: integer;
  job_name: string;
  postal_code: string;
  address: string;
}

export interface ICustomerStatus {
  paid: boolean;
  room_plus: boolean;
  dozen_sessions: boolean;
  numbers_of_contractnt: boolean;
}
export interface ICustomerInterests {
  interests: IInterests
}
export interface IInterests {
  id: integer;
  name: string;
  interest_family_id: integer;
}

export interface ITrainer {
  ['allow_password_change']?: false;
  email: string;
  id: number;
  company_id: number;
  first_name_kana: string;
  first_name_kanji: string;
  last_name_kana: string;
  last_name_kanji: string;
}

export interface ITrainerInfo {
  id: integer;
  avatar_url: string;
  created_at: string;
  first_name: string;
  first_name_kana: string;
  gender: string;
  last_name: string;
  last_name_kana: string;
  trainer_id: integer;
}

export interface IAdmin {
  ['allow_password_change']?: false;
  email: string;
  id: number;
  company_id: number;
  uid: string;
}
export interface ISignInFormValues {
  email: string;
  password: string;
}
export interface ISignInSuccessResponse {
  data: ICustomer;
  message: string;
}
export interface IErrorResponse {
  errors: string[];
}
export interface IServerMessages {
  severity: 'success' | 'error';
  alerts: string[];
}

export interface ICustomerRecords {
    data: ICustomerRecord[];
    message: string;
}
export interface ICustomerRecord {
  id: number;
  trainer_id: number;
  apo_time: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  min: string;
  menues: ICustomerRecordMenu[];
}
export interface ICustomerRecordMenu {
  time: number;
  set_num: number;
  fitness_name: string;
  fitness_third_name: string;
  detail: string;
}