import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Check, Copy, ExternalLink, CircleArrowRight } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";

const onboardingSteps = [
  { title: "Add availability", completed: true },
  { title: "Complete your profile", completed: false },
  { title: "Create a service", completed: false },
];

export default function Page() {
  const completedSteps = onboardingSteps.filter(
    (step) => step.completed,
  ).length;
  const progress = (completedSteps / onboardingSteps.length) * 100;

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Hi, Javed</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-muted-foreground gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/join.jpg" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            easyweasy.io/javed_ansari13
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Make the page yours!</CardTitle>
          <p className="text-muted-foreground">
            Unlock the potential of your EasyWeasy page
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Progress value={progress} className="h-2" />
            <p className="text-muted-foreground text-sm font-medium whitespace-nowrap">
              {completedSteps} / {onboardingSteps.length} completed
            </p>
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            {onboardingSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step.completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                <p
                  className={`font-medium ${
                    step.completed ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Analytics</CardTitle>
          <Tabs defaultValue="7d" className="mt-2">
            <TabsList>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">₹0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg. CTR</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0%</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Get inspired</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Check out how similar profiles are growing their audience.
            </p>
          </div>
          <Button variant="ghost" size="sm">
            See more <CircleArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/pranita-bajoria.png" />
              <AvatarFallback>PB</AvatarFallback>
            </Avatar>
            <span className="font-medium">Pranita Bajoria</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/aish-s.png" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <span className="font-medium">Aishwarya Srinivasan</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/colleen.png" />
              <AvatarFallback>CB</AvatarFallback>
            </Avatar>
            <span className="font-medium">Colleen Ballesteros</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
