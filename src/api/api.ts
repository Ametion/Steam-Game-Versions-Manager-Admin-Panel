import ky from "ky";

export const api = ky.create({
    prefixUrl: process.env.REACT_APP_API_URL || "http://localhost:8080",
    hooks: {
        beforeRequest: [
            request => {
                request.headers.set("Authorization", "Bearer " + localStorage.getItem("token"))
            }
        ]
    }
});