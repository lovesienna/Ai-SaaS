"use client";

import * as z from "zod";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/heading";

import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//useForm은 React Hook Form 라이브러리의 핵심 함수로, 폼의 상태와 제어 기능을 관리하는데 사용됩니다.
const ConversationPage = () => {
  //z.infer<typeof formSchema>는 TypeScript의 타입 추론을 활용하여 formSchema의 유효성 검사 스키마에 따라 추론된 타입을 사용합니다. z.infer를 사용하면 스키마에 정의된 데이터의 타입을 자동으로 추론하여 사용할 수 있습니다.
  const form = useForm<z.infer<typeof formSchema>>({
    //formSchema 스키마를 사용하여 유효성 검사를 수행하는 리졸버(resolver) 함수를 생성합니다. 리졸버 함수는 React Hook Form과 함께 사용되어 폼 입력 데이터의 유효성을 검사합니다.
    resolver: zodResolver(formSchema),
    //defaultValues는 폼의 초기 값으로 설정할 값들을 지정합니다. 이 예시에서는 prompt 필드를 빈 문자열("")로 초기화합니다.
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                    rounded-lg
                    border
                    w-full
                    p-4
                    px-3
                    md:px-6
                    focus-within:shadow-sm
                    grid
                    grid-cols-12
                    gap-2
                    "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4"></div>
      </div>
    </div>
  );
};

export default ConversationPage;
