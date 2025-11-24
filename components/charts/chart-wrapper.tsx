import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReactNode } from "react";

type ChartWrapperProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function ChartWrapper({ title, description, children }: ChartWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pl-2">{children}</CardContent>
    </Card>
  );
}
