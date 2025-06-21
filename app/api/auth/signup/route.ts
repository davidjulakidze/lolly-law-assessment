import { logger } from "@/server-utils/logger";
import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    const prisma = new PrismaClient();

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });

        return new Response(JSON.stringify(newUser), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        logger.error("Error creating user:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        await prisma.$disconnect();
    }
}