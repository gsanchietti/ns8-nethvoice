/**
 * Provides the HTTP server for all services.
 *
 * @module http_proxy
 * @main http_proxy
 */

/**
 * Provides the HTTP proxy server.
 *
 * @class http_proxy
 */
var fs = require('fs');
var http = require('http');
var httpProxy = require('http-proxy');
var httpProxyRules = require('http-proxy-rules');

/**
 * The module identifier used by the logger.
 *
 * @property IDLOG
 * @type string
 * @private
 * @final
 * @readOnly
 * @default [http_proxy]
 */
var IDLOG = '[http_proxy]';

/**
 * The logger. It must have at least three methods: _info, warn and error._
 *
 * @property logger
 * @type object
 * @private
 * @default console
 */
var logger = console;

/**
 * The authentication architect component.
 *
 * @property compAuthentication
 * @type object
 * @private
 */
var compAuthentication;

/**
 * The authorization component.
 *
 * @property compAuthorization
 * @type object
 * @private
 */
let compAuthorization;

/**
 * The asterisk proxy architect component.
 *
 * @property compAstProxy
 * @type object
 * @private
 */
var compAstProxy;

/**
 * The user module.
 *
 * @property compUser
 * @type object
 * @private
 */
var compUser;

/**
 * The utility architect component.
 *
 * @property compUtil
 * @type object
 * @private
 */
var compUtil;

/**
 * Listening port of the HTTP proxy server. It can be
 * customized in the configuration file.
 *
 * @property port
 * @type string
 * @private
 */
var port;

/**
 * Listening address of the HTTP proxy server.
 *
 * @property address
 * @type string
 * @private
 * @final
 * @readOnly
 * @default "localhost"
 */
var address = 'localhost';

/**
 * The HTTP server to be used with proxy.
 *
 * @property httpServer
 * @type object
 * @private
 */
var httpServer;

/**
 * The routing of the HTTP proxy. It's initialized by the _config_ method.
 * It must be customized in the configuration file.
 *
 * @property router
 * @type object
 * @default {}
 * @private
 */
var router = {};

/**
 * Set the logger to be used.
 *
 * @method setLogger
 * @param {object} log The logger object. It must have at least
 * three methods: _info, warn and error_ as console object.
 * @static
 */
