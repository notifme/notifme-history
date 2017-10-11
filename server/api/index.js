/* global Router */
import {ApiKeys, SCOPES} from '../../models/apikey'

export function post (route, handler) {
  Router.route(route, {where: 'server'}).post(function () {
    handle(this.request, this.response, handler, SCOPES.write)
  })
}

export function throwError (code, message, extraInfo = {}) {
  const error = new Error(message)
  error.code = code
  error.extraInfo = extraInfo
  throw error
}

export function throwFormError (error) {
  if (error.error === 'validation-error') {
    throwError(400, error.message, {errors: error.details})
  } else {
    throw error
  }
}

async function handle (request, response, handler, scope) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept')
    response.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS')
    response.end('Set OPTIONS.')
  } else {
    try {
      response.setHeader('Content-Type', 'application/json')
      const apiKey = await checkApiKey(request)
      await checkAuthorization(apiKey, scope)

      const jsonResponse = await handler(request, response)
      response.statusCode = 200
      response.end(JSON.stringify(jsonResponse))
    } catch (error) {
      console.error(error)
      response.statusCode = error.code || 500
      response.end(JSON.stringify({
        error: error.code ? error.message : 'An unexpected error occurred.',
        ...error.extraInfo
      }))
    }
  }
}

const apiKeys = {}
function getApiKey (token) {
  if (!apiKeys[token]) {
    apiKeys[token] = ApiKeys.findOne({token})
  }
  return apiKeys[token]
}

async function checkApiKey (request) {
  if (request.headers.authorization) {
    const apiKey = await getApiKey(request.headers.authorization)
    return apiKey || throwError(401, 'Invalid API key.')
  } else {
    throwError(401, 'Missing API key in "Authorization" header.')
  }
}

async function checkAuthorization (apiKey, scope) {
  if (!apiKey.scopes.includes(scope)) {
    throwError(403, `This API key doesn't have the "${scope}" scope.`)
  }
}
