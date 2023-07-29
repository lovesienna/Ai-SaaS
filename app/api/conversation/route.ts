import { auth } from "@clerk/nextjs"; //인증 관련 기능
import { NextResponse } from "next/server"; //Next.js의 서버 사이드 렌더링 기능을 위한 NextResponse 클래스
import { Configuration, OpenAIApi } from "openai"; //OpenAI API를 사용하기 위한 Configuration과 OpenAIApi 클래스

//OpenAI API의 환경 설정을 위한 객체를 생성하고, OPENAI_API_KEY 환경 변수를 사용하여 API 키를 설정합니다.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//위에서 생성한 환경 설정 객체를 사용하여 OpenAI API를 초기화합니다.
const openai = new OpenAIApi(configuration);

//POST 메서드로 API 엔드포인트를 정의합니다. 이 엔드포인트는 클라이언트로부터 POST 요청을 받습니다.
export async function POST(req: Request) {
  try {
    const { userId } = auth(); //함수를 사용하여 클라이언트의 사용자 ID를 가져옵니다.
    const body = await req.json(); //클라이언트에서 전달된 요청의 본문(JSON 데이터)을 파싱하여 body 변수에 저장합니다.
    const { messages } = body; //body 객체에서 messages 필드를 추출합니다.

    //사용자 ID가 없는 경우, "Unauthorized" 메시지와 401 상태 코드를 포함한 NextResponse 객체를 반환합니다.
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages is required", { status: 400 });
    }

    //OpenAI API를 사용하여 챗봇 대화를 생성하는 createChatCompletion 메서드를 호출합니다.
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    // API 요청에 대한 응답 데이터에서 추출한 챗봇 대화 메시지(message)를 JSON 형식으로 응답으로 반환합니다. 이 응답은 클라이언트로 전달되어 챗봇의 응답 메시지가 화면에 표시되도록 합니다. JSON 형식의 응답은 JavaScript 객체를 JSON 문자열로 변환한 것으로, 클라이언트는 이 데이터를 다시 JavaScript 객체로 파싱하여 사용할 수 있습니다.
    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CONBVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

//해당 코드는 클라이언트로부터 받은 메시지를 OpenAI API에 전달하여 챗봇 대화를 생성하고, 인증과 API 키의 존재 여부를 검사하여 적절한 응답을 반환하는 간단한 챗봇 API를 구현하는 예시입니다.
