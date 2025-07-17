import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ hello: 'world'}, { status: 200})
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}