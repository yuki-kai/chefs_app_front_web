export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server"
import axios from "axios";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
    const response = await axios.get(process.env.BACKEND_URL + "/api/dishes");
    return NextResponse.json(response.data, { status: 200 })
}