function setLogger(log) {
  try {
    if (typeof log === 'object' && typeof log.log.info === 'function' &&
      typeof log.log.warn === 'function' && typeof log.log.error === 'function') {

      logger = log;
      logger.log.info(IDLOG, 'new logger has been set');

    } else {
      throw new Error('wrong logger object');
    }
  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

/**
 * Configure the HTTP proxy properties and the router url mappings.
 * The file must use the JSON syntax.
 *
 * **The method can throw an Exception.**
 *
 * @method config
 * @param {string} path The path of the configuration file
 */
function config(path) {
  if (typeof path !== 'string') {
    throw new TypeError('wrong parameter');
  }
  if (!fs.existsSync(path)) {
    throw new Error(path + ' does not exist');
  }
  let json = (JSON.parse(fs.readFileSync(path, 'utf8')));

  if (json.http_proxy.router) {
    router = json.http_proxy.router;
  } else {
    logger.log.warn(IDLOG, 'wrong ' + path + ': no "router" key into "http_proxy"');
  }

  if (json.http_proxy.http_port) {
    port = json.http_proxy.http_port;
  } else {
    logger.log.warn(IDLOG, 'wrong ' + path + ': no "http_port" key into "http_proxy"');
  }
  logger.log.info(IDLOG, 'configuration done by ' + path);
}

/**
 * Sets the authentication architect component.
 *
 * @method setCompAuthentication
 * @param {object} comp The authentication architect component.
 */
function setCompAuthentication(comp) {
  try {
    compAuthentication = comp;
    logger.log.info(IDLOG, 'set authentication architect component');
  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

/**
 * Sets the authorization component.
 *
 * @method setCompAuthorization
 * @param {object} comp The authorization component.
 */
function setCompAuthorization(comp) {
  try {
    compAuthorization = comp;
    logger.log.info(IDLOG, 'set authorization component');
  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

/**
 * Starts the HTTP proxy server.
 *
 * @method start
 * @static
 */
function start() {
  try {
    var proxyRules = new httpProxyRules({
      rules: router
    });
    var proxy = httpProxy.createProxy();

    httpServer = http.createServer(function (req, res) {
      try {
        logger.log.info(IDLOG, getProxyLog(req));

        // this url is generated by nethifier html template that does the
        // rest request. "?_=" is added by "no cache" option of jquery ajax
        if (req.url.indexOf('/streaming/image') === 0 && req.url.indexOf('?_=') > 0) {
          req.url = req.url.substring(0, req.url.indexOf('?_='));
        }

        if (req.method === 'OPTIONS') {
          var headers = {};
          headers["Access-Control-Allow-Origin"] = "*";
          headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
          headers["Access-Control-Allow-Credentials"] = true;
          headers["Access-Control-Max-Age"] = '86400';
          headers["Access-Control-Allow-Headers"] = 'X-Requested-With,' +
            ' Access-Control-Allow-Origin,' +
            ' X-HTTP-Method-Override,' +
            ' Content-Type,' +
            ' Authorization,' +
            ' Accept,' +
            ' User,' +
            ' Secretkey,' +
            ' WWW-Authenticate';

          res.writeHead(200, headers);
          res.end();
          return;
        }
        // #1 Check FreePBX "admin" user
        //
        // freepbx admin user is managed in a special way. If the user supply the headers "User: admin" and
        // "Secretkey: 12345", the authentication is verified each time and he can use some rest api.
        // "admin" user is FreePBX admin user
        if (req.headers.user === 'admin' && req.headers.secretkey) {
          if (compAuthentication.authenticateFreepbxAdmin(req.headers.secretkey) === true) {
            // check if the url is one of the permitted urls for freepbx admin user
            if (req.url === '/dbconn/test' ||
              req.url === '/custcard/preview' ||
              req.url.indexOf('/user/endpoints') === 0 ||
              req.url.indexOf('/astproxy/trunk') === 0 ||
              req.url.indexOf('/user/presence') === 0 ||
              req.url.indexOf('/astproxy/extension') === 0) {

              // add header used by the authorization module
              req.headers.authorization_user = 'admin';

              var target = proxyRules.match(req);
              if (target) {
                return proxy.web(req, res, { target: target }, function (err) {
                  try {
                    if (err) {
                      logger.log.error(IDLOG, err.stack);
                      res.writeHead(500);
                      res.end(err.toString());
                    }
                  } catch (err1) {
                    logger.log.error(IDLOG, err1.stack);
                    res.writeHead(500);
                    res.end(err.toString());
                  }
                });
              }
              compUtil.net.sendHttp404(IDLOG, res);
              return;

            } else {
              compUtil.net.sendHttp403(IDLOG, res);
              return;
            }
          } else { // authentication failed
            logger.log.warn(IDLOG, 'admin user authentication failed (' + req.headers['x-forwarded-for'] + ')');
            compUtil.net.sendHttp401(IDLOG, res);
            return;
          }
        }
        // #2. Check CTI user
        //
        // bypass the token verification
        if (req.url.indexOf('/authentication/login') === 0 ||
          req.url.indexOf('/static') === 0 ||
          req.url.indexOf('/profiling') === 0 ||
          (req.url.indexOf('/astproxy/unauthe_call') === 0 &&
           compAuthentication.isUnautheCallEnabled() === true &&
           compAuthentication.isUnautheCallIPEnabled(req.headers['x-forwarded-for']) === true
          )) {

          var target = proxyRules.match(req);
          if (target) {
            return proxy.web(req, res, { target: target }, function (err) {
              try {
                if (err) {
                  logger.log.error(IDLOG, err.stack);
                  if (err.code === 'ECONNREFUSED' && err.port) {
                    for (var k in router) {
                      if (router[k].indexOf(err.address + ':' + err.port) !== -1) {
                        process.emit('reloadComp', 'com_' + k.substring(1, k.length) + '_rest');
                      }
                    }
                  }
                  res.writeHead(500);
                  res.end(err.toString());
                }
              } catch (err1) {
                logger.log.error(IDLOG, err1.stack);
                res.writeHead(500);
                res.end(err.toString());
              }
            });
          }
          compUtil.net.sendHttp404(IDLOG, res);
          return;
        }
        else if (req.url.indexOf('/astproxy/unauthe_call') === 0 && compAuthentication.isUnautheCallEnabled() === false) {
          logger.log.warn(IDLOG, 'WARNING: attempt to use unauthenticated call from "' + req.headers['x-forwarded-for'] + '" (the function is disabled)');
          compUtil.net.sendHttp401(IDLOG, res);
          return;
        }
        else if (req.url.indexOf('/astproxy/unauthe_call') === 0 && compAuthentication.isUnautheCallIPEnabled(req.headers['x-forwarded-for']) === false) {
          logger.log.warn(IDLOG, 'WARNING: attempt to use unauthenticated call from "' + req.headers['x-forwarded-for'] + '" (ip not allowed)');
          compUtil.net.sendHttp401(IDLOG, res);
          return;
        }
        // check authentication
        else if (req.headers.authorization) {
          var arr = req.headers.authorization.split(':');
          // check if the authentication token is valid
          // if a token with expiration isn't valid check inside persistent tokens
          if ((compAuthentication.verifyToken(arr[0], arr[1]) === true)) {
            // add header used by the authorization module
            if (compAuthentication.isShibbolethUser(arr[0])) {
              // this is to support login with shibboleth headers
              req.headers.authorization_user = compAuthentication.getShibbolethUsername(arr[0]);
            }
            else if (compAstProxy.isExten(arr[0]) && req.url !== '/authentication/logout') {
              // this is to support login with extension number
              req.headers.authorization_user = compUser.getUserUsingEndpointExtension(arr[0]);
            }
            else if (req.url !== '/authentication/logout') {
              // remove "@domain" from username if it is present
              req.headers.authorization_user = arr[0].indexOf('@') !== -1 ? arr[0].substring(0, arr[0].lastIndexOf('@')) : arr[0];
            }
            else {
              // because login and logout are done with user or user@domain as passed by the client
              req.headers.authorization_user = arr[0];
            }
            req.headers.authorization_token = arr[1];

            // username is converted to lower case because of system authentication method.
            // So the login becomes case-insensitive
            req.headers.authorization_user = req.headers.authorization_user.toLowerCase();

            // provisioning requests proxy
            if (req.url.indexOf('/tancredi') === 0 && compAuthorization.authorizePhoneButtonsUser(req.headers.authorization_user) !== true) {
              logger.log.warn(IDLOG, `authorization failed for user ${req.headers.authorization_user} calling api ${req.method} ${req.url}: no permission`);
              return;
            }
            else if (req.url.indexOf('/tancredi') === 0 && req.url.indexOf('/models/') !== -1 && req.method === 'GET') {
              delete req.headers.authorization;
              delete req.headers.authorization_user;
              delete req.headers.authorization_token;
              req.headers.User = 'admin';
              req.headers.SecretKey = compAuthentication.getAdminSecretKey();
              logger.log.info(IDLOG, `proxy provisioning request ${req.method} ${req.url} for user ${arr[0]} from ${req.headers['x-forwarded-for']}`);
              return proxy.web(req, res, { target: '' });
            }
            else if (req.url.indexOf('/tancredi') === 0) {
              if (req.method === 'GET' || req.method === 'PATCH') {
                let macToCheck = req.url.split('/').pop();
                if (macToCheck.indexOf('?')) {
                  macToCheck = macToCheck.split('?')[0];
                }
                let extenToCheck = compAstProxy.getExtenFromMac(macToCheck) || '';
                if (compAuthorization.verifyUserEndpointExten(req.headers.authorization_user, extenToCheck) === true) {
                  delete req.headers.authorization;
                  delete req.headers.authorization_user;
                  delete req.headers.authorization_token;
                  req.headers.User = 'admin';
                  req.headers.SecretKey = compAuthentication.getAdminSecretKey();
                  logger.log.info(IDLOG, `proxy provisioning request ${req.method} ${req.url} for user ${arr[0]} from ${req.headers['x-forwarded-for']}`);
                  return proxy.web(req, res, { target: '' });
                } else {
                  logger.log.warn(IDLOG, `authorization failed for user ${req.headers.authorization_user} calling api ${req.method} ${req.url}`);
                  compUtil.net.sendHttp403(IDLOG, res);
                }
                return;
              }
              logger.log.warn(IDLOG, `${req.method} ${req.url} not permitted: (from user ${req.headers.authorization_user})`);
              compUtil.net.sendHttp403(IDLOG, res);
              return;
            }
            if (req.url.indexOf('/freepbx') === 0) {
              if (
                (req.url.indexOf('/freepbx/rest/provisioning/engine') === 0 && req.method === 'GET')
                ||
                (req.url.indexOf('/freepbx/rest/phones/reboot') === 0 && req.method === 'POST')
              ) {
                req.headers.User = 'admin';
                req.headers.SecretKey = compAuthentication.getAdminSecretKey();
                logger.log.info(IDLOG, `proxy provisioning request ${req.method} ${req.url} for user ${arr[0]} from ${req.headers['x-forwarded-for']}`);
                return proxy.web(req, res, { target: 'https://127.0.0.1/', secure: false });
              }
              logger.log.warn(IDLOG, `${req.method} ${req.url} not permitted: (from user ${req.headers.authorization_user})`);
              compUtil.net.sendHttp403(IDLOG, res);
              return;
            }
            // proxy the request
            var target = proxyRules.match(req);
            if (target) {
              return proxy.web(req, res, { target: target }, function (err) {
                try {
                  if (err) {
                    logger.log.error(IDLOG, err.stack);
                    res.writeHead(500);
                    res.end(err.toString());
                  }
                } catch (err1) {
                  logger.log.error(IDLOG, err1.stack);
                  res.writeHead(500);
                  res.end(err.toString());
                }
              });
            }
            compUtil.net.sendHttp404(IDLOG, res);
            return;
          } else {
            compUtil.net.sendHttp401(IDLOG, res);
            return;
          }
        }
        else {
          logger.log.warn(IDLOG, 'authentication attempt failed: http "Authorization" header is not present');
          compUtil.net.sendHttp401(IDLOG, res);
          return;
        }
      } catch (err) {
        logger.log.error(IDLOG, err.stack);
      }
    }).listen(port, address);

    httpServer.on('listening', function () {
      logger.log.warn(IDLOG, 'listening on ' + httpServer.address().address + ':' + httpServer.address().port);
    });
    httpServer.on('error', function (e) {
      logger.log.error(IDLOG, e.stack);
    });
    httpServer.on('close', function () {
      logger.log.warn(IDLOG, 'stop listening');
    });
  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

/**
 * Set user module to be used.
 *
 * @method setCompUser
 * @param {object} comp The user module
 * @private
 */
function setCompUser(comp) {
  try {
    // check parameter
    if (typeof comp !== 'object') {
      throw new TypeError('wrong parameter');
    }
    compUser = comp;

  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

/**
 * Returns the string to log the REST request.
 *
 * @method getProxyLog
 * @param  {object} req The request object
 * @return {string} The string describing the REST request.
 * @private
 */
function getProxyLog(req) {
  try {
    return [
      req.method, ' ',
      req.url,
      ' - [UA: ', req.headers['user-agent'], ']',
      ' - ', req.headers['x-forwarded-for'],
      ' -> ', req.headers.host
    ].join('');
  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

/**
 * Sets the utility architect component.
 *
 * @method setCompUtil
 * @param {object} comp The utility architect component.
 */
function setCompUtil(comp) {
  try {
    compUtil = comp;
    logger.log.info(IDLOG, 'set util architect component');
  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

/**
 * Set the asterisk proxy architect component.
 *
 * @method setCompAstProxy
 * @param {object} comp The asterisk proxy architect component.
 */
function setCompAstProxy(comp) {
  try {
    compAstProxy = comp;
    logger.log.info(IDLOG, 'set asterisk proxy architect component');

  } catch (err) {
    logger.log.error(IDLOG, err.stack);
  }
}

// public interface
exports.start = start;
exports.config = config;
exports.setLogger = setLogger;
exports.setCompUtil = setCompUtil;
exports.setCompUser = setCompUser;
exports.setCompAstProxy = setCompAstProxy;
exports.setCompAuthentication = setCompAuthentication;
exports.setCompAuthorization = setCompAuthorization;