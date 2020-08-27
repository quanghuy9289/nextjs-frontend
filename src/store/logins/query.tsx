/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export const LOGIN_MUTATION = `
  mutation login($input: LoginInput!) {
    login(input: $input) {
      authtoken
      user {
        id
        email
        fullname
      }
    }
  }
`;
