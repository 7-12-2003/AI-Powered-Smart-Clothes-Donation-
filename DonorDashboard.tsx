import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Clock, CheckCircle2, Truck, Heart } from "lucide-react";
import CreateDonationModal from "./CreateDonationModal";
import { useDonations } from "@/hooks/useDonations";

interface DonorDashboardProps {
  user: { name: string; role: 'Donor' | 'NGO' };
}

export default function DonorDashboard({ user }: DonorDashboardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { addDonation, getDonationsByDonor } = useDonations();
  
  const donations = getDonationsByDonor(user.name);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Clock className="w-4 h-4" />;
      case 'Available':
        return <Package className="w-4 h-4" />;
      case 'Claimed':
        return <Heart className="w-4 h-4" />;
      case 'In Transit':
        return <Truck className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-muted text-muted-foreground';
      case 'Available':
        return 'bg-primary/10 text-primary';
      case 'Claimed':
        return 'bg-accent/10 text-accent';
      case 'In Transit':
        return 'bg-warning/10 text-warning';
      case 'Completed':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleCreateDonation = (donationData: any) => {
    addDonation(donationData, user.name);
    setIsCreateModalOpen(false);
  };

  const stats = {
    total: donations.length,
    completed: donations.filter(d => d.status === 'Completed').length,
    inProgress: donations.filter(d => ['Claimed', 'In Transit'].includes(d.status)).length,
    available: donations.filter(d => d.status === 'Available').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Thank you for making a difference in our community. Here's your donation summary.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-accent">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary-glow">{stats.available}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            variant="hero"
            size="lg"
            className="shadow-button"
          >
            <Plus className="w-5 h-5" />
            Create New Donation
          </Button>
        </div>

        {/* Donations List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Donations</h2>
          </div>

          {donations.length === 0 ? (
            <Card className="gradient-card border-0 shadow-card">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No donations yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first donation to start helping those in need.
                </p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="hero"
                >
                  <Plus className="w-4 h-4" />
                  Create Donation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {donations.map((donation) => (
                <Card key={donation.id} className="gradient-card border-0 shadow-card hover:shadow-soft transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium">{donation.title}</h3>
                          <Badge className={getStatusColor(donation.status)}>
                            {getStatusIcon(donation.status)}
                            {donation.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{donation.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Size: {donation.size}</span>
                          <span>Condition: {donation.condition}</span>
                          <span>Created: {donation.createdAt}</span>
                        </div>
                        {donation.claimedBy && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">Claimed by:</span> {donation.claimedBy}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {donation.status === 'Available' && (
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Donation Modal */}
      <CreateDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDonation}
      />
    </div>
  );
}