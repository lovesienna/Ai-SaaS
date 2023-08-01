import { auth } from "@clerk/nextjs"; //인증 관련 기능
import { NextResponse } from "next/server"; //Next.js의 서버 사이드 렌더링 기능을 위한 NextResponse 클래스
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

//POST 메서드로 API 엔드포인트를 정의합니다. 이 엔드포인트는 클라이언트로부터 POST 요청을 받습니다.
export async function POST(req: Request) {
  try {
    const { userId } = auth(); //함수를 사용하여 클라이언트의 사용자 ID를 가져옵니다.
    const body = await req.json(); //클라이언트에서 전달된 요청의 본문(JSON 데이터)을 파싱하여 body 변수에 저장합니다.
    const { prompt } = body;

    //사용자 ID가 없는 경우, "Unauthorized" 메시지와 401 상태 코드를 포함한 NextResponse 객체를 반환합니다.
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 500 });
    }

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: "funky synth solo",
        },
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
