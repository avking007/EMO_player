import React from 'react'
import { connect } from 'react-redux';
import { userPlaySong, userSkipSong } from '../../../actions/songs';

const MoodPlaylist = ({songsArray, userPlaySong, userSkipSong}) => {
    return (
        <div>
            {/* 

            If new user with no songArray : 
                mood =  happy /...
                search songs based on happy-song-playlist (limit 15)
            
            else if old user :
                songsArr = {
                    happy: [{}] -> 2
                    sad: [{}] -> 1
                    angry: [{}] -> 1
                    neutral: [{}] ->2
                }
                

                happy - 2

                if user mood is happy: 
                    getEmoAlgoApply EMO algo on happy songs

                    search remaining abs(songArr.mood.length - 15) songs from youtube search
            
            */}
        </div>
    )
}

const mapper = ( state ) => ({
    songsArray: state.songs,
}) 

export default connect(mapper, {userPlaySong, userSkipSong})(MoodPlaylist);
