"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  Plus,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CommunityFormData {
  name: string;
  shortDescription: string;
  description: string;
  type: string;
  image: string;
  banner: string;
  maxMembers: number;
  tags: string[];
  isPublic: boolean;
  requiresApproval: boolean;
  allowMemberInvites: boolean;
  guidelines: string;
}

export default function CreateCommunityPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CommunityFormData>({
    name: "",
    shortDescription: "",
    description: "",
    type: "",
    image: "",
    banner: "",
    maxMembers: 100,
    tags: [],
    isPublic: true,
    requiresApproval: false,
    allowMemberInvites: true,
    guidelines: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [newTag, setNewTag] = useState("");

  const createCommunityMutation = api.community.create.useMutation({
    onSuccess: () => {
      toast.success("Community created successfully!");
      router.push("/dashboard/mentor/community");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const steps = [
    {
      title: "Basic Information",
      description: "Community name and short description",
    },
    {
      title: "Detailed Description",
      description: "Rich content about your community",
    },
    {
      title: "Category & Settings",
      description: "Type, capacity, and access settings",
    },
    {
      title: "Images & Branding",
      description: "Upload community visuals",
    },
    {
      title: "Tags & Guidelines",
      description: "Add tags and community rules",
    },
    {
      title: "Review & Create",
      description: "Final review and publish",
    },
  ];

  const uploadFile = async (
    file: File,
    type: "image" | "banner",
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        success: boolean;
        url?: string;
        error?: string;
      };

      if (!result.success) {
        throw new Error(result.error ?? "Upload failed");
      }

      return result.url ?? "";
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    setUploadingImage(true);

    try {
      const url = await uploadFile(file, "image");
      setFormData({ ...formData, image: url });
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    setUploadingBanner(true);

    try {
      const url = await uploadFile(file, "banner");
      setFormData({ ...formData, banner: url });
      toast.success("Banner uploaded successfully!");
    } catch {
      toast.error("Failed to upload banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  const removeImage = async () => {
    if (formData.image) {
      try {
        await fetch(
          `/api/upload/delete?url=${encodeURIComponent(formData.image)}`,
          {
            method: "DELETE",
          },
        );
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
    setFormData({ ...formData, image: "" });
  };

  const removeBanner = async () => {
    if (formData.banner) {
      try {
        await fetch(
          `/api/upload/delete?url=${encodeURIComponent(formData.banner)}`,
          {
            method: "DELETE",
          },
        );
      } catch (error) {
        console.error("Failed to delete banner:", error);
      }
    }
    setFormData({ ...formData, banner: "" });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.name.trim() !== "" && formData.shortDescription.trim() !== ""
        );
      case 2:
        return formData.description.trim() !== "";
      case 3:
        return formData.type !== "";
      case 4:
        return formData.image !== "";
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.shortDescription ||
      !formData.description ||
      !formData.type ||
      !formData.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submissionData = {
      name: formData.name,
      description: formData.shortDescription,
      type: formData.type,
      image: formData.image,
      banner: formData.banner || undefined,
    };

    createCommunityMutation.mutate(submissionData);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Community
                </h1>
                <p className="text-sm text-gray-500">
                  Set up your new learning community
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      index + 1 <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 flex-1 ${
                      index + 1 < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Community Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your community name"
                        className="mt-2"
                      />
                      <p className="text-muted-foreground mt-1 text-sm">
                        Choose a clear, descriptive name that represents your
                        community
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="shortDescription">
                        Short Description *
                      </Label>
                      <Textarea
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shortDescription: e.target.value,
                          })
                        }
                        placeholder="A brief summary of your community (max 300 characters)"
                        rows={3}
                        maxLength={300}
                        className="mt-2"
                      />
                      <p className="text-muted-foreground mt-1 text-sm">
                        {formData.shortDescription.length}/300 characters
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Detailed Description *</Label>
                      <p className="text-muted-foreground mt-1 mb-4 text-sm">
                        Create a comprehensive description of your community.
                        Include what members can expect, learning objectives,
                        activities, and any other relevant information.
                      </p>
                      <RichTextEditor
                        content={formData.description}
                        onChange={(content) =>
                          setFormData({ ...formData, description: content })
                        }
                        placeholder="Tell potential members about your community. What will they learn? What activities will they participate in? What makes your community unique?"
                        maxLength={5000}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Community Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select community type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="career">
                            Career Development
                          </SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="business">
                            Business & Entrepreneurship
                          </SelectItem>
                          <SelectItem value="creative">
                            Creative Arts
                          </SelectItem>
                          <SelectItem value="education">
                            Education & Learning
                          </SelectItem>
                          <SelectItem value="health">
                            Health & Wellness
                          </SelectItem>
                          <SelectItem value="finance">
                            Finance & Investment
                          </SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="maxMembers">Maximum Members</Label>
                      <Input
                        id="maxMembers"
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.maxMembers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxMembers: parseInt(e.target.value) || 100,
                          })
                        }
                        className="mt-2"
                      />
                      <p className="text-muted-foreground mt-1 text-sm">
                        Set the maximum number of members for your community
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label>Community Settings</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isPublic"
                            checked={formData.isPublic}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isPublic: !!checked })
                            }
                          />
                          <Label htmlFor="isPublic" className="text-sm">
                            Public community (visible in search results)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="requiresApproval"
                            checked={formData.requiresApproval}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                requiresApproval: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="requiresApproval" className="text-sm">
                            Require approval for new members
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allowMemberInvites"
                            checked={formData.allowMemberInvites}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                allowMemberInvites: !!checked,
                              })
                            }
                          />
                          <Label
                            htmlFor="allowMemberInvites"
                            className="text-sm"
                          >
                            Allow members to invite others
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div>
                      <Label>Community Image *</Label>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Upload a square image that represents your community
                        (recommended: 400x400px)
                      </p>
                      <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-6">
                        {formData.image ? (
                          <div className="relative">
                            <Image
                              src={formData.image}
                              alt="Community image"
                              width={200}
                              height={200}
                              className="mx-auto rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                            <div className="mt-4">
                              <Label
                                htmlFor="image-upload"
                                className="cursor-pointer"
                              >
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={uploadingImage}
                                  asChild
                                >
                                  <span>
                                    {uploadingImage
                                      ? "Uploading..."
                                      : "Upload Image"}
                                  </span>
                                </Button>
                              </Label>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">
                              JPEG, PNG, WebP up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Community Banner (Optional)</Label>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Upload a banner image for your community header
                        (recommended: 1200x400px)
                      </p>
                      <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-6">
                        {formData.banner ? (
                          <div className="relative">
                            <Image
                              src={formData.banner}
                              alt="Community banner"
                              width={400}
                              height={133}
                              className="mx-auto rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={removeBanner}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                            <div className="mt-4">
                              <Label
                                htmlFor="banner-upload"
                                className="cursor-pointer"
                              >
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={uploadingBanner}
                                  asChild
                                >
                                  <span>
                                    {uploadingBanner
                                      ? "Uploading..."
                                      : "Upload Banner"}
                                  </span>
                                </Button>
                              </Label>
                              <Input
                                id="banner-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleBannerUpload}
                                className="hidden"
                              />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">
                              JPEG, PNG, WebP up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Community Tags</Label>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Add tags to help members discover your community
                      </p>
                      <div className="mb-4 flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground ml-1 h-auto p-0"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Community Guidelines</Label>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Set clear guidelines and rules for your community
                        members
                      </p>
                      <RichTextEditor
                        content={formData.guidelines}
                        onChange={(content) =>
                          setFormData({ ...formData, guidelines: content })
                        }
                        placeholder="Define the rules, expectations, and behavior guidelines for your community members..."
                        maxLength={3000}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div>
                        <h3 className="mb-4 font-semibold">
                          Community Preview
                        </h3>
                        <div className="overflow-hidden rounded-lg border">
                          {formData.banner && (
                            <Image
                              src={formData.banner}
                              alt="Banner preview"
                              width={400}
                              height={150}
                              className="h-32 w-full object-cover"
                            />
                          )}
                          <div className="p-4">
                            <div className="mb-3 flex items-center gap-3">
                              <Image
                                src={formData.image}
                                alt="Community preview"
                                width={50}
                                height={50}
                                className="rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-semibold">
                                  {formData.name}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  {formData.type}
                                </p>
                              </div>
                            </div>
                            <p className="line-clamp-3 text-sm">
                              {formData.shortDescription}
                            </p>
                            {formData.tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {formData.tags.slice(0, 3).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {formData.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{formData.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-4 font-semibold">Details Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">Name:</span>{" "}
                            {formData.name}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {formData.type}
                          </div>
                          <div>
                            <span className="font-medium">Max Members:</span>{" "}
                            {formData.maxMembers}
                          </div>
                          <div>
                            <span className="font-medium">Visibility:</span>{" "}
                            {formData.isPublic ? "Public" : "Private"}
                          </div>
                          <div>
                            <span className="font-medium">
                              Approval Required:
                            </span>{" "}
                            {formData.requiresApproval ? "Yes" : "No"}
                          </div>
                          <div>
                            <span className="font-medium">Member Invites:</span>{" "}
                            {formData.allowMemberInvites
                              ? "Allowed"
                              : "Restricted"}
                          </div>
                          <div>
                            <span className="font-medium">Image:</span>{" "}
                            {formData.image ? "✓ Uploaded" : "✗ Missing"}
                          </div>
                          <div>
                            <span className="font-medium">Banner:</span>{" "}
                            {formData.banner ? "✓ Uploaded" : "✗ Not provided"}
                          </div>
                          <div>
                            <span className="font-medium">Tags:</span>{" "}
                            {formData.tags.length > 0
                              ? formData.tags.join(", ")
                              : "None"}
                          </div>
                          <div>
                            <span className="font-medium">Guidelines:</span>{" "}
                            {formData.guidelines
                              ? "✓ Provided"
                              : "✗ Not provided"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              {currentStep < steps.length ? (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createCommunityMutation.isPending || !canProceed()}
                >
                  {createCommunityMutation.isPending
                    ? "Creating..."
                    : "Create Community"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
