const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const client = require('../client.js');
const { google } = require('googleapis');
const youtubeUpload = require('../insert/uploads.js');
const analytics = require('../insert/analytics.js');

let videoInfo = {};

const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
  ];

  const youtube = google.youtube({
    version: 'v3',
    auth: client.oAuth2Client,
  });

// Set Storage of uploaded video or file on the server
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({
    storage: storage
}).single('myVideo');


/* GET login page. */
router.get('/', function (req, res, next) {
    const fileName = process.argv[2];
    res.render('index', { title: 'Youtube'})
});

/* GET analytics page. */
router.get('/analytics', function (req, res, next) {
    analytics.runVideoAnalytics().then((data) => {
       console.log( 'the result: ', data)
        res.render('analytics', { 
            display: "block",
            nav_items_show: "block",
            channel_snippet_title: data.snippet.title,
            channel_id: data.id,
            channel_statistics_subscriberCount: data.statistics.subscriberCount,
            channel_statistics_viewCount: data.statistics.viewCount,
            channel_statistics_videoCount: data.statistics.videoCount
        })
    }).catch(console.err)
})

/* GET dashboard page. (main page) */
router.get('/dashboard', function (req, res, next) {

    res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })
});

/* After OAuth routes to the main page */
router.post('/dashboard', (req, res) => {
    // res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })
    client
    .authenticate(scopes)
    .then(() => {

        // res.render('dashboard', { title: 'Youtube', display: "block", block: 'block', msg: "Uploaded" })
        res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block" })

    }).catch(console.err);
})

/* POST route for video file */
router.post('/upload', (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            console.log('the error: ', err)
            res.render('index', {
                msg: err
            })
        } else {
            console.log('the file: ', req.file)
           
            videoInfo.title = req.body.title
            videoInfo.desc = req.body.description
            videoInfo.filePath = './'+req.file.path
            videoInfo.fileName = req.file.filename

            res.render('dashboard', { title: 'Youtube',
                display: "none",
                upload_youtube_show: 'block'
            })
        }
    })

})


/* POST route for video file up to youtube*/
router.post('/upload-youtube', (req, res) => {

    console.log('file name: ',videoInfo.fileName)
    youtubeUpload.runUpload( videoInfo )
    res.render('dashboard', { title: 'Youtube', display: "block", nav_items_show: "block", msg: "Uploaded", display_video: "block", videoSRC: videoInfo.fileName})
})

module.exports = router;
