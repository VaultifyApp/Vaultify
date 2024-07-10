import React from 'react'

const Profile = () => {
    const profile = JSON.parse(localStorage.getItem('profile'))

    return (
        <div>
            <h1>Your Profile</h1>
            {profile ? (
                <div>
                    <h2>Logged in as {profile.display_name}</h2>
                    <p>User ID: {profile.id}</p>
                    <p>Email: {profile.email}</p>
                    <p>
                        Spotify URI:{' '}
                        <a href={profile.external_urls.spotify}>
                            {profile.uri}
                        </a>
                    </p>
                    <p>
                        Link: <a href={profile.href}>{profile.href}</a>
                    </p>
                    <p>
                        Profile Image:{' '}
                        <img
                            src={profile.images[0]?.url}
                            alt="Profile"
                            width="200"
                        />
                    </p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Profile
