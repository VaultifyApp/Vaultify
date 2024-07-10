import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext)

    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }

    return children
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ProtectedRoute
