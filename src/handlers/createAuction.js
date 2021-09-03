import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  /* httpJsonBodyParser will automatically pass our string defined event body, so we don't have to do that every time with just result in cleaner code.
  const { title } = JSON.parse( event.body )
  */
  const { title } = event.body
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  }

  try {
    await dynamoDB.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch ( error ) {
    console.error( error )
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify( auction ),
  };
}

export const handler = middy( createAuction )
  .use( httpJsonBodyParser() )
  .use( httpEventNormalizer() )
  .use( httpErrorHandler() )

/* httpEventNormalizer will automatically adjust the API gateway event objects to prevent us from accidentally having a nonexisting object
when trying to access path parameters or query parameters and they're not provided just will save us from room for error.
*/

/* httpErrorHandler help make handling error process smooth, easy and clean */
