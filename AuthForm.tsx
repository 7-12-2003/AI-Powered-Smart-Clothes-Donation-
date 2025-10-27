import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Heart, User, Building, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onBack: () => void;
  onAuthenticate: (user: { name: string; role: 'Donor' | 'NGO' }) => void;
  initialRole?: 'Donor' | 'NGO';
}

export default function AuthForm({ onBack, onAuthenticate, initialRole }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: initialRole || 'Donor',
    // Common fields
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Donor fields
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    // NGO fields
    orgName: '',
    contactName: '',
    orgAddress: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Mock authentication
    const userName = formData.role === 'Donor' ? formData.fullName : formData.contactName;
    onAuthenticate({
      name: userName || 'User',
      role: formData.role as 'Donor' | 'NGO'
    });

    toast({
      title: `Welcome ${formData.role}!`,
      description: `Successfully ${isLogin ? 'logged in' : 'registered'}`,
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-card gradient-card border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DonateWear
            </span>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Sign in to your account to continue making a difference'
              : 'Join our community and start making an impact'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection (only for registration) */}
            {!isLogin && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">I am a:</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => updateFormData('role', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Donor" id="donor" />
                    <Label htmlFor="donor" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Individual Donor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NGO" id="ngo" />
                    <Label htmlFor="ngo" className="flex items-center gap-2 cursor-pointer">
                      <Building className="w-4 h-4" />
                      NGO
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Name Fields */}
            {!isLogin && (
              <>
                {formData.role === 'Donor' ? (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name *</Label>
                      <Input
                        id="orgName"
                        value={formData.orgName}
                        onChange={(e) => updateFormData('orgName', e.target.value)}
                        placeholder="Enter organization name"
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Person Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => updateFormData('contactName', e.target.value)}
                        placeholder="Enter contact person name"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-0 h-full w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password (registration only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Address Fields (registration only) */}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    {formData.role === 'Donor' ? 'Address' : 'Organization Address'} *
                  </Label>
                  <Input
                    id="address"
                    value={formData.role === 'Donor' ? formData.address : formData.orgAddress}
                    onChange={(e) => updateFormData(formData.role === 'Donor' ? 'address' : 'orgAddress', e.target.value)}
                    placeholder="Enter street address"
                    required={!isLogin}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="City"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                      placeholder="State"
                      required={!isLogin}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                    placeholder="Postal code"
                    required={!isLogin}
                  />
                </div>

                {/* NGO Description */}
                {formData.role === 'NGO' && (
                  <div className="space-y-2">
                    <Label htmlFor="description">Organization Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Brief description of your organization and mission"
                      className="min-h-[80px]"
                    />
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full" variant="hero" size="lg">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>

            <Button variant="ghost" onClick={onBack} className="text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}