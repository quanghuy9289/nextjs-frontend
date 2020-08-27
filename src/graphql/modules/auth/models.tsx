/* tslint disabled */
export type Maybe<T> = T | null;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export interface LoginResult {
   __typename?: 'LoginResult';
  token: Scalars['String'];
  user: UserOutput;
}

export interface Mutation {
   __typename?: 'Mutation';
  register: RegisterResult;
  login: LoginResult;
}


export type MutationRegisterArgs = {
  input: UserInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};

export interface Query {
   __typename?: 'Query';
  sampleAuth: Scalars['Boolean'];
}


export type QuerySampleAuthArgs = {
  input: Scalars['String'];
};

export interface RegisterResult {
   __typename?: 'RegisterResult';
  id: Scalars['ID'];
  email: Scalars['String'];
}

export type UserInput = {
  email: Scalars['String'];
  fullname: Scalars['String'];
  nickname: Scalars['String'];
  password: Scalars['String'];
  avatarBase64: Scalars['String'];
  roleID: Scalars['String'];
};

export interface UserOutput {
   __typename?: 'UserOutput';
  id: Scalars['ID'];
  email: Scalars['String'];
  phoneNumber: Scalars['String'];
  fullname: Scalars['String'];
  nickname: Scalars['String'];
  avatarBase64: Scalars['String'];
  roleID: Scalars['String'];
  startDate?: Maybe<Scalars['Int']>;
  minDailyUnitPointsRequirement?: Maybe<Scalars['Float']>;
  standardNumberOfWorkingDaysPerWeek?: Maybe<Scalars['Float']>;
  config: Scalars['String'];
}

