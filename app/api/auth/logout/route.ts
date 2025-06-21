import { headers } from "next/headers";


export async function POST() {
    const headersList = await headers();
    const token = headersList.get("authorization")?.replace("Bearer ", "");

    if (!token) {
        return new Response(JSON.stringify({ message: "No token provided" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const response = new Response(JSON.stringify({ message: "Logged out successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
    response.headers.set("Set-Cookie", "token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Strict");
    return response;
}
