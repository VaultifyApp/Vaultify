import DatabaseFacade from '../facades/DatabaseFacade.js'
import SpotifyFacade from '../facades/SpotifyFacade.js'

/**
 * The Model class is responsible for
 */
class Model {
    constructor() {
        this.database = new DatabaseFacade()
        this.spotify = new SpotifyFacade()
    }
}

export default Model
