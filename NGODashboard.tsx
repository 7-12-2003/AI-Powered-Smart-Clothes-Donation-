import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, MapPin, User, Clock, Package, Heart, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDonations } from "@/hooks/useDonations";

interface NGODashboardProps {
  user: { name: string; role: 'Donor' | 'NGO' };
}

export default function NGODashboard({ user }: NGODashboardProps) {
  const { getAvailableDonations, updateDonationStatus } = useDonations();
  const donations = getAvailableDonations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [claimedDonations, setClaimedDonations] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || donation.category === selectedCategory;
    const matchesSize = !selectedSize || selectedSize === 'all' || donation.size === selectedSize;
    const matchesCondition = !selectedCondition || selectedCondition === 'all' || donation.condition === selectedCondition;
    const isAvailable = donation.status === 'Available' && !claimedDonations.has(donation.id);
    
    return matchesSearch && matchesCategory && matchesSize && matchesCondition && isAvailable;
  });

  const handleClaimDonation = (donation: any) => {
    setClaimedDonations(prev => new Set([...prev, donation.id]));
    updateDonationStatus(donation.id, 'Claimed', user.name);
    setSelectedDonation(null);
    
    toast({
      title: "Donation Claimed!",
      description: `You have successfully claimed "${donation.title}". The donor has been notified.`
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Good':
        return 'bg-success/10 text-success';
      case 'Acceptable':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const stats = {
    available: filteredDonations.length,
    claimed: claimedDonations.size,
    thisWeek: donations.filter(d => {
      const donationDate = new Date(d.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return donationDate >= weekAgo;
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Browse available clothing donations in your area and claim items that match your beneficiaries' needs.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{stats.available}</div>
              <div className="text-sm text-muted-foreground">Available Donations</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">{stats.claimed}</div>
              <div className="text-sm text-muted-foreground">Claimed by You</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-accent">{stats.thisWeek}</div>
              <div className="text-sm text-muted-foreground">New This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="gradient-card border-0 shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search donations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="xxl">XXL</SelectItem>
                  <SelectItem value="child-2-4">Child 2-4 years</SelectItem>
                  <SelectItem value="child-4-6">Child 4-6 years</SelectItem>
                  <SelectItem value="child-6-8">Child 6-8 years</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Acceptable">Acceptable</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedSize('');
                  setSelectedCondition('');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Donations List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Available Donations</h2>
            <p className="text-muted-foreground">{filteredDonations.length} items found</p>
          </div>

          {filteredDonations.length === 0 ? (
            <Card className="gradient-card border-0 shadow-card">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No donations match your criteria</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later for new donations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDonations.map((donation) => (
                <Card 
                  key={donation.id} 
                  className="gradient-card border-0 shadow-card hover:shadow-soft transition-smooth cursor-pointer"
                  onClick={() => setSelectedDonation(donation)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium">{donation.title}</h3>
                          <Badge className={getConditionColor(donation.condition)}>
                            {donation.condition}
                          </Badge>
                          {parseInt(donation.quantity) > 1 && (
                            <Badge variant="outline">
                              {donation.quantity} items
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-2">{donation.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{donation.donorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Contact for pickup</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{donation.createdAt}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span><strong>Size:</strong> {donation.size}</span>
                          {donation.gender && (
                            <span><strong>Gender:</strong> {donation.gender}</span>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="default" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDonation(donation);
                        }}
                      >
                        <Heart className="w-4 h-4" />
                        Claim Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {selectedDonation.title}
              </DialogTitle>
              <DialogDescription>
                Donation details and pickup information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Donation Image Placeholder */}
              <div className="w-full h-48 bg-muted/50 rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-muted-foreground" />
              </div>

              {/* Item Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Item Details</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Condition:</strong> 
                <Badge className={`ml-2 ${getConditionColor(selectedDonation.condition)}`}>
                  {selectedDonation.condition}
                </Badge>
              </div>
              <div><strong>Size:</strong> {selectedDonation.size}</div>
              {selectedDonation.gender && (
                <div><strong>Gender:</strong> {selectedDonation.gender}</div>
              )}
              <div><strong>Quantity:</strong> {selectedDonation.quantity || 1}</div>
              <div><strong>Category:</strong> {selectedDonation.category}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Donor Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{selectedDonation.donorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Contact for address</span>
              </div>
              {selectedDonation.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{selectedDonation.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedDonation.description}</p>
              </div>

              {/* Pickup Information */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Pickup Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Address:</strong> {selectedDonation.pickupAddress}</div>
                  {selectedDonation.availableTimes && (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 mt-0.5" />
                      <div>
                        <strong>Available Times:</strong>
                        <br />
                        {selectedDonation.availableTimes}
                      </div>
                    </div>
                  )}
                  {selectedDonation.notes && (
                    <div><strong>Notes:</strong> {selectedDonation.notes}</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  variant="hero" 
                  onClick={() => handleClaimDonation(selectedDonation)}
                  className="flex-1"
                >
                  <Heart className="w-4 h-4" />
                  Claim This Donation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}