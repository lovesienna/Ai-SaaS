import { cn } from "@/lib/utils";
//조건에 따라 다른 클래스를 적용할 때 사용
//여러 클래스를 조합하여 쉽게 동적으로 스타일을 적용할 수 있으므로 코드의 가독성과 유지보수성이 향상됩니다.

interface HeadingProps {
  title: string;
  description: string;
  icon: any;
  iconColor?: string;
  bgColor?: string;
}

export const Heading = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
}: HeadingProps) => {
  return (
    <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
      <div className={cn("p-2 w-fit rounded-md", bgColor)}>
        <Icon className={cn("w-10 h-10", iconColor)} />
        {/* <Icon className={`w-10 h-10 ${iconColor}  cn 없이 이렇게 적어도 됨*/}
      </div>
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
