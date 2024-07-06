import { NextResponse } from "next/server"

const GET = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dishes`);
    return NextResponse.json(response, { status: 200 })
}

export { GET }
