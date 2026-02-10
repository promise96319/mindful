import { useContext } from 'react'
import { AuthContext, type AuthContextType } from '../contexts/AuthContext'

export function useAuth(): AuthContextType {
  return useContext(AuthContext)
}

export default useAuth
