"use client";

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
import {
  MoreHorizontal,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { api } from "~/trpc/react";
import { format } from "date-fns";

const statusDisplayMap = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No Show",
} as const;

const statusVariant = {
  pending: "outline",
  confirmed: "default",
  cancelled: "destructive",
  completed: "secondary",
  no_show: "destructive",
};

export default function BookingsPage() {
  const {
    data: bookings,
    isLoading,
    error,
  } = api.booking.getMentorBookings.useQuery();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 py-10">
        <h1 className="text-4xl font-bold">Bookings</h1>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 py-10">
        <h1 className="text-4xl font-bold">Bookings</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Error loading bookings: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <h1 className="text-4xl font-bold">Bookings</h1>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <BookingsTable
            bookings={(bookings as unknown as BookingType[]) ?? []}
          />
        </TabsContent>
        <TabsContent value="pending">
          <BookingsTable
            bookings={
              (bookings as unknown as BookingType[])?.filter(
                (b) => b.status === "pending",
              ) ?? []
            }
            status="pending"
          />
        </TabsContent>
        <TabsContent value="confirmed">
          <BookingsTable
            bookings={
              (bookings as unknown as BookingType[])?.filter(
                (b) => b.status === "confirmed",
              ) ?? []
            }
            status="confirmed"
          />
        </TabsContent>
        <TabsContent value="completed">
          <BookingsTable
            bookings={
              (bookings as unknown as BookingType[])?.filter(
                (b) => b.status === "completed",
              ) ?? []
            }
            status="completed"
          />
        </TabsContent>
        <TabsContent value="cancelled">
          <BookingsTable
            bookings={
              (bookings as unknown as BookingType[])?.filter(
                (b) => b.status === "cancelled",
              ) ?? []
            }
            status="cancelled"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BookingType {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  totalAmount: string;
  currency: string;
  student: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  service: {
    title: string;
    duration: number;
    price: string;
    currency: string;
  } | null;
  timeSlot: {
    startDateTime: Date;
    endDateTime: Date;
  } | null;
  review: unknown;
}

function BookingsTable({
  bookings,
  status,
}: {
  bookings: BookingType[];
  status?: string;
}) {
  const utils = api.useUtils();
  const updateBookingStatus = api.booking.updateStatus.useMutation({
    onSuccess: () => {
      void utils.booking.getMentorBookings.invalidate();
    },
  });

  const handleStatusUpdate = (
    bookingId: string,
    newStatus: "confirmed" | "completed" | "cancelled",
  ) => {
    void updateBookingStatus
      .mutateAsync({
        bookingId,
        status: newStatus,
      })
      .catch((error) => {
        console.error("Failed to update booking status:", error);
      });
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {status
              ? `${statusDisplayMap[status as keyof typeof statusDisplayMap]} Bookings`
              : "All Bookings"}
          </CardTitle>
          <CardDescription>
            {status
              ? `No ${status.toLowerCase()} bookings found.`
              : "No bookings found."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-4 text-center">
            You don&apos;t have any {status ? status.toLowerCase() : ""}{" "}
            bookings yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {status
            ? `${statusDisplayMap[status as keyof typeof statusDisplayMap]} Bookings`
            : "All Bookings"}
        </CardTitle>
        <CardDescription>
          Manage your {status ? status.toLowerCase() : ""} bookings and student
          sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={booking.student.image ?? ""} />
                      <AvatarFallback>
                        {booking.student.name?.charAt(0) ?? "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.student.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {booking.student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.service?.title}</p>
                    <p className="text-muted-foreground line-clamp-1 text-sm">
                      {booking.service?.price} {booking.service?.currency}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="font-medium">
                        {booking.timeSlot?.startDateTime
                          ? format(
                              new Date(booking.timeSlot.startDateTime),
                              "MMM dd, yyyy",
                            )
                          : "N/A"}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {booking.timeSlot?.startDateTime
                          ? format(
                              new Date(booking.timeSlot.startDateTime),
                              "h:mm a",
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.service?.duration
                    ? `${booking.service.duration} min`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">
                      {booking.totalAmount} {booking.currency}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      statusVariant[booking.status] as
                        | "default"
                        | "secondary"
                        | "destructive"
                        | "outline"
                    }
                  >
                    {statusDisplayMap[booking.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {booking.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(booking.id, "confirmed")
                          }
                          disabled={updateBookingStatus.isPending}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(booking.id, "cancelled")
                          }
                          disabled={updateBookingStatus.isPending}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "completed")
                        }
                        disabled={updateBookingStatus.isPending}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
