import React, { useEffect, useState, useContext } from 'react';
import AuthContext from "../utils/AuthContext";

const PlaylistView = () => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ currentUser, setCurrentUser ] = useContext(AuthContext);

  useEffect(() => {
    console.log("Attempting to retrieve playlist data...");
    const savedPlaylist = currentUser.playlists[currentUser.playlists.length - 1]
    if (savedPlaylist) {
      const parsedData = savedPlaylist;
      if (parsedData && Array.isArray(parsedData.songs)) {
        setPlaylist(parsedData);
        console.log("Playlist data found and valid:", parsedData);
      } else {
        console.error("Invalid or missing playlist data:", parsedData);
      }
    } else {
      console.log("No playlist data found.");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading playlist...</div>;
  }

  if (!playlist) {
    return <div>No playlist found or the playlist is missing necessary data.</div>;
  }

  return (
    <div className="playlist-container">
      <h2>{playlist.title}</h2>
      <ul>
        {playlist.songs.map((song, index) => (
          <li key={index}>
            {song.title} by {song.artist}
            <input type="text" placeholder="Add a note..." />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistView;
