import { useState, useEffect } from "react";

export interface Donation {
  id: string;
  title: string;
  description: string;
  condition: 'Good' | 'Acceptable' | 'Poor';
  size: string;
  gender?: string;
  quantity: string;
  category: string;
  pickupAddress: string;
  phone: string;
  notes?: string;
  availableTimes?: string;
  status: 'Draft' | 'Available' | 'Claimed' | 'In Transit' | 'Completed';
  claimedBy?: string;
  createdAt: string;
  imagePreviewUrls?: string[];
  donorName: string;
}

const DONATIONS_KEY = 'donations';

// Initialize with sample data if none exists
const getInitialDonations = (): Donation[] => {
  const stored = localStorage.getItem(DONATIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Sample donations for demo
  return [
    {
      id: 'sample1',
      title: 'Winter Coat - Large',
      description: 'Warm winter coat, barely used. Perfect for cold weather.',
      condition: 'Good',
      size: 'l',
      gender: 'unisex',
      quantity: '1',
      category: 'outerwear',
      pickupAddress: '123 Main St, Downtown City',
      phone: '+1-555-0123',
      notes: 'Available weekdays after 5 PM',
      availableTimes: 'Weekdays 5-8 PM',
      status: 'Available',
      createdAt: '2024-01-15',
      donorName: 'John Smith',
      imagePreviewUrls: []
    },
    {
      id: 'sample2',
      title: 'Kids Clothes Bundle',
      description: 'Various children clothing items including shirts, pants, and pajamas.',
      condition: 'Good',
      size: 'child-6-8',
      gender: 'unisex',
      quantity: '5',
      category: 'children',
      pickupAddress: '456 Oak Ave, Suburbia',
      phone: '+1-555-0456',
      notes: 'Multiple items in good condition',
      availableTimes: 'Weekends anytime',
      status: 'Available',
      createdAt: '2024-01-20',
      donorName: 'Sarah Johnson',
      imagePreviewUrls: []
    },
    {
      id: 'sample3',
      title: 'Professional Shirts Bundle',
      description: 'Collection of business shirts, perfect for job interviews or work.',
      condition: 'Good',
      size: 'm',
      gender: 'men',
      quantity: '3',
      category: 'tops',
      pickupAddress: '789 Business Blvd, Corporate District',
      phone: '+1-555-0789',
      notes: 'Dry cleaned and ready to wear',
      availableTimes: 'Weekdays 9 AM - 6 PM',
      status: 'Available',
      createdAt: '2024-01-22',
      donorName: 'Michael Brown',
      imagePreviewUrls: []
    }
  ];
};

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>(() => getInitialDonations());

  // Save to localStorage whenever donations change
  useEffect(() => {
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  }, [donations]);

  const addDonation = (donationData: any, donorName: string) => {
    const newDonation: Donation = {
      id: Date.now().toString(),
      title: donationData.title,
      description: donationData.description,
      condition: donationData.condition,
      size: donationData.size,
      gender: donationData.gender,
      quantity: donationData.quantity,
      category: donationData.category,
      pickupAddress: donationData.pickupAddress,
      phone: donationData.phone,
      notes: donationData.notes,
      availableTimes: donationData.availableTimes,
      status: 'Available',
      createdAt: new Date().toISOString().split('T')[0],
      imagePreviewUrls: donationData.imagePreviewUrls || [],
      donorName
    };
    
    setDonations(prev => [newDonation, ...prev]);
    return newDonation;
  };

  const updateDonationStatus = (donationId: string, status: Donation['status'], claimedBy?: string) => {
    setDonations(prev => prev.map(donation => 
      donation.id === donationId 
        ? { ...donation, status, claimedBy }
        : donation
    ));
  };

  const getDonationsByDonor = (donorName: string) => {
    return donations.filter(donation => donation.donorName === donorName);
  };

  const getAvailableDonations = () => {
    return donations.filter(donation => donation.status === 'Available');
  };

  return {
    donations,
    addDonation,
    updateDonationStatus,
    getDonationsByDonor,
    getAvailableDonations
  };
};