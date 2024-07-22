/**
 * The User interface is used to store user data
 */
interface User {
    _id?: string;
    refreshToken?: string;
    accessToken?: string;
    username?: string;
    email?: string;
    bio?: string;
    href?: string;
    uri?: string;
    playlists?: string[];
    images?: [
        {
            url: string;
            height: number;
            width: number;
        },
    ];
}

export default User;
