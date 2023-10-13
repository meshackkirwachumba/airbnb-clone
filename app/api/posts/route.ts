import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("all users");
  return NextResponse.json("Hey all users");
}
