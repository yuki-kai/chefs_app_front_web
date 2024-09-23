export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers";
import axios from "axios";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
	const requestBody = await request.json();
	try {
		const response = await axios.post(
			process.env.BACKEND_URL + "/api/create/dish",
			requestBody,
			{headers: {"Content-Type": "application/json"}}
		);
		const cookieStore = cookies()
		cookieStore.set("success", "success")
		return NextResponse.json(response.data, { status: 200 })
	} catch (error: any) {
		return NextResponse.json(error!.response.data, { status: 500 })
	}
}
