const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const client = require('../client');

// initialize the Youtube API library
const youtube = google.youtube({
    version: 'v3',
    auth: client.oAuth2Client,
});

async function runVideoAnalytics() {
    const res = await getVideoAnalytics(null)
    // const etag = res.data.etag
    // console.log(`etag: ${etag}`);

    // const res2 = await getVideoAnalytics(etag)
    // console.log('res2 status: ', res2)
}

async function getVideoAnalytics(etag) {
    const headers = {}
    if(etag) {
        headers['If-None-Match'] = etag
    }

    const res = await youtube.videos.list({
        part: 'id,snippet,statistics',
        id: '2lAe1cqCOXo',
        // chart: 'mostPopular',
        // myRated: 'like',
    });
    console.log('Status code: ' + res.status);
    console.log(res.data);
    console.log(res.data.snippet)
    return res;
}

module.exports = {
    runVideoAnalytics
}