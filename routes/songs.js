const { check, validationResult } = require('express-validator');
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();


// route: song/liked/:songId/:mood
// access: private
// desc: likes the song by songId and mood for a user
router.put('/liked/:songId', auth, async (req, res) => {
    try {
        const songId = req.params.songId;

        // get user
        const userSongs = await User.findById(req.user.id).select("songDetails");
        console.log(userSongs);
        let isNewSongLiked = true;

        // look for the song in the user song details array and increament the liked count by 1
        if (userSongs.songDetails.length > 0) {
            userSongs.songDetails.forEach((song) => {
                if (song.songId === songId) {
                    song.likedCount += 1;
                    isNewSongLiked = false;
                }
            });
        }

        // if it is a new song that the user has liked, add that song in the song deltail array of that mood
        // and set likedCount to 1
        if (isNewSongLiked) {
            userSongs.songDetails.push({
                songId, likedCount: 1
            });
        }

        await userSongs.save();
        res.json(userSongs);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}
);

// route: song/disliked/:songId
// access: private
// desc: dislikes the song by songId for a user
router.put('/disliked/:songId', auth, async (req, res) => {
    try {
        const songId = req.params.songId;

        // get user
        const userSongs = await User.findById(req.user.id).select("songDetails");

        // look for the song in the user song details array and increament the liked count by 1
        if (userSongs.songDetails.length > 0) {
            userSongs.songDetails.forEach((song) => {
                if (song.songId === songId) {
                    song.likedCount -= 1;
                }
            });
        }

        await userSongs.save();
        res.json(userSongs);
    } catch (error) {
        return res.status(500).send('Server Error');
    }
}
);


// route: song/liked/:songId/:mood
// access: private
// desc: increase skippedCount the song by songId for a user
router.put('/skipped/:songId', auth, async (req, res) => {
    try {
        const songId = req.params.songId;
        // get user
        const userSongs = await User.findById(req.user.id).select("songDetails");

        let isNewSongSkipped = true;

        if (userSongs.songDetails.length > 0 ) {
            // look for the song in the user song details array and increament the liked count by 1
            userSongs.songDetails.forEach((song) => {
                if (song.songId === songId) {
                    song.SkippedCount += 1;
                    isNewSongSkipped = false;
                }
            });
        }

        // if it is a new song that the user has liked, add that song in the song deltail array of that mood
        // and set likedCount to 1
        if (isNewSongSkipped) {
            userSongs.songDetails.push({
                songId, SkippedCount: 1
            });
        }
        await userSongs.save();
        res.json(userSongs);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}
);

module.exports = router;
