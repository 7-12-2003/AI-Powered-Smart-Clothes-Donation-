import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Shirt, CheckCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-donation.jpg";

interface HomePageProps {
  onGetStarted: (role: 'Donor' | 'NGO') => void;
}

export default function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Share Warmth,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Share Hope
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Connect with NGOs and make a difference in your community. Donate quality clothing 
                items and help those who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => onGetStarted('Donor')}
                  className="min-w-[200px]"
                >
                  <Heart className="w-5 h-5" />
                  I Want to Donate
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => onGetStarted('NGO')}
                  className="min-w-[200px]"
                >
                  <Users className="w-5 h-5" />
                  I'm an NGO
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-primary opacity-20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="People donating clothes together"
                className="relative z-10 rounded-3xl shadow-card w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to make a meaningful impact in your community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Donors */}
            <Card className="p-8 text-center gradient-card border-0 shadow-card hover:shadow-soft transition-smooth">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shirt className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Donate Clothes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload photos of your quality clothing items, add descriptions, and set pickup details. 
                We ensure only good-condition items reach those in need.
              </p>
            </Card>

            {/* Matching */}
            <Card className="p-8 text-center gradient-card border-0 shadow-card hover:shadow-soft transition-smooth">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">NGO Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verified NGOs browse available donations in their area and claim items 
                that match their current needs and beneficiaries.
              </p>
            </Card>

            {/* Impact */}
            <Card className="p-8 text-center gradient-card border-0 shadow-card hover:shadow-soft transition-smooth">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                Follow your donation journey from pickup to delivery. See the real impact 
                your generosity makes in someone's life.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Making a Difference</h2>
            <p className="text-lg text-muted-foreground">
              Together, we're building a community of care
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Items Donated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Partner NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-success mb-2">800+</div>
              <div className="text-sm text-muted-foreground">People Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-glow mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Cities Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of donors and NGOs who are already making an impact in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="xl"
              onClick={() => onGetStarted('Donor')}
            >
              Start Donating Today
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => onGetStarted('NGO')}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Join as NGO Partner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}