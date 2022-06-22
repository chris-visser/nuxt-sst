import { URLSearchParams } from 'url';
import * as nitro from './index.mjs';

export const handler = async (event) => {
  const request = event.Records[0].cf.request;
  const queryStringParameters = Object.fromEntries(
    new URLSearchParams(request.querystring).entries()
  );

  const response = await nitro.handler({
    path: request.uri,
    queryStringParameters,
    httpMethod: request.method,
    headers: normalizeIncomingHeaders(request.headers),
    body: request.body,
  });
  return {
    status: response.statusCode,
    headers: normalizeOutgoingHeaders(response.headers),
    body: response.body,
  };
};

function normalizeIncomingHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, keyValues]) => [
      key,
      keyValues.map((kv) => kv.value).join(","),
    ])
  );
}
function normalizeOutgoingHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, values]) => [
      key,
      values.split(",").map((value) => ({ value })),
    ])
  );
}