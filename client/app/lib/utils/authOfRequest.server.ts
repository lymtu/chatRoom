export const isOrigin = (request: Request) => {
  return request.headers.get("sec-fetch-site") == "same-origin";
};
