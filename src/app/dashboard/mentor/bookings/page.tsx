import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MoreHorizontal } from "lucide-react";

const bookings = [
  {
    student: {
      name: "John Doe",
      avatar: "https://github.com/johndoe.png",
    },
    service: "1:1 Mentorship",
    date: "2024-08-15",
    time: "10:00 AM",
    status: "Upcoming",
  },
  {
    student: {
      name: "Jane Smith",
      avatar: "https://github.com/janesmith.png",
    },
    service: "Priority DM",
    date: "2024-07-20",
    time: "N/A",
    status: "Completed",
  },
  {
    student: {
      name: "Sam Wilson",
      avatar: "https://github.com/samwilson.png",
    },
    service: "Webinar",
    date: "2024-07-10",
    time: "02:00 PM",
    status: "Canceled",
  },
  {
    student: {
      name: "Alice Johnson",
      avatar: "https://github.com/alicejohnson.png",
    },
    service: "1:1 Mentorship",
    date: "2024-08-20",
    time: "03:00 PM",
    status: "Upcoming",
  },
];

const statusVariant: {
  [key: string]: "default" | "secondary" | "destructive";
} = {
  Upcoming: "default",
  Completed: "secondary",
  Canceled: "destructive",
};

export default function BookingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <h1 className="text-4xl font-bold">Bookings</h1>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <BookingsTable status="Upcoming" />
        </TabsContent>
        <TabsContent value="completed">
          <BookingsTable status="Completed" />
        </TabsContent>
        <TabsContent value="canceled">
          <BookingsTable status="Canceled" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingsTable({ status }: { status: string }) {
  const filteredBookings = bookings.filter(
    (booking) => booking.status === status,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{status} Bookings</CardTitle>
        <CardDescription>
          Here are all your {status.toLowerCase()} bookings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={booking.student.avatar} />
                      <AvatarFallback>
                        {booking.student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{booking.student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[booking.status]}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
