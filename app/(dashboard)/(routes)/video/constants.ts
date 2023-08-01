import * as z from "zod";

//유효성을 검사하는 스키마
export const formSchema = z.object({
  prompt: z.string().min(1, {
    //문자열이어야하고 최소 1글자 이상이어야함
    message: "Music Prompt is required",
  }),
});
