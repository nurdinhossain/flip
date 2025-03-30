interface User {
    id: string;
    email: string;
    password: string;
    name?: string; // Optional fields
}

export default User;