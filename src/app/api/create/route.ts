export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server"
import axios from "axios";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
    const requestBody = await request.json();
    const response = await axios.post(
        process.env.BACKEND_URL + "/api/create/dish",
        requestBody,
        {headers: {"Content-Type": "application/json"}}
    );
    return NextResponse.json(response.data, { status: 200 })
}
