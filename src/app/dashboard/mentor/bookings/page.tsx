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
  CalendarX,
  Users,
  BookOpen,
  TrendingUp,
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted mb-4 rounded-full p-6">
                <CalendarX className="text-muted-foreground h-12 w-12" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Unable to load bookings
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {error.message.includes("FORBIDDEN") ||
                error.message.includes("mentor")
                  ? "It looks like your mentor profile isn't set up yet. Complete your profile setup to start receiving bookings."
                  : `There was an error loading your bookings: ${error.message}`}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bookingStats = bookings
    ? {
        total: bookings.length,
        pending: bookings.filter(
          (b) => (b as unknown as BookingType).status === "pending",
        ).length,
        confirmed: bookings.filter(
          (b) => (b as unknown as BookingType).status === "confirmed",
        ).length,
        completed: bookings.filter(
          (b) => (b as unknown as BookingType).status === "completed",
        ).length,
        cancelled: bookings.filter(
          (b) => (b as unknown as BookingType).status === "cancelled",
        ).length,
      }
    : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Bookings</h1>
        {bookingStats && bookingStats.total > 0 && (
          <div className="text-muted-foreground text-sm">
            Total: {bookingStats.total} bookings
          </div>
        )}
      </div>

      {/* Stats Overview when bookings exist */}
      {bookingStats && bookingStats.total > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{bookingStats.total}</p>
                  <p className="text-muted-foreground text-xs">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{bookingStats.pending}</p>
                  <p className="text-muted-foreground text-xs">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{bookingStats.confirmed}</p>
                  <p className="text-muted-foreground text-xs">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{bookingStats.completed}</p>
                  <p className="text-muted-foreground text-xs">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CalendarX className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{bookingStats.cancelled}</p>
                  <p className="text-muted-foreground text-xs">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All Bookings
            {bookingStats && (
              <span className="ml-1 text-xs">({bookingStats.total})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {bookingStats && (
              <span className="ml-1 text-xs">({bookingStats.pending})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed
            {bookingStats && (
              <span className="ml-1 text-xs">({bookingStats.confirmed})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {bookingStats && (
              <span className="ml-1 text-xs">({bookingStats.completed})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
            {bookingStats && (
              <span className="ml-1 text-xs">({bookingStats.cancelled})</span>
            )}
          </TabsTrigger>
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-6">
              <CalendarX className="text-muted-foreground h-12 w-12" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              {status
                ? `No ${status.toLowerCase()} bookings`
                : "No bookings yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {status === "pending"
                ? "You don't have any pending booking requests at the moment. Students will be able to book your services when you set up your availability."
                : status === "confirmed"
                  ? "No confirmed bookings scheduled. Pending bookings will appear here once you confirm them."
                  : status === "completed"
                    ? "No completed sessions yet. Confirmed bookings will move here after completion."
                    : status === "cancelled"
                      ? "No cancelled bookings. This section will show any bookings that were cancelled by you or students."
                      : "You haven't received any booking requests yet. Make sure your mentor profile and services are set up to start receiving bookings from students."}
            </p>
            {!status && (
              <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-card flex items-center space-x-3 rounded-lg border p-4">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Set up profile</p>
                    <p className="text-muted-foreground text-sm">
                      Complete your mentor profile
                    </p>
                  </div>
                </div>
                <div className="bg-card flex items-center space-x-3 rounded-lg border p-4">
                  <BookOpen className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">Add services</p>
                    <p className="text-muted-foreground text-sm">
                      Create mentorship services
                    </p>
                  </div>
                </div>
                <div className="bg-card flex items-center space-x-3 rounded-lg border p-4">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-medium">Set availability</p>
                    <p className="text-muted-foreground text-sm">
                      Configure your schedule
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {status
                ? `${statusDisplayMap[status as keyof typeof statusDisplayMap]} Bookings`
                : "All Bookings"}
              <Badge variant="secondary" className="text-xs">
                {bookings.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Manage your {status ? status.toLowerCase() : ""} bookings and
              student sessions.
            </CardDescription>
          </div>
          {bookings.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"}
              </span>
            </div>
          )}
        </div>
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
