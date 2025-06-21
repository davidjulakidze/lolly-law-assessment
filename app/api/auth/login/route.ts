import { PrismaClient } from "@/generated/prisma";
import { logger } from "@/server-utils/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
            },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: "Invalid password" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        const tokenExpiration = rememberMe ? "7d" : "1h";

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: tokenExpiration }
        );

        const { password: _, ...userWithoutPassword } = user;


        const response =  new Response(JSON.stringify({
            user: userWithoutPassword,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Secure; Path=/; Max-Age=${rememberMe ? 604800 : 3600}; SameSite=Strict`);
        return response;
    } catch (error) {
        logger.error("Error logging in user:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    finally {
        await prisma.$disconnect();
    }
}