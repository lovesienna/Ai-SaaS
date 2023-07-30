"use client";

import axios from "axios";
import * as z from "zod";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";

//useForm은 React Hook Form 라이브러리의 핵심 함수로, 폼의 상태와 제어 기능을 관리하는데 사용됩니다.
const ImagePage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  //z.infer<typeof formSchema>는 TypeScript의 타입 추론을 활용하여 formSchema의 유효성 검사 스키마에 따라 추론된 타입을 사용합니다. z.infer를 사용하면 스키마에 정의된 데이터의 타입을 자동으로 추론하여 사용할 수 있습니다.
  const form = useForm<z.infer<typeof formSchema>>({
    //formSchema 스키마를 사용하여 유효성 검사를 수행하는 리졸버(resolver) 함수를 생성합니다. 리졸버 함수는 React Hook Form과 함께 사용되어 폼 입력 데이터의 유효성을 검사합니다.
    resolver: zodResolver(formSchema),
    //defaultValues는 폼의 초기 값으로 설정할 값들을 지정합니다. 이 예시에서는 prompt 필드를 빈 문자열("")로 초기화합니다.
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting; // 폼 제출이 진행 중인지 여부를 isLoading 변수로 저장합니다.

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 폼 제출 이벤트 핸들러를 정의합니다.
    try {
      setImages([]); // 이미지 목록을 초기화합니다.

      const response = await axios.post("/api/image", values);
      //악시오스로 부터 받아온 배열에 각각의 이미지들의 url을 추출합니다.
      const urls = response.data.map((image: { url: string }) => image.url);

      setImages(urls); // 이미지 목록을 상태에 저장합니다.
      form.reset(); // 폼을 초기화합니다.
    } catch (error: any) {
      // 오류가 발생한 경우 에러 로그를 출력합니다.
      console.log(error);
    } finally {
      router.refresh(); // 페이지를 새로 고칩니다.
    }
  };

  return (
    <div>
      {/* 채팅 페이지의 제목과 설명을 나타내는 Heading 컴포넌트입니다. */}
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)} // 폼 제출 이벤트 핸들러를 폼에 연결합니다.
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      {/* 사용자가 입력하는 입력 필드입니다. */}
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} // 로딩 중인 경우 입력 필드를 비활성화합니다.
                        placeholder="A picture of a horse in Swiss alps"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value}></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value}></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* 챗봇 메시지를 생성하는 버튼입니다. */}
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading} // 로딩 중인 경우 버튼을 비활성화합니다.
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            // 로딩 중인 경우 로딩 스피너를 표시합니다.
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            // 이미지가 없는 경우의 메시지를 표시
            <Empty label="No images generated." />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((src) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image alt="Image" fill src={src} />
                </div>
                <CardFooter>
                  <Button
                    onClick={() => window.open(src)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
