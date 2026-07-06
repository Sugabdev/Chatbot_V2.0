export interface UserBody {
    username: string
    email?: string
    password: string
}

export interface AuthMe {
    authenticated: boolean
    id: string
    username: string
    email: string
}
