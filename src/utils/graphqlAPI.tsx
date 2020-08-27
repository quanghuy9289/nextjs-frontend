/*!
 * Copyright 2020 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { GraphQLClient, rawRequest } from "graphql-request";
import { GraphQLError } from "graphql-request/dist/src/types";
import cookie from "js-cookie";
import { CONST_COOKIE_AUTHENTICATION_TOKEN } from "./constants";

interface IGraphqlResponse {
  data?: any;
  extensions?: any;
  headers: Headers;
  status: number;
  errors?: GraphQLError[] | undefined;
}
const getAuthToken = () => cookie.get(CONST_COOKIE_AUTHENTICATION_TOKEN);

export async function graphqlRequest(query: string, url: string, path: string, variable?: any) {
  const res: IGraphqlResponse = await rawRequest(url + path, query, variable);

  return processResponse(res);
}

export async function graphqlRequestWithAuthToken(query: string, url: string, path: string, variable?: any) {
  const graphQLClient = new GraphQLClient(url + path, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const res: IGraphqlResponse = await graphQLClient.rawRequest(query, variable);

  return processResponse(res);
}

function processResponse(res: IGraphqlResponse) {
  if (res.status === 200) {
    return res.data;
  } else if (res.status === 401) {
    // Unauthorized
    console.log("Unauthorized");
    return {
      isUnauthorized: true,
      errors: "Unauthorized",
    };
  }

  return {};
}
