import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

export default handler => middy( handler )
  .use( [
    httpJsonBodyParser(),
    httpEventNormalizer(),
    httpErrorHandler(),
] )

/* httpJsonBodyParser will automatically pass our string defined event body, so we don't have to do that every time with just result in cleaner code.
use const { title } = event.body , not const { title } = JSON.parse( event.body )
*/

/* httpEventNormalizer will automatically adjust the API gateway event objects to prevent us from accidentally having a nonexisting object
when trying to access path parameters or query parameters and they're not provided just will save us from room for error.
*/

/* httpErrorHandler help make handling error process smooth, easy and clean */
