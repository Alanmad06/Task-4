export type User = {
    id: string,
    first_name: string,
    email: string,
    last_login: Date,
    blocked?:boolean,
    password?:string
}