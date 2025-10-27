import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (donationData: any) => void;
}

export default function CreateDonationModal({ isOpen, onClose, onSubmit }: CreateDonationModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: '',
    size: '',
    gender: '',
    quantity: '1',
    category: '',
    pickupAddress: '',
    phone: '',
    notes: '',
    availableTimes: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (selectedImages.length + validFiles.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images",
        variant: "destructive"
      });
      return;
    }

    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.condition || !formData.size) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one photo of the clothing item",
        variant: "destructive"
      });
      return;
    }

    if (formData.condition === 'Poor') {
      toast({
        title: "Condition Not Acceptable",
        description: "We only accept clothing in Good or Acceptable condition to ensure quality donations",
        variant: "destructive"
      });
      return;
    }

    // Submit the donation
    onSubmit({
      ...formData,
      images: selectedImages,
      imagePreviewUrls
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      condition: '',
      size: '',
      gender: '',
      quantity: '1',
      category: '',
      pickupAddress: '',
      phone: '',
      notes: '',
      availableTimes: ''
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);

    toast({
      title: "Donation Created!",
      description: "Your donation has been listed and is available for NGOs to claim"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Create New Donation
          </DialogTitle>
          <DialogDescription>
            Share details about the clothing item you'd like to donate. Make sure items are in good condition.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-3">
            <Label>Photos * (Maximum 5 images, 5MB each)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload images or drag and drop
                </p>
              </label>
            </div>
            
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Item Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Winter Jacket - Size L"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tops">Tops & Shirts</SelectItem>
                  <SelectItem value="bottoms">Pants & Bottoms</SelectItem>
                  <SelectItem value="outerwear">Jackets & Coats</SelectItem>
                  <SelectItem value="dresses">Dresses & Skirts</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="children">Children's Clothing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the item, its features, and any relevant details"
              className="min-h-[80px]"
              required
            />
          </div>

          {/* Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="xxl">XXL</SelectItem>
                  <SelectItem value="3xl">3XL</SelectItem>
                  <SelectItem value="child-2-4">Child 2-4 years</SelectItem>
                  <SelectItem value="child-4-6">Child 4-6 years</SelectItem>
                  <SelectItem value="child-6-8">Child 6-8 years</SelectItem>
                  <SelectItem value="child-8-10">Child 8-10 years</SelectItem>
                  <SelectItem value="child-10-12">Child 10-12 years</SelectItem>
                  <SelectItem value="teen">Teen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unisex">Unisex</SelectItem>
                  <SelectItem value="men">Men's</SelectItem>
                  <SelectItem value="women">Women's</SelectItem>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-3">
            <Label>Condition *</Label>
            <RadioGroup
              value={formData.condition}
              onValueChange={(value) => handleInputChange('condition', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Good" id="good" />
                <Label htmlFor="good" className="flex-1">
                  <span className="font-medium text-success">Good</span>
                  <p className="text-sm text-muted-foreground">No visible damage, clean, ready to wear</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Acceptable" id="acceptable" />
                <Label htmlFor="acceptable" className="flex-1">
                  <span className="font-medium text-warning">Acceptable</span>
                  <p className="text-sm text-muted-foreground">Minor wear, still in good usable condition</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Poor" id="poor" />
                <Label htmlFor="poor" className="flex-1">
                  <span className="font-medium text-destructive">Poor</span>
                  <p className="text-sm text-muted-foreground">Significant wear or damage (not accepted)</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Pickup Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Textarea
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                placeholder="Enter the address where the item can be picked up"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone number for coordination"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableTimes">Preferred Availability</Label>
              <Input
                id="availableTimes"
                value={formData.availableTimes}
                onChange={(e) => handleInputChange('availableTimes', e.target.value)}
                placeholder="e.g., Weekdays 9 AM - 5 PM, Weekends morning"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information or special instructions"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              Create Donation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}