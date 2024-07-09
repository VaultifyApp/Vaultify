import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const token = 'BQBcSaFkjvxu8-cAJ7x3b2kbDK8OOuwJ71X1QotvRD3-9xUE1fLFc_mvoLBPsxi4Zp2jmiFgbO3LBi1tDr0dU2I9dpoBol4ZYUIz79nY1eNQhpPU_eo';
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'track',
          limit: 12,
        },
      });

      setResults(response.data.tracks.items);
    } catch (error) {
      console.error('Error fetching data from Spotify API', error);
    }
  };

  return (
    <div className="container">
      <h1>Vaultify</h1>
      <h2>Vault your music memories.</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {results.length > 0 && (
        <div className="results">
          <h3>Search Results:</h3>
          <ul>
            {results.map((track) => (
              <li key={track.id}>
                <img src={track.album.images[0].url} alt={track.name} width="50" />
                {track.name} by {track.artists.map(artist => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3>What is Vaultify?</h3>
      <p>
        We here at Vaultify aim to transform your listening experiences by generating highly customizable monthly playlists for you containing all your favorite songs, which you can export back onto your Spotify library with one click. After generating your first playlist with us, you can access your very own unique “Vault” page to visit all your personal notes, playlists, and AI-generated playlist covers. We aspire to snapshot your listening journey and portray the personal story that your music history tells.

        <br></br>
        <br></br>

        Get started now by accessing the “Playlist Generator” page to make your first playlist.
      </p>
    </div>
  );
};

export default Home;
