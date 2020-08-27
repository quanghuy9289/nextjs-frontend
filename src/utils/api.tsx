/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export async function callApi(method: string, url: string, path: string, data?: any) {
  const res = await fetch(url + "/v1" + path, {
    method,
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return processResponse(res);
}

export async function callApiWithAuthToken(method: string, url: string, path: string, authtoken: string, data?: any) {
  const res = await fetch(url + "/v1" + path, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: authtoken,
    },
    body: JSON.stringify(data),
  });

  return processResponse(res);
}

function processResponse(res: Response) {
  if (res.status === 200) {
    return res.json();
  } else if (res.status === 401) {
    // Unauthorized
    console.log("Unauthorized");
    return {
      isUnauthorized: true,
      errors: "Unauthorized",
    };
  }

  return {

  };
}
