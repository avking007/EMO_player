const getInterestLevel = (interest_factor) => {
  if (interest_factor < 0) {
    return 1.5;
  } else if (interest_factor === 0) {
    return 3;
  }
  return 4.5;
};

/**
 *
 * @param {*} song object containg song details
 * @returns song weight
 */
const getWeight = (song) => {
  const interest_factor = song.playCount - song.skippedCount;
  let interest_level = getInterestLevel(interest_factor);

  let song_weight = 0;
  if (song.playCount) {
    if (song.playCount > 5) {
      if (!song.skippedCount) {
        song_weight = song.playCount * 0.6 + interest_level * 0.4;
      } else {
        song_weight = (song.playCount - 1) * 0.6 + interest_level * 0.4;
      }
    } else {
      song_weight = interest_level;
    }
  }

  return song_weight;
};

/**
 *
 * @param {*} songList list of songs
 * @returns sorted array of songs post application EMO algorithm.
 */
export const emoAlgorithm = (songList) => {
  const resultSongArr = [];

  for (let index = 0; index < songList.length; index++) {
    const weight = getWeight(songList[index]);
    resultSongArr.push({ weight, ...songList[index] });
  }
  resultSongArr.sort((a, b) => b.weight - a.weight);
  return resultSongArr;
};
