import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
    var prismaCached: {
        prisma: PrismaClient | null
    }
}

let cached = global.prismaCached

if (!cached) {
    cached = global.prismaCached = { prisma: null }
}

const prisma = cached.prisma || (() => {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL!
    })

    return new PrismaClient({ adapter })
})()

if (process.env.NODE_ENV !== 'production') {
    cached.prisma = prisma
}

export default prisma
