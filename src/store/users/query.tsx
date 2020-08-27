/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export const GET_USERS = `
  query getUser($input: QueryUser!) {
    users(input: $input) {
      count
      list {
        id
        email
        fullname
        nickname
        avatarBase64
      }
    }
  }
`;

export const CREATE_USER = `
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      email
      fullname
      nickname
    }
  }
`;

export const UPDATE_USER = `
  mutation updateUser($id: ID!, $input: UserInfo!) {
    updateUser(id: $id, input: $input) {
      id
      email
      phoneNumber
      fullname
      nickname
      avatarBase64
    }
  }
`;

export const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;
