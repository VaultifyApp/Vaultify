import React, { useEffect, useState } from 'react';

const PlaylistView = () => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Attempting to retrieve playlist data...");
    const savedPlaylist = localStorage.getItem('playlistData');
    if (savedPlaylist) {
      console.log("Playlist data found:", savedPlaylist);
      setPlaylist(JSON.parse(savedPlaylist));
    } else {
      console.log("No playlist data found.");
    }
    setLoading(false);
    return () => {
      localStorage.removeItem('playlistData');
    };
  }, []);

  if (loading) {
    return <div>Loading playlist...</div>;
  }

  if (!playlist) {
    return <div className="no-playlist">No playlist found</div>;
  }

  return (
    <div className="playlist-container">
      <h2 className="playlist-title">{playlist.title}</h2>
      <ul className="song-list">
        {playlist.songs.map((song, index) => (
          <li key={index} className="song-item">
            <span className="song-info">{song.title} by {song.artist}</span>
            <input type="text" placeholder="Add a note..." className="song-note" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistView;
