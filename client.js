'use strict';

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');

//bradvanderbush@gmail.com
// const keyPath = path.join(__dirname, 'oauth2.keys.json');
// Back up keys incase you hit upload limit jerrycurljackson@gmail.com
const keyPath = path.join(__dirname, 'oauthTwo.keys.json');


let keys = {
    redirect_uris: ['http://localhost:3000/oauth2callback'],
};
if (fs.existsSync(keyPath)) {
    const keyFile = require(keyPath);
    // console.log(keyFile)
    keys = keyFile.installed || keyFile.web;
}

const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:
"redirect_uris": [
  "http://localhost:3000/oauth2callback"
]`;


class Client {
    constructor(options) {

        this._options = options || { scopes: [] };

        // validate the redirectUri.  This is a frequent cause of confusion.
        if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
            throw new Error(invalidRedirectUri);
        }
        const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];
        const parts = new url.URL(redirectUri);
        if (
            redirectUri.length === 0 ||
            parts.port !== '3000' ||
            parts.hostname !== 'localhost' ||
            parts.pathname !== '/oauth2callback'
        ) {
            throw new Error(invalidRedirectUri);
        }

        // create an oAuth client to authorize the API call
        this.oAuth2Client = new google.auth.OAuth2(
            keys.client_id,
            keys.client_secret,
            redirectUri
        );
    }

    async authenticate(scopes) {
        return new Promise((resolve, reject) => {
            // grab the url that will be used for authorization
            this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes.join(' '),
            });
            const server = http
                .createServer(async (req, res) => {
                    try {
                        if (req.url.indexOf('/oauth2callback') > -1) {
                            const qs = new url.URL(req.url, 'http://localhost:3000')
                                .searchParams;
                            res.end(
                                'Authentication successful! Please return to the console.'
                            );
                            server.destroy();
                            const { tokens } = await this.oAuth2Client.getToken(qs.get('code'));
                            console.log(tokens)
                           
                            this.oAuth2Client.credentials = tokens;
                            resolve(this.oAuth2Client);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
                .listen(3000, () => {
                    // open the browser to the authorize url to start the workflow
                    opn(this.authorizeUrl, { wait: false }).then(cp => cp.unref());

                });
                
            destroyer(server);
        });
    }
}

module.exports = new Client();