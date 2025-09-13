"use client";

import { useState } from "react";
import {
  Plus,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CommunityManagementPage() {
  const [activeTab, setActiveTab] = useState("communities");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isCreateWebinarOpen, setIsCreateWebinarOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    type: "",
    image: "",
    banner: "",
  });
  const [newWebinar, setNewWebinar] = useState({
    title: "",
    description: "",
    banner: "",
    startDate: "",
    endDate: "",
  });

  const {
    data: communities = [],
    isLoading: isLoadingCommunities,
    refetch: refetchCommunities,
  } = api.community.getMyCommunities.useQuery();

  const {
    data: webinars,
    isLoading: isLoadingWebinars,
    refetch: refetchWebinars,
  } = api.webinar.getMyWebinars.useQuery({ page: 1, limit: 20, status: "all" });

  const { data: webinarStats } = api.webinar.getStats.useQuery();

  const createCommunityMutation = api.community.create.useMutation({
    onSuccess: () => {
      toast.success("Community created successfully!");
      setIsCreateCommunityOpen(false);
      setNewCommunity({
        name: "",
        description: "",
        type: "",
        image: "",
        banner: "",
      });
      void refetchCommunities();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createWebinarMutation = api.webinar.create.useMutation({
    onSuccess: () => {
      toast.success("Webinar created successfully!");
      setIsCreateWebinarOpen(false);
      setNewWebinar({
        title: "",
        description: "",
        banner: "",
        startDate: "",
        endDate: "",
      });
      void refetchWebinars();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleCommunityStatusMutation = api.community.toggleStatus.useMutation({
    onSuccess: () => {
      toast.success("Community status updated!");
      void refetchCommunities();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleWebinarStatusMutation = api.webinar.toggleStatus.useMutation({
    onSuccess: () => {
      toast.success("Webinar status updated!");
      void refetchWebinars();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteCommunityMutation = api.community.delete.useMutation({
    onSuccess: () => {
      toast.success("Community deleted successfully!");
      void refetchCommunities();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteWebinarMutation = api.webinar.delete.useMutation({
    onSuccess: () => {
      toast.success("Webinar deleted successfully!");
      void refetchWebinars();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateCommunity = () => {
    if (
      !newCommunity.name ||
      !newCommunity.description ||
      !newCommunity.type ||
      !newCommunity.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    createCommunityMutation.mutate(newCommunity);
  };

  const handleCreateWebinar = () => {
    if (
      !newWebinar.title ||
      !newWebinar.description ||
      !newWebinar.banner ||
      !newWebinar.startDate ||
      !newWebinar.endDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    createWebinarMutation.mutate({
      ...newWebinar,
      startDate: new Date(newWebinar.startDate),
      endDate: new Date(newWebinar.endDate),
    });
  };

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredWebinars =
    webinars?.webinars?.filter(
      (webinar) =>
        webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Community Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your communities, members, webinars, and analytics
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communities</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communities.length}</div>
            <p className="text-muted-foreground text-xs">
              {communities.filter((c) => c.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communities.reduce((sum, c) => sum + c.memberCount, 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              Across all communities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webinars</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webinarStats?.total ?? 0}</div>
            <p className="text-muted-foreground text-xs">
              {webinarStats?.upcoming ?? 0} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {webinarStats?.thisMonth ?? 0}
            </div>
            <p className="text-muted-foreground text-xs">
              New webinars created
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10"
              />
            </div>

            {activeTab === "communities" && (
              <Dialog
                open={isCreateCommunityOpen}
                onOpenChange={setIsCreateCommunityOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Community
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Community</DialogTitle>
                    <DialogDescription>
                      Set up a new community for your members to engage and
                      learn together.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        value={newCommunity.name}
                        onChange={(e) =>
                          setNewCommunity({
                            ...newCommunity,
                            name: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Community name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type *
                      </Label>
                      <Select
                        value={newCommunity.type}
                        onValueChange={(value) =>
                          setNewCommunity({ ...newCommunity, type: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select community type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image URL *
                      </Label>
                      <Input
                        id="image"
                        value={newCommunity.image}
                        onChange={(e) =>
                          setNewCommunity({
                            ...newCommunity,
                            image: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="banner" className="text-right">
                        Banner URL
                      </Label>
                      <Input
                        id="banner"
                        value={newCommunity.banner}
                        onChange={(e) =>
                          setNewCommunity({
                            ...newCommunity,
                            banner: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={newCommunity.description}
                        onChange={(e) =>
                          setNewCommunity({
                            ...newCommunity,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Describe your community..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateCommunityOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCommunity}
                      disabled={createCommunityMutation.isPending}
                    >
                      {createCommunityMutation.isPending
                        ? "Creating..."
                        : "Create Community"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {activeTab === "webinars" && (
              <Dialog
                open={isCreateWebinarOpen}
                onOpenChange={setIsCreateWebinarOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Webinar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Webinar</DialogTitle>
                    <DialogDescription>
                      Schedule a new webinar for your community members.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title *
                      </Label>
                      <Input
                        id="title"
                        value={newWebinar.title}
                        onChange={(e) =>
                          setNewWebinar({
                            ...newWebinar,
                            title: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Webinar title"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="banner" className="text-right">
                        Banner URL *
                      </Label>
                      <Input
                        id="banner"
                        value={newWebinar.banner}
                        onChange={(e) =>
                          setNewWebinar({
                            ...newWebinar,
                            banner: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startDate" className="text-right">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={newWebinar.startDate}
                        onChange={(e) =>
                          setNewWebinar({
                            ...newWebinar,
                            startDate: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endDate" className="text-right">
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={newWebinar.endDate}
                        onChange={(e) =>
                          setNewWebinar({
                            ...newWebinar,
                            endDate: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={newWebinar.description}
                        onChange={(e) =>
                          setNewWebinar({
                            ...newWebinar,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Describe your webinar..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateWebinarOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateWebinar}
                      disabled={createWebinarMutation.isPending}
                    >
                      {createWebinarMutation.isPending
                        ? "Creating..."
                        : "Create Webinar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <TabsContent value="communities" className="space-y-6">
          {isLoadingCommunities ? (
            <div className="flex h-40 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">
                  No communities found
                </h3>
                <p className="text-muted-foreground mb-4 text-center">
                  {searchQuery
                    ? "No communities match your search."
                    : "Create your first community to get started."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateCommunityOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Community
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={community.banner ?? community.image}
                        alt={community.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={community.isActive ? "default" : "secondary"}
                        >
                          {community.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {community.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {community.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toggleCommunityStatusMutation.mutate({
                                  id: community.id,
                                  isActive: !community.isActive,
                                })
                              }
                            >
                              {community.isActive ? (
                                <>
                                  <PowerOff className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Power className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                deleteCommunityMutation.mutate({
                                  id: community.id,
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {community.memberCount} members
                        </div>
                        <div>
                          {format(new Date(community.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center">
                        <Avatar className="mr-2 h-6 w-6">
                          <AvatarImage src={community.owner.image ?? ""} />
                          <AvatarFallback>
                            {community.owner.name?.charAt(0) ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-sm">
                          {community.owner.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="webinars" className="space-y-6">
          {isLoadingWebinars ? (
            <div className="flex h-40 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : filteredWebinars.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">
                  No webinars found
                </h3>
                <p className="text-muted-foreground mb-4 text-center">
                  {searchQuery
                    ? "No webinars match your search."
                    : "Create your first webinar to get started."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateWebinarOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Webinar
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredWebinars.map((webinar) => (
                <motion.div
                  key={webinar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={webinar.banner}
                        alt={webinar.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={webinar.isActive ? "default" : "secondary"}
                        >
                          {webinar.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {webinar.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {webinar.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toggleWebinarStatusMutation.mutate({
                                  id: webinar.id,
                                  isActive: !webinar.isActive,
                                })
                              }
                            >
                              {webinar.isActive ? (
                                <>
                                  <PowerOff className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Power className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                deleteWebinarMutation.mutate({ id: webinar.id })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-muted-foreground space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {format(
                            new Date(webinar.startDate),
                            "MMM d, yyyy 'at' h:mm a",
                          )}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          Ends:{" "}
                          {format(
                            new Date(webinar.endDate),
                            "MMM d, yyyy 'at' h:mm a",
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Community Performance</CardTitle>
                <CardDescription>
                  Overview of your community metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Total Communities
                    </span>
                    <span className="font-semibold">{communities.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Active Communities
                    </span>
                    <span className="font-semibold">
                      {communities.filter((c) => c.isActive).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Total Members
                    </span>
                    <span className="font-semibold">
                      {communities.reduce((sum, c) => sum + c.memberCount, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Avg. Members per Community
                    </span>
                    <span className="font-semibold">
                      {communities.length > 0
                        ? Math.round(
                            communities.reduce(
                              (sum, c) => sum + c.memberCount,
                              0,
                            ) / communities.length,
                          )
                        : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webinar Performance</CardTitle>
                <CardDescription>
                  Overview of your webinar metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Total Webinars
                    </span>
                    <span className="font-semibold">
                      {webinarStats?.total ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Upcoming
                    </span>
                    <span className="font-semibold">
                      {webinarStats?.upcoming ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Ongoing
                    </span>
                    <span className="font-semibold">
                      {webinarStats?.ongoing ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Completed
                    </span>
                    <span className="font-semibold">
                      {webinarStats?.completed ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      This Month
                    </span>
                    <span className="font-semibold">
                      {webinarStats?.thisMonth ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
