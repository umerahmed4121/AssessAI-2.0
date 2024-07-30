// Session user

type SessionUser = {
    _id: string
    name: string
    email: string
    picture: string
    role: "STUDENT" | "TEACHER" | "ADMIN"
}