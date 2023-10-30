import ky from "ky";

export const api = ky.create({
    prefixUrl: "http://localhost:7778",
    hooks: {
        beforeRequest: [
            request => {
                request.headers.set("Authorization", "Bearer " + localStorage.getItem("token"))
            }
        ]
    }
});